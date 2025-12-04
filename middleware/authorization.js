

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
        
        let authHeader = req.headers.authorization || req.headers.Authorization;
        console.log('📨 Raw auth header:', `"${authHeader}"`);
        console.log('📏 Raw length:', authHeader ? authHeader.length : 'null');
        
        // Mostrar caracteres especiales
        if (authHeader) {
            console.log('🔍 Character analysis:');
            for (let i = 0; i < authHeader.length; i++) {
                const char = authHeader[i];
                const code = authHeader.charCodeAt(i);
                console.log(`  [${i}] "${char === ' ' ? 'SPACE' : char}" = ${code} ${code === 32 ? '(SPACE)' : ''}`);
            }
        }
        
        // TRIM el header (eliminar espacios al inicio y final)
        if (authHeader) {
            const beforeTrim = authHeader;
            authHeader = authHeader.trim();
            console.log('✂️ After trim:', `"${authHeader}"`);
            console.log('📏 After trim length:', authHeader.length);
            
            if (beforeTrim !== authHeader) {
                console.log('⚠️ Header needed trimming!');
                console.log('Before:', JSON.stringify(beforeTrim));
                console.log('After:', JSON.stringify(authHeader));
            }
        }
        
        const expected = 'cHJ1ZWJhMTIzNDU=';
        console.log('🎯 Expected:', `"${expected}"`);
        console.log('📏 Expected length:', expected.length);
        
        // Comparar después del trim
        const isValid = authHeader === expected;
        console.log('✅ Match after trim:', isValid);
        
        if (isValid) {
            console.log('🎉 AUTHENTICATION SUCCESSFUL!');
            return next();
        }
        
        console.log('❌ AUTHENTICATION FAILED');
        return res.status(403).json({ 
            error: 'Authentication Failed',
            hint: 'Expected: cHJ1ZWJhMTIzNDU= (without trailing spaces)',
            debug: {
                received: authHeader,
                receivedLength: authHeader ? authHeader.length : 0,
                expected: expected,
                expectedLength: expected.length
            }
        });
        
    } catch (err) {
        console.log('Auth error:', err);
        return res.status(403).json({ error: 'Authentication Failed - Server Error' });
    }
}

module.exports = { checkAuthorized };
