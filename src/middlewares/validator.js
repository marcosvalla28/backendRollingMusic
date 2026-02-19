const {body, param, validationResult} = require('express-validator');
const User = require('../models/User');
const { deleteOneFile, deleteFiles, cleanUploadsFiles } = require('../utils/fileCleanup');


//middleware para manejar los errores de validacion
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        return res.status(400).json({
            ok: false,
            message: 'Errores de validacion',
            errors: errors.mapped()
        })
    }

    next();
}

const handleValidationErrorsWithFiles = (req, res, next) => {

    const errors = validationResult(req);

    if (!errors.isEmpty()) {
        //SI HAY ERRORES Y SE SUBIO A ARCHIVOS NECESITO ELIMINARLOS
        if (req.file) {
            deleteOneFile(req.file.path)
        }

        if (req.files && Array.isArray(req.files)) {
        cleanUploadsFiles(req);
    }

        return res.status(400).json({
            ok: false,
            message: 'Errores de validacion',
            errors: errors.mapped()
        })
    }

    next()

}


//VALIDACIONES PARA EL REGISTRO DE UN USUARIO
const validateRegister = [
  body("name")
    .notEmpty()
    .withMessage("El nombre es requerido")
    .isString()
    .withMessage("El nombre debe ser un texto")
    .trim()
    .isLength({ min: 2 })
    .withMessage("El nombre debe tener al menos 2 caracteres"),

    body("surname")
    .notEmpty()
    .withMessage("El apellido es requerido")
    .isString()
    .withMessage("El apellido debe ser un texto")
    .trim()
    .isLength({ min: 2 })
    .withMessage("El apellido debe tener al menos 2 caracteres"),


    body("email")
    .notEmpty()
    .withMessage("El email es requerido")
    .isEmail()
    .withMessage("El email no tiene un formato válido")
    .normalizeEmail()
    .custom(async (email, {req}) => {
    const user = await User.findOne({ email });
    if (user) {
        throw new Error("El usuario ya existe");
    }
    }),
    body("password")
    .notEmpty()
    .withMessage("La contraseña es requerida")
    .isLength({ min: 6 })
    .withMessage("la contraseña debe tener por lo menos 6 caracteres"),

    handleValidationErrorsWithFiles
];

//VALIDACION PARA LOGIN
const validateLogin = [
    body('email')
    .notEmpty().withMessage('El email es requerido')
    .isEmail().withMessage('El email ingresado debe ser valido')
    .normalizeEmail()
    .custom(async(email) => {
        const user = await User.findOne({email})
        if (!user) {
            throw new Error('Credencial incorrecta')
        }
    }),

    body('password')
    .notEmpty().withMessage('La contrasena es requerida')
    .isLength({min: 6}).withMessage('La contrasena debe tener al menos 6 caracteres'),


    
    handleValidationErrors
]

//VALIDACION PARA DELETE
const validateUserId = [
        param('id')
        .isMongoId().withMessage('El ID proporcionado no es valido')
        .custom(async (id) => {
            const user = await User.findById(id);
            if (!user) {
                throw new Error('El usuario no existe o no fue encontrado')
            }
        }),


    handleValidationErrors
    ]

//VALIDACION PARA CAMBIO DE ROL
const validateUpdateRole = [
    param('id')
    .isMongoId().withMessage('El ID proporcionado no es valido'),

    body('role')
    .notEmpty().withMessage('Debe proporcionar el rol del usuario')
    .isIn(['user', 'admin', 'superadmin']).withMessage('El rol debe ser: user, admin o superadmin'),

    handleValidationErrors

]

//VALIDAMOS SI EL USUARIO QUE PIDE ALLUSERS SEA SUPER ADMIN
const validateSuperAdmin = [
    param('id')
    .isMongoId().withMessage('El ID proporcionado no es valido')
    .custom(async (id) => {
        const user = await User.findById(id);
        if (user.role !== process.env.SUPER_ADMIN_ROLE) {
            throw new Error('El usuario no tiene permiso para esta accion')
        }
    }),
    
    handleValidationErrors
]

//VALIDACIONES PARA EL CODIGO DE VERIFICACION DEL EMAIL
const validateVerifyEmail = [
    body('email')
    .isEmail().withMessage('Email invalido')
    .normalizeEmail()
    .custom(async(email) => {
        const user = await User.findOne({email})
        if (!user) {
            throw new Error('Usuario no encontrado')
        }
    }),

    body('code')
    .isLength({min:6, max:6}).withMessage('El codigo debe tener 6 digitos')
    .isNumeric().withMessage('El codigo debe ser numerico'),

    handleValidationErrors
]

//VALIDACION DE ID DE MONGO
const validateMongoID = [
    param('id')
    .isMongoId().withMessage('El ID no es valido'),

    handleValidationErrors
]

//VALIDACION PARA CREAR 
const validateSong = [

    body('title')
    .notEmpty().withMessage('El titulo es requerido')
    .isLength({min:1}).withMessage('El titulo debe tener al menos 1 caracter'),

    body('artist')
    .notEmpty().withMessage('El nombre del artista es requerido'),

    body('genre')
    .notEmpty().withMessage('El genero es requerido')
    .isLength({min:1}).withMessage('El genero debe tener al menos 1 caracter'),

    body('duration')
    .notEmpty().withMessage('La duracion es requerida')
    .isInt({min:60, max:300}).withMessage('La duracion debe ser en segundos'),


    handleValidationErrorsWithFiles
] 

//VALIDACION PARA ACTUALIZAR PRODUCTO
const validateUpdateSong = [

    body('title')
    .optional() //ESTE CAMPO NO ES OBLIGATORIO
    .isLength({min:1}).withMessage('El titulo debe tener al menos 1 caracter'),

    body('artist')
    .optional(),

    body('genre')
    .optional()
    .isLength({min:1}).withMessage('El genero debe tener al menos 1 caracter'),

    body('duration')
    .optional()
    .isInt({min:60, max:300}).withMessage('La duracion debe ser en segundos'),


    handleValidationErrorsWithFiles
] 

module.exports = {
    validateRegister,
    validateLogin,
    validateUserId,
    validateUpdateRole,
    validateSuperAdmin,
    validateVerifyEmail,
    validateMongoID,
    validateSong,
    validateUpdateSong
}