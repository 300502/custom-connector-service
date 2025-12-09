const tokenManager = require('./utils/tokenManager');

async function probarTokenManager() {
    console.log('🧪 Probando sistema de tokens...\n');
    
    try {
        // 1. Obtener estado inicial
        console.log('1. Estado inicial:');
        console.log(tokenManager.obtenerEstadoToken());
        
        // 2. Obtener primer token
        console.log('\n2. Obteniendo primer token...');
        const token1 = await tokenManager.getValidToken();
        console.log('✅ Token obtenido:', token1.substring(0, 15) + '...');
        
        // 3. Verificar que usa el mismo token (cache)
        console.log('\n3. Solicitando token nuevamente (debería usar cache)...');
        const token2 = await tokenManager.getValidToken();
        console.log('✅ Mismo token:', token1 === token2 ? 'Sí' : 'No');
        
        // 4. Forzar renovación
        console.log('\n4. Forzando renovación de token...');
        const token3 = await tokenManager.renovarTokenForzado();
        console.log('✅ Nuevo token:', token3.substring(0, 15) + '...');
        console.log('✅ Diferente del anterior:', token1 !== token3 ? 'Sí' : 'No');
        
        // 5. Estado final
        console.log('\n5. Estado final:');
        console.log(tokenManager.obtenerEstadoToken());
        
        console.log('\n🎉 Todas las pruebas pasaron!');
        
    } catch (error) {
        console.error('❌ Error en pruebas:', error.message);
        console.log('\n💡 Asegúrate de tener configurados en .env:');
        console.log('   BLACKBOARD_CLIENT_ID');
        console.log('   BLACKBOARD_CLIENT_SECRET');
    }
}

probarTokenManager();