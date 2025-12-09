const { readConfig } = require('../utils/readConfig');
const { default: axios } = require("axios");
const { formatData } = require('../utils/formatData');
const tokenManager = require('../utils/tokenManager');

const get_content_controller = async (req, res) => {
    try {
        console.log('📥 Solicitud recibida de Kore.ai');
        
        // Validar parámetros
        const limite = parseInt(req?.query?.limit) || 30;
        const desplazamiento = parseInt(req?.query?.offset) || 0;
        
        if (!req?.query?.limit || !req?.query?.offset) {
            return res.status(400).json({ error: 'Parámetros limit y offset son obligatorios' });
        }
        
        // Cargar configuración
        const config = await readConfig();
        
        // Obtener token válido (se renueva automáticamente si es necesario)
        let tokenBlackboard;
        try {
            tokenBlackboard = await tokenManager.getValidToken();
        } catch (tokenError) {
            console.error('❌ Error con token de Blackboard:', tokenError.message);
            return res.status(500).json({ 
                error: 'Error de autenticación con Blackboard',
                detalle: 'No se pudo obtener token de acceso'
            });
        }
        
        // Configurar llamada a API de Blackboard con el token
        const opcionesRequest = {
            url: config?.configuration?.api?.contentUrl,
            method: config?.configuration?.api?.method,
            headers: {
                "Authorization": `Bearer ${tokenBlackboard}`,
                "Accept": "application/json"
            },
            params: {
                limit: limite,
                offset: desplazamiento
            },
            timeout: 30000
        };
        
        console.log(`🔗 Conectando con Blackboard (${limite} registros desde ${desplazamiento})`);
        
        // Ejecutar llamada a API de Blackboard
        let respuestaBlackboard;
        try {
            respuestaBlackboard = await axios(opcionesRequest);
        } catch (apiError) {
            // Si es error 401, el token podría haber expirado
            if (apiError.response && apiError.response.status === 401) {
                console.log('🔄 Token posiblemente expirado, intentando renovar...');
                
                try {
                    // Forzar renovación y reintentar
                    tokenBlackboard = await tokenManager.renovarTokenForzado();
                    
                    opcionesRequest.headers.Authorization = `Bearer ${tokenBlackboard}`;
                    respuestaBlackboard = await axios(opcionesRequest);
                    
                } catch (retryError) {
                    console.error('❌ Error después de renovar token:', retryError.message);
                    return res.status(401).json({ 
                        error: 'Error de autenticación con Blackboard',
                        detalle: 'Credenciales inválidas o expiradas'
                    });
                }
            } else {
                throw apiError;
            }
        }
        
        // Formatear datos
        const datosFormateados = await formatData(
            respuestaBlackboard.data, 
            config?.configuration?.lookupFields
        );
        
        // Determinar si hay más contenido disponible
        const elementosRecibidos = respuestaBlackboard.data?.results?.length || 0;
        const hayMasContenido = elementosRecibidos >= limite;
        
        console.log(`✅ ${elementosRecibidos} elementos procesados, más disponibles: ${hayMasContenido}`);
        
        // Retornar respuesta
        return res.json({
            ...datosFormateados,
            isContentAvailable: hayMasContenido
        });
        
    } catch (error) {
        console.error('❌ Error en el controlador:', error.message);
        
        // Manejar errores específicos
        if (error.response) {
            const status = error.response.status;
            const mensajes = {
                400: 'Solicitud incorrecta a Blackboard',
                403: 'Acceso denegado al curso',
                404: 'Recurso no encontrado',
                429: 'Demasiadas solicitudes',
                500: 'Error interno de Blackboard',
                503: 'Blackboard no disponible temporalmente'
            };
            
            return res.status(status).json({ 
                error: mensajes[status] || `Error ${status} de Blackboard`,
                detalle: error.response.data?.message || error.message
            });
        }
        
        return res.status(500).json({ 
            error: 'Error interno del servidor',
            detalle: error.message
        });
    }
};

module.exports = { get_content_controller };