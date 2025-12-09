const route = require('express').Router()
const { get_content_controller } = require("../controller/content.controller")
const { checkAuthorized } = require("../middleware/authorization")
const tokenManager = require('../utils/tokenManager'); 

// Ruta para obtener contenido
route.get('/getContent', checkAuthorized, get_content_controller)

// Ruta para monitorear estado del token (solo desarrollo)
route.get('/token-status', checkAuthorized, (req, res) => {
    const estado = tokenManager.obtenerEstadoToken();
    res.json({
        servicio: 'Blackboard Connector',
        estadoToken: estado,
        timestamp: new Date().toISOString(),
        entorno: process.env.NODE_ENV || 'development'
    });
});

// Ruta para forzar renovación de token
route.post('/refresh-token', checkAuthorized, async (req, res) => {
    try {
        const nuevoToken = await tokenManager.renovarTokenForzado();
        const estado = tokenManager.obtenerEstadoToken();
        
        res.json({
            mensaje: 'Token renovado exitosamente',
            tokenRenovado: !!nuevoToken,
            estado: estado,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        res.status(500).json({
            error: 'Error al renovar token',
            detalle: error.message
        });
    }
});


module.exports = route