//Middleware para manejar los errors

const { cleanUploadsFiles } = require("../utils/fileCleanup");

const errorHanlder = (err, req, res, next) => {

    console.error('Error: ', err)

}

//Limpiar archivos subidos si hay error
cleanUploadsFiles(req);

//Error de validaciones de Mongoose
if(err.name === 'validationError'){
    const errors = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({
        ok: false,
        message: 'Error de validación',
        errors
    });
}

//Error personalizado de multer (tipo de archivos)
    if(err.message && err.message.includes('Solo se permiten imagenes')){
        return res.status(400).json({
            ok: false,
            message: err.message
        })
    }

    //Error de Multer (tamaño excedido en los archivos)
    if(err.name === 'MulterError'){
        if(err.code === 'LIMIT_FILE_SIZE'){
        return res.status(400).json({
            ok: false,
            message: 'El archivo excede el tamaño máximo de 2MB'
        })
    }

    //Error de multer (tamaño excedido en las canciones)
    if(err.message && err.message.includes('Solo se permite archivos de audio')){
        return res.status(400).json({
            ok: false,
            message: err.message
        })
    }

    //Error de multer (tamaño excedido en las canciones)
    if(err.name === 'MulterError'){
        if(err.code === 'LIMIT_FILE_SIZE'){
            return res.status(400).json({
                ok: false,
                message: 'El archivo excedió el temaño máximo de 10 MB'
            })
        }
    }

    //¿Que pasa  si hay un error en el cual se subieron más archivos de los permitidos?
    if(err.code === 'LIMIT_UNEXPECTED_FILE'){
        return res.status(400).json({
            ok: false,
            message: 'Solo se permite 1 archivo a la vez'
        })
    }

    //Error genérico
    res.status(500).json({
        ok: false,
        message: err.message || 'Error interno del servidor'
    })

}

module.exports = errorHanlder;


