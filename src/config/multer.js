const multer = require('multer');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

//Configuración de almacenamiento para foto de perfil
const profileStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads/profiles');
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true})
        }
        cb(null, uploadPath)
    },

    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-profile-' + crypto.randomUUID() + path.extname(file.originalname);
        cb(null, uniqueSuffix)
    }
});

//Configuración para foto de perfil (1 archivo, max 2MB)
const uploadProfile = multer({
    storage: profileStorage,
    limits: {fileSize: 2 * 1024 * 1024}, //2MB
    fileFilter: fileFilter
    
}).single('profilePic');

//Filtro de archivos
const fileFilter = (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLocaleLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype){
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten imagenes (jpg, jpeg, png, webp)'))
    }
}

const universalStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'songs'; //Carpeta creada por defecto
        if (file.fieldname === 'cover') folder = 'covers';

        const uploadPath = path.join(__dirname, `../../uploads/${folder}`);
        if (!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath, {recursive: true});
        }
        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const prefix = file.fieldname === 'cover' ? 'cover' : 'audio';
        const uniqueSuffix = Date.now() + `-${prefix}-` + crypto.randomUUID() + path.extname(file.originalname);
        cb(null, uniqueSuffix);
    }
});

//Filtro que acepte a ambos
const multerFilter = (req, file, cb) => {
    if(file.fieldname === 'cover') {
        const allowedTypes = /jpg|jpeg|png|webp/;
        const isPhoto = allowedTypes.test(path.extname(file.originalname).toLocaleLowerCase()) && allowedTypes.test(file.mimetype);
        if (isPhoto) return cb(null, true);
        return cb(new Error('La portada debe ser una imagen jpg, jpeg, png o webp'), false);
    }

    if (file.fieldname === 'audio'){
        const allowedTypes = [
            'audio/mpeg',
            'audio/wav',
            'audio/ogg'
        ];

        if (allowedTypes.includes(file.mimetype)) return cb(null, true);
        return cb(new Error('El archivo de audio debe ser mp3, wav u ogg'), false);
    }

    cb(new Error('Campo no permitido'), false);
};

//Exportar el nuevo middleware
const uploadSongAndCover = multer({
    storage: universalStorage,
    limits: {fileSize: 15 * 1024 * 1024}, //Se va 15MB para que entren los dos
    fileFilter: multerFilter
});

const uploadSongFields = uploadSongAndCover.fields([
    {name: 'cover', maxCount: 1},
    {name: 'audio', maxCount: 1}
]);


module.exports = {
    uploadProfile,
    uploadSongFields
}