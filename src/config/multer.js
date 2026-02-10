const multer = require('multer');
const path = require('path');
const fs = require('fs');

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

//Configuracion de almacenamiento de las imagenes para los albums de canciones
const coverStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads/covers');
        if(!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath, { recursive: true})
        }
        cb(null, uploadPath)
    },

    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-cover-' + crypto.randomUUID() + path.extname(file.originalname);
        cb(null, uniqueSuffix)
    }
})

//Configuración para las canciones de los albums
const songStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = path.join(__dirname, '../../uploads/songs');
        if(!fs.existsSync(uploadPath)){
            fs.mkdirSync(uploadPath, { recursive: true})
        }
        cb(null, uploadPath)
    },

    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-song-' + crypto.randomUUID() + path.extname(file.originalname);
        cb(null, uniqueSuffix)
    }
})

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

//Filtro para las canciones
const songFilter = (req, file, cb) => {
    const allowedTypes = [
        'audio/mpeg',
        'audio/wav',
        'audio/ogg'
    ];
    if(allowedTypes.includes(file.mimetype)){
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos de audio (mp3, wav, ogg)'), false);
    }
};

//Configuración para las canciones de los albums
const uploadSong = multer({
    storage: songStorage,
    limits: {fileSize: 10 * 1024 * 1024}, //10 MB
    fileFilter: songFilter
});

const uploadCover = multer({
    storage: coverStorage,
    limits: {fileSize: 2 * 1024 * 1024}, //2MB
    fileFilter: fileFilter
}).single('cover')


app.post('/upload-songs', uploadSong.single('song'), (req, res) => {
    if(!req.file){
        return res.status(400).json({
            ok:false,
            message: 'No se subió ningún archivo'
        });
    }

    res.json({
        ok: true,
        message: 'Audio subido correctamente',
        file: req.file
    });
});