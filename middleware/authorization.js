

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
        // DEBUG: Log todos los headers
        console.log('\n=== KORE.AI REQUEST DEBUG ===');
        console.log('Method:', req.method);
        console.log('URL:', req.url);
        console.log('ALL Headers:', JSON.stringify(req.headers, null, 2));
        
        const authHeaders = req.headers.authorization || req.headers.Authorization;
        console.log('Auth header extracted:', authHeaders);
        
        // Valor esperado desde .env
        const expectedAuth = process.env.Authorization || 'prueba12345';
        const expectedBase64 = Buffer.from(expectedAuth).toString('base64');
        console.log('Expected (env):', expectedAuth);
        console.log('Expected (base64):', expectedBase64);
        
        // Lista de valores aceptables
        const validValues = [
            expectedBase64,                    // "cHJ1ZWJhMTIzNDU="
            `Basic ${expectedBase64}`,        // "Basic cHJ1ZWJhMTIzNDU="
            expectedAuth,                     // "prueba12345"
            `Basic ${expectedAuth}`           // "Basic prueba12345"
        ];
        
        console.log('Valid values:', validValues);
        
        // Verificar si el header recibido está en la lista
        const isValid = validValues.includes(authHeaders);
        
        if (isValid) {
            console.log('✅ AUTH SUCCESS - Header matches');
            return next();
        }
        
        console.log('❌ AUTH FAILED');
        console.log('Received value:', authHeaders);
        console.log('Type of received:', typeof authHeaders);
        console.log('Length:', authHeaders ? authHeaders.length : 'null');
        
        // Verificar si es undefined/null
        if (!authHeaders) {
            console.log('⚠️ No Authorization header found');
            return res.status(403).json({ 
                error: 'Unauthorized: No Authorization header provided',
                hint: 'Add header: Authorization: cHJ1ZWJhMTIzNDU='
            });
        }
        
        return res.status(403).json({ 
            error: 'Unauthorized: Invalid Authorization header',
            hint: 'Expected: cHJ1ZWJhMTIzNDU= or Basic cHJ1ZWJhMTIzNDU=',
            received: authHeaders.substring(0, 50) + (authHeaders.length > 50 ? '...' : '')
        });
    } catch (err) {
        console.log('Auth error:', err);
        return res.status(403).json({ error: 'Forbidden: Authorization error' });
    }
}

module.exports = {
    checkAuthorized
}
