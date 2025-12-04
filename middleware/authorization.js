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
        
        // ============================================
        // MÉTODO ORIGINAL (compatible)
        // ============================================
        // Si existe x-header-config, usar lógica original
        const configHeader = req.headers['x-header-config'];
        if (configHeader) {
            console.log('📋 Using original x-header-config method');
            // Aquí iría la lógica original con x-header-config
            // Por ahora solo logueamos
        }
        
        // ============================================
        // MÉTODO KORE.AI (doble Base64)
        // ============================================
        // Kore.ai hace DOBLE Base64 encoding:
        // 1. "prueba12345" -> "cHJ1ZWJhMTIzNDU="
        // 2. "cHJ1ZWJhMTIzNDU=" -> "Y0hKMVpXSmhNVEl6TkRVPQ=="
        
        // Decodificar primera vez
        const decodedOnce = Buffer.from(authHeader, 'base64').toString();
        console.log('🔓 First decode:', `"${decodedOnce}"`);
        
        // Intentar decodificar segunda vez
        let finalValue = decodedOnce;
        try {
            const decodedTwice = Buffer.from(decodedOnce, 'base64').toString();
            console.log('🔓 Second decode:', `"${decodedTwice}"`);
            finalValue = decodedTwice;
        } catch (err) {
            console.log('📝 Not double-encoded, using first decode');
        }
        
        // ============================================
        // MÚLTIPLES FORMATOS SOPORTADOS
        // ============================================
        const expectedPlain = process.env.AUTHORIZATION || 'prueba12345';
        const expectedBase64 = Buffer.from(expectedPlain).toString('base64');
        
        console.log('🎯 Expected plain:', `"${expectedPlain}"`);
        console.log('🎯 Expected base64:', `"${expectedBase64}"`);
        
        // Formato 1: Doble Base64 (Kore.ai actual)
        if (finalValue === expectedPlain) {
            console.log('✅ AUTH SUCCESS: Double-base64 match');
            console.log('✅'.repeat(30));
            return next();
        }
        
        // Formato 2: Base64 directo (método original)
        if (authHeader === expectedBase64) {
            console.log('✅ AUTH SUCCESS: Direct base64 match');
            console.log('✅'.repeat(30));
            return next();
        }
        
        // Formato 3: Texto plano directo
        if (authHeader === expectedPlain) {
            console.log('✅ AUTH SUCCESS: Plain text match');
            console.log('✅'.repeat(30));
            return next();
        }
        
        // Formato 4: Basic Auth
        if (authHeader.startsWith('Basic ')) {
            const base64Part = authHeader.substring(6);
            try {
                const decoded = Buffer.from(base64Part, 'base64').toString();
                if (decoded === expectedPlain) {
                    console.log('✅ AUTH SUCCESS: Basic auth match');
                    console.log('✅'.repeat(30));
                    return next();
                }
            } catch (err) {
                // Error en decodificación
            }
        }
        
        console.log('❌ AUTHENTICATION FAILED - All formats checked');
        console.log('❌'.repeat(30));
        return res.status(403).json({ 
            error: 'Authentication Failed',
            debug: {
                received: authHeader,
                decoded: finalValue,
                expectedPlain: expectedPlain,
                expectedBase64: expectedBase64
            }
        });
        
    } catch (err) {
        console.log('Auth error:', err);
        return res.status(403).json({ error: 'Authentication Failed - Server Error' });
    }
}

module.exports = { checkAuthorized };