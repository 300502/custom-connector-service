// Función auxiliar para obtener valores anidados (ej: "links[0].href")
const obtenerValorAnidado = (objeto, ruta) => {
    if (!ruta || !objeto) return "";
    
    // Si la ruta existe directamente en el objeto
    if (ruta in objeto) return objeto[ruta];
    
    // Manejar rutas complejas como "links[0].href"
    try {
        const partes = ruta.split(/[\.\[\]]+/).filter(p => p);
        let valorActual = objeto;
        
        for (const parte of partes) {
            if (valorActual && typeof valorActual === 'object') {
                valorActual = valorActual[parte];
            } else {
                return "";
            }
        }
        return valorActual || "";
    } catch (error) {
        return "";
    }
};

async function formatData(datosCrudos, camposConfig) {
    try {
        // Obtener el campo raíz de los datos
        const campoRaiz = camposConfig?.rootField || "";
        let datosProcesar;
        
        if (campoRaiz && campoRaiz.trim() !== "") {
            datosProcesar = obtenerValorAnidado(datosCrudos, campoRaiz) || [];
        } else {
            datosProcesar = Array.isArray(datosCrudos) ? datosCrudos : [];
        }
        
        // Asegurar que sea array
        if (!Array.isArray(datosProcesar)) {
            datosProcesar = [datosProcesar];
        }
        
        // Formatear cada item según la configuración
        const datosFormateados = datosProcesar.map(item => ({
            id: obtenerValorAnidado(item, camposConfig?.id) || "",
            title: obtenerValorAnidado(item, camposConfig?.title) || "",
            content: obtenerValorAnidado(item, camposConfig?.content) || "",
            url: obtenerValorAnidado(item, camposConfig?.url) || "",
            type: obtenerValorAnidado(item, camposConfig?.type) || "",
            doc_created_on: obtenerValorAnidado(item, camposConfig?.doc_created_on) || "",
            doc_updated_on: obtenerValorAnidado(item, camposConfig?.doc_updated_on) || "",
            rawData: item || {},
            sys_racl: obtenerValorAnidado(item, camposConfig?.sys_racl) || "",
            sys_file_type: obtenerValorAnidado(item, camposConfig?.sys_file_type) || "json",
            html: obtenerValorAnidado(item, camposConfig?.html) || ""
        }));
        
        console.log(`📊 Datos formateados: ${datosFormateados.length} elementos`);
        
        return { data: datosFormateados };
        
    } catch (error) {
        console.error("❌ Error al formatear datos:", error.message);
        throw new Error("Error en el formateo de datos");
    }
}

module.exports = { formatData };