const verificarAutenticacion = async function (req, res, next) {
    try {
        // Obtener header de autorización
        const headerAuth = req.headers.authorization || req.headers.Authorization;
        
        if (!headerAuth) {
            console.log('❌ No se proporcionó header de autorización');
            return res.status(403).json({ error: 'Autenticación requerida' });
        }
        
        // Clave esperada desde variables de entorno
        const claveEsperada = process.env.AUTHORIZATION || 'prueba12345';
        const claveEsperadaBase64 = Buffer.from(claveEsperada).toString('base64');
        
        // Verificar múltiples formatos de autenticación
        const esValido = 
            // Formato 1: Doble Base64 (formato Kore.ai)
            Buffer.from(headerAuth, 'base64').toString() === claveEsperada ||
            
            // Formato 2: Base64 directo
            headerAuth === claveEsperadaBase64 ||
            
            // Formato 3: Texto plano
            headerAuth === claveEsperada ||
            
            // Formato 4: Basic Auth
            (headerAuth.startsWith('Basic ') && 
             Buffer.from(headerAuth.substring(6), 'base64').toString() === claveEsperada);
        
        if (esValido) {
            console.log('✅ Autenticación exitosa');
            return next();
        }
        
        console.log('❌ Autenticación fallida');
        return res.status(403).json({ error: 'Credenciales inválidas' });
        
    } catch (error) {
        console.log('Error en autenticación:', error.message);
        return res.status(403).json({ error: 'Error en el servidor de autenticación' });
    }
};

module.exports = { checkAuthorized: verificarAutenticacion };