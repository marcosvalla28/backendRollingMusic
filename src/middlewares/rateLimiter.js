const rateLimit = require('express-rate-limit');


//LIMITADOR GLOBAL
const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutos
    max:100, //LIMITA CADA IP A X NUMEROS DE SOLICITUDES POR VENTANA (WINDOWSMS)
    message:{
        success: false,
        message:'Demasiadas peticiones desde esta IP ⛔. Por favor intenta de nuevo en 15 minutos ⌛'
    },
    standardHeaders: true, //RETORNA info DEL LIMITES EN LOS HEADERS
    legacyHeaders: false, //DESACTIVAR LOS HEADERS 
})





//LIMITADOR PARA EL AUTH
const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, //15 minutos
    max:15, //LIMITA CADA IP A X NUMEROS DE SOLICITUDES POR VENTANA, puse 15 para desarrollo
    message:{
        success: false,
        message:'Demasiados intentos de acceso. Intente mas tarde'
    },
    standardHeaders: true, //RETORNA info DEL LIMITES EN LOS HEADERS
    legacyHeaders: false, //DESACTIVAR LOS HEADERS 
})





module.exports = {
    globalLimiter,
    authLimiter
}