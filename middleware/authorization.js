

//verify the token 
// const checkAuthorized = async function (req, res, next) {
//     try {
//         const configHeader = req.headers['x-header-config'];
        
//         if (!configHeader) {
//             // Fallback to old simple authorization check
//             const authHeaders = req.headers.authorization || req.headers.Authorization;
//             if (authHeaders === Buffer.from(process.env.Authorization).toString('base64')) {
//                 return next();
//             }
//             return res.status(403).json({ error: 'Forbidden: Invalid Authorization header' });
//         }
        
//         // New config-based validation
//         const headerConfigs = JSON.parse(Buffer.from(configHeader, 'base64').toString('utf-8')).map(c => ({...c, encodingFormat: c.encodingFormat || 'base64'}));
        
//         for (const config of headerConfigs) {
//             const incomingValue = req.headers[config.key] || req.headers[config.key.toLowerCase()];
//             const expectedValue = process.env[config.key];
//             const decodedValue = config.encodingFormat === 'base64' ? Buffer.from(incomingValue, 'base64').toString('utf-8') : incomingValue;
            
//             if (decodedValue !== expectedValue) {
//                 return res.status(403).json({ error: `Forbidden: Invalid ${config.key}` });
//             }
//         }
        
//         next();
//     } catch (err) {
//         console.log(err);
//         return res.status(403).json({ error: 'Forbidden: Authorization error' });
//     }
// }
const checkAuthorized = async function (req, res, next) {
    try {
        console.log('\n' + '='.repeat(60));
        console.log('🔐 KORE.AI AUTH DEBUG');
        console.log('='.repeat(60));
        
        const authHeader = req.headers.authorization || req.headers.Authorization;
        console.log('📨 Raw auth header:', `"${authHeader}"`);
        
        if (!authHeader) {
            console.log('❌ No auth header');
            return res.status(403).json({ error: 'Authentication Failed' });
        }
        
        // Kore.ai hace DOBLE Base64 encoding:
        // 1. "prueba12345" -> "cHJ1ZWJhMTIzNDU="
        // 2. "cHJ1ZWJhMTIzNDU=" -> "Y0hKMVpXSmhNVEl6TkRVPQ=="
        
        // Decodificar primera vez
        const decodedOnce = Buffer.from(authHeader, 'base64').toString();
        console.log('🔓 First decode:', `"${decodedOnce}"`);
        
        // Intentar decodificar segunda vez
        let finalValue = decodedOnce;
        try {
            // Si es Base64 válido, decodificar segunda vez
            const decodedTwice = Buffer.from(decodedOnce, 'base64').toString();
            console.log('🔓 Second decode:', `"${decodedTwice}"`);
            finalValue = decodedTwice;
        } catch (err) {
            // Si no es Base64 válido, usar el primer decode
            console.log('📝 Not double-encoded, using first decode');
        }
        
        // Verificar si coincide con el valor esperado
        const expected = 'prueba12345';
        console.log('🎯 Expected:', `"${expected}"`);
        console.log('🎯 Received:', `"${finalValue}"`);
        
        if (finalValue === expected) {
            console.log('✅ AUTHENTICATION SUCCESSFUL!');
            console.log('✅'.repeat(30));
            return next();
        }
        
        console.log('❌ AUTHENTICATION FAILED');
        console.log('❌'.repeat(30));
        return res.status(403).json({ 
            error: 'Authentication Failed',
            debug: {
                received: authHeader,
                decoded: finalValue,
                expected: expected
            }
        });
        
    } catch (err) {
        console.log('Auth error:', err);
        return res.status(403).json({ error: 'Authentication Failed - Server Error' });
    }
}

module.exports = { checkAuthorized };
