const axios = require('axios');

class TokenManager {
    constructor() {
        this.accessToken = null;
        this.expiresAt = null;
        this.isRefreshing = false;
        this.refreshQueue = [];
        
        // Credenciales desde variables de entorno
        this.clientId = process.env.BLACKBOARD_CLIENT_ID;
        this.clientSecret = process.env.BLACKBOARD_CLIENT_SECRET;
        this.tokenUrl = process.env.BLACKBOARD_TOKEN_URL;
        
        if (!this.clientId || !this.clientSecret) {
            console.error('❌ BLACKBOARD_CLIENT_ID o BLACKBOARD_CLIENT_SECRET no configurados');
        } else {
            console.log('✅ Token Manager inicializado para Blackboard');
        }
    }
    
    // Obtener token válido (renueva automáticamente si es necesario)
    async getValidToken() {
        // Si el token es válido y no está próximo a expirar (margen de 60 segundos)
        if (this.accessToken && this.expiresAt && (Date.now() + 60000) < this.expiresAt) {
            console.log('✅ Usando token existente');
            return this.accessToken;
        }
        
        // Si ya se está refrescando, esperar en la cola
        if (this.isRefreshing) {
            console.log('⏳ Esperando renovación de token...');
            return new Promise((resolve) => {
                this.refreshQueue.push(resolve);
            });
        }
        
        // Renovar el token
        return this.obtenerNuevoToken();
    }
    
    // Obtener nuevo token desde Blackboard
    async obtenerNuevoToken() {
        try {
            console.log('🔄 Solicitando nuevo token de Blackboard...');
            this.isRefreshing = true;
            
            // Codificar credenciales para Basic Auth
            const credentials = Buffer.from(`${this.clientId}:${this.clientSecret}`).toString('base64');
            
            // Configurar petición para token OAuth2
            const response = await axios({
                method: 'post',
                url: this.tokenUrl,
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': `Basic ${credentials}`
                },
                data: 'grant_type=client_credentials',
                timeout: 10000
            });
            
            const { access_token, expires_in } = response.data;
            
            if (!access_token) {
                throw new Error('Token no recibido en la respuesta');
            }
            
            // Calcular tiempo de expiración (con margen de seguridad)
            this.accessToken = access_token;
            this.expiresAt = Date.now() + (expires_in * 1000) - 60000; // Restar 1 minuto como margen
            
            console.log(`✅ Nuevo token obtenido, válido por ${expires_in} segundos`);
            console.log(`⏰ Expira en: ${new Date(this.expiresAt).toLocaleTimeString()}`);
            
            // Resolver todas las peticiones en espera
            this.procesarColaEspera(access_token);
            
            return access_token;
            
        } catch (error) {
            console.error('❌ Error al obtener token:', error.message);
            
            if (error.response) {
                console.error('📊 Detalles:', {
                    status: error.response.status,
                    data: error.response.data
                });
            }
            
            // Limpiar estado de refresco
            this.isRefreshing = false;
            this.refreshQueue = [];
            
            throw new Error(`Fallo al obtener token: ${error.message}`);
        }
    }
    
    // Procesar peticiones en espera
    procesarColaEspera(token) {
        console.log(`🔄 Resolviendo ${this.refreshQueue.length} peticiones en espera`);
        
        while (this.refreshQueue.length > 0) {
            const resolve = this.refreshQueue.shift();
            resolve(token);
        }
        
        this.isRefreshing = false;
    }
    
    // Forzar renovación del token (para uso manual)
    async renovarTokenForzado() {
        console.log('🔧 Renovación forzada de token');
        this.accessToken = null;
        this.expiresAt = null;
        return await this.obtenerNuevoToken();
    }
    
    // Verificar estado del token
    obtenerEstadoToken() {
        return {
            tieneToken: !!this.accessToken,
            expiraEn: this.expiresAt ? Math.max(0, this.expiresAt - Date.now()) / 1000 : 0,
            expiraEnSegundos: this.expiresAt ? Math.round((this.expiresAt - Date.now()) / 1000) : 0,
            proximaRenovacion: this.expiresAt ? new Date(this.expiresAt).toLocaleTimeString() : 'N/A'
        };
    }
}

// Singleton para usar una única instancia en toda la app
module.exports = new TokenManager();