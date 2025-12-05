// const { readConfig } = require('../utils/readConfig')
// const { default: axios } = require("axios")
// const fs = require('fs');
// const path = require('path')
// const { formatData } = require('../utils/formatData')

// const get_content_controller = async (req, res) => {
//     try {
//         if (!req?.query?.limit || !req?.query?.offset) return res.status(400).json({ error: 'The request parameters is missing.' })

//         const limit = req?.query?.limit
//         const offset = req?.query?.offset

//         const config = await readConfig()


//         const apiUrl = config?.configuration?.api?.contentUrl
//         const method = config?.configuration?.api?.method

//         const credentials = {
//             username: config?.authDetails?.username,
//             password: config?.authDetails?.password
//         };

//         const accessToken = Buffer.from(`${credentials.username}:${credentials.password}`).toString('base64');

//         const headers = {
//             "Authorization": `Basic ${accessToken}`,
//             "Accept": "application/json",
//             "Content-Type": "application/json"
//         };

//         const limitKey = config?.configuration?.pagination?.limit
//         const offsetKey = config?.configuration?.pagination?.offset

//         let params = {}
//         params[limitKey] = limit
//         params[offsetKey] = offset

//         const reqOptions = {
//             url: apiUrl,
//             method: method,
//             headers: headers,
//             params: params
//         }


//         //  Uncomment this as per requirement
//         const response = await axios(reqOptions)
//         let data = await formatData(response?.data, config?.configuration?.lookupFields)
//         const hasMoreKey = config?.configuration?.hasMore
//         //this check is only for service now api
//         const headerLinkData = response?.headers?.link
//         data['isContentAvailable'] = (headerLinkData && headerLinkData.includes(hasMoreKey)) ?? JSON.stringify(data).includes(hasMoreKey);
//         return res.json(data)


//         // For testing purposes: Read from a sample file
//         const filePath = limit === "1"
//             ? path.join(__dirname, '../TestFiles/sampleDoc.txt')
//             : path.join(__dirname, '../TestFiles/sampleDocs.txt');
//         fs.readFile(filePath, 'utf8', (err, data) => {
//             if (err) {
//                 return res.status(500).json({ error: 'Failed to read the file.' });
//             }
//             try {
//                 const jsonData = JSON.parse(data);
//                 return res.json(jsonData);
//             } catch (parseError) {
//                 // Handle JSON parse errors
//                 return res.status(500).json({ error: 'Failed to parse the file content.' });
//             }
//         });

//     } catch (error) {
//         console.error('Error fetching data ', error.message)
//         return res.status(500).json({ error: error.message || "Failed to fetch data" })

//     }

// }

// module.exports = { get_content_controller }



const { readConfig } = require('../utils/readConfig')
const { default: axios } = require("axios")
const fs = require('fs');
const path = require('path')
const { formatData } = require('../utils/formatData')

const get_content_controller = async (req, res) => {
    try {
        console.log('\n' + '='.repeat(60));
        console.log('🎯 GET CONTENT REQUEST FROM KORE.AI');
        console.log('='.repeat(60));
        
        // Si el middleware pasó aquí, Kore.ai YA está autenticado
        console.log('✅ Kore.ai authentication already verified by middleware');
        
        if (!req?.query?.limit || !req?.query?.offset) {
            console.log('❌ Missing parameters');
            return res.status(400).json({ error: 'The request parameters is missing.' })
        }

        const limit = req?.query?.limit
        const offset = req?.query?.offset

        console.log('📊 Query params:', { limit, offset });

        const config = await readConfig()
        console.log('📄 Config loaded:', config?.name);
        
        const apiUrl = config?.configuration?.api?.contentUrl
        const method = config?.configuration?.api?.method

        console.log('🔗 Blackboard API URL:', apiUrl);
        console.log('📝 Method:', method);
        
        // ============================================
        // AUTENTICACIÓN CON BLACKBOARD
        // ============================================
        // OPCIÓN 1: Token fijo en .env (RECOMENDADO)
        const blackboardToken = process.env.BLACKBOARD_TOKEN || '';
        
        // OPCIÓN 2: Si quieres pasarlo desde Kore.ai en otro header
        // const blackboardToken = req.headers['x-blackboard-token'] || '';
        
        if (!blackboardToken) {
            console.log('❌ No Blackboard token configured');
            return res.status(500).json({ 
                error: 'Server configuration error',
                details: 'Blackboard token not configured in environment variables' 
            });
        }
        
        console.log('🔑 Blackboard token available');
        
        // Headers para Blackboard
        const headers = {
            "Authorization": `Bearer ${blackboardToken}`,
            "Accept": "application/json",
            "Content-Type": "application/json"
        };

        const limitKey = config?.configuration?.pagination?.limit
        const offsetKey = config?.configuration?.pagination?.offset

        let params = {}
        params[limitKey] = limit
        params[offsetKey] = offset

        console.log('📋 Request params:', params);
        
        const reqOptions = {
            url: apiUrl,
            method: method,
            headers: headers,
            params: params,
            timeout: 30000
        }

        console.log('⏳ Making request to Blackboard...');
        
        try {
            // LLAMADA REAL A BLACKBOARD API
            const response = await axios(reqOptions)
            
            console.log('✅ Blackboard response status:', response.status);
            console.log('📦 Data received:', response.data?.results?.length || 0, 'items');
            
            // Formatear datos según la configuración
            let data = await formatData(response?.data, config?.configuration?.lookupFields)
            
            // Para Blackboard, marcamos como disponible si hay datos
            if (data && typeof data === 'object') {
                data['isContentAvailable'] = true;
            }
            
            console.log('✅ Response ready');
            console.log('✅'.repeat(30));
            
            return res.json(data)
            
        } catch (blackboardError) {
            console.error('❌ Blackboard API error:', blackboardError.message);
            
            if (blackboardError.response) {
                console.error('📊 Response status:', blackboardError.response.status);
                
                if (blackboardError.response.status === 401) {
                    return res.status(401).json({ 
                        error: 'Blackboard Authentication Failed',
                        details: 'Invalid or expired Blackboard token' 
                    });
                }
                
                if (blackboardError.response.status === 403) {
                    return res.status(403).json({ 
                        error: 'Blackboard Access Denied',
                        details: 'Insufficient permissions for this course' 
                    });
                }
                
                if (blackboardError.response.status === 404) {
                    return res.status(404).json({ 
                        error: 'Blackboard Resource Not Found',
                        details: 'Course or content not found' 
                    });
                }
            }
            
            throw blackboardError;
        }

        // ============================================
        // CÓDIGO DE PRUEBA (mantener comentado)
        // ============================================
        // For testing purposes: Read from a sample file
        // const filePath = limit === "1"
        //     ? path.join(__dirname, '../TestFiles/sampleDoc.txt')
        //     : path.join(__dirname, '../TestFiles/sampleDocs.txt');
        // fs.readFile(filePath, 'utf8', (err, data) => {
        //     if (err) {
        //         return res.status(500).json({ error: 'Failed to read the file.' });
        //     }
        //     try {
        //         const jsonData = JSON.parse(data);
        //         return res.json(jsonData);
        //     } catch (parseError) {
        //         return res.status(500).json({ error: 'Failed to parse the file content.' });
        //     }
        // });

    } catch (error) {
        console.error('❌ General error in get_content_controller:', error.message)
        return res.status(500).json({ 
            error: "Failed to fetch data from Blackboard",
            details: error.message 
        })

    }

}

module.exports = { get_content_controller }