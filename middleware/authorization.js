

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
    console.log('\n' + '='.repeat(60));
    console.log('🔍 KORE.AI AUTH DEBUG');
    console.log('='.repeat(60));
    
    const authHeader = req.headers.authorization || req.headers.Authorization;
    
    console.log('📨 Request URL:', req.url);
    console.log('🔑 Auth Header Received:', authHeader);
    console.log('📏 Length:', authHeader ? authHeader.length : 'null');
    
    if (authHeader) {
        console.log('🔍 First 20 chars:', authHeader.substring(0, 20));
        console.log('🔍 Char codes:');
        for (let i = 0; i < Math.min(authHeader.length, 20); i++) {
            console.log(`  [${i}] "${authHeader[i]}" = ${authHeader.charCodeAt(i)}`);
        }
    }
    
    // TEMPORAL: ACEPTAR CUALQUIER VALOR NO VACÍO
    if (authHeader && authHeader.trim() !== '') {
        console.log('✅ Accepting any non-empty auth header for now');
        return next();
    }
    
    console.log('❌ No auth header or empty');
    return res.status(403).json({ error: 'Authentication Failed' });
}

module.exports = {
    checkAuthorized
}
