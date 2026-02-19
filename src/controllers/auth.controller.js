//MINI CRUD DE USUARIO - AUTH
const User = require('../models/User');
const crypto = require('crypto');
const { sendVerificationEmail } = require('../utils/emailService');
const jwt = require('jsonwebtoken');
const { deleteOneFile } = require('../utils/fileCleanup');

//funcion auxiliar para poder generar el token
const generateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {
        expiresIn: '1h'
    });
};

const register = async (req, res, next) => {
    
    try {
        const {name, surname, email, password} = req.body;

        //Crear el usuario con mongoose
        const newUser = await User.create({
            name,
            surname,
            email,
            password,
            profilePic: req.file ? req.file.filename : null
        });

        //Llamar al método de usuario que crea el codigo de verificación
        const code = newUser.generateVerificationCode();
        await newUser.save();

        //Enviar el código via email con la función de nodemailer
        try {
            await sendVerificationEmail(email, name, code)
        } catch (emailError) {
            //si falla el envio del email, eliminar el usuario y foto
            await User.findByIdAndDelete(newUser._id)
            if(req.file){
                (req.file.path)
            }

            return res.status(500).json({
                ok: false,
                message: "error al enviar el email de verificación. Por favor, intenta nuevamente."
            })
            
        }


        return res.status(201).json({
            ok: true,
            message: 'Usuario registrado con exito!!!',
            user:{
                id: newUser._id,
                name: newUser.name,
                email: newUser.email,
                role: newUser.role,
                photo: newUser.profilePic
            }
        })
        
    } catch (error) {
        next(error)
    }

}

const verifyEmail = async (req, res) => {
    try {
        const {email, code} = req.body;

        //si el email ya esta verificado
        const user = await User.findOne({email});
        
        if (user.verifiedEmail){
            return res.status(400).json({
                success: false,
                message: 'El email ya está verificado'
            })
        }

        //verificar el codigo y su expiración
        if(user.verificationCode !== code){
            return res.status(400).json({
                success: false,
                message: 'El código de verificación es incorrecto'
            })
        }

        if(new Date() > user.codeExpiration){
            return res.status(400).json({
                success: false,
                message: 'El código de verificación expiró'
            })
        }

        //marcar el email del usuario como verificado
        user.verifiedEmail = true;
        user.verificationCode = null;
        user.codeExpiration = null;
        await user.save();

        return res.status(200).json({
            success: true,
            message: 'Email verificado exitosamente, ahora puedes iniciar sesión'
        })

    } catch (error) {
        next(error)
    }
}

const login = async (req, res) => {
    console.log("Cuerpo recibido en el login:", req.body);
    try {

        const {email, password, isGoogleLogin = false } = req.body;

        let user = await User.findOne({email});

        if (isGoogleLogin) {
            if (!user) {
                user = new User({
                    name: req.body.name || "Usuario Google",
                    email: email,
                    password: crypto.randomBytes(16).toString('hex'), // Password aleatoria por seguridad
                    verifiedEmail: true, // Google ya lo verificó
                    role: 'user' // Por defecto
                });

                await user.save();
            }
        }

        else {
            if (!user) {
                return res.status(401).json({
                    ok: false,
                    message: 'Credenciales inválidas'
                })
            }

            const validPassword = await user.comparePassword(password);
            if (!validPassword){
                return res.status(401).json({
                    ok: false,
                    message: 'Credenciales inválidas'
                })
            }

            if (!user.verifiedEmail) {
                return res.status(403).json({
                    ok: false,
                    message: 'Debes verificar tu email antes de iniciar sesión'
                })
            }
        }

        const token = generateToken(user._id);

        res.cookie('token', token, {
            httpOnly: true,
            sameSite: 'lax',
            maxAge: 60 * 60 * 1000,
            secure: true
        });

        return res.status(200).json({
            ok: true,
            message: 'Login exitoso',
            token,
            data: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error("DETALLE DEL ERROR:", error);
        return res.status(500).json({
            ok: false,
            message: error.message
        })
    }
}

const logout = async (req, res, next) => {
    try {
        res.clearCookie('token');
        return res.status(200).json({
            ok: true,
            message: 'Logout exitoso ✅'
        })
        
    } catch (error) {
        next(error)
    }

}

const getUserProfile = async (req, res, next) => {
    try {

        const user = await User.findById(req.user._id)
        .select('-password -verificationCode -codeExpiration');

        return res.status(200).json({
            ok: true,
            message: 'Perfil del usuario obtenido correctamente ✅',
            data: user
        })

    } catch (error) {
        next(error)
    }
}

const updateProfilePhoto = async (req, res, next) => {
    try {

        //validamos que el usuario suba una foto
        if(!req.file){
            return res.status(400).json({
                ok: false,
                message: 'No se proporcionó ninguna imagen'
            })
        }

        const user = await User.findById(req.user._id)
        .select('-password -verificationCode -codeExpiration');

        if(!user){
            return res.status(404).json({
                ok: false,
                message: 'Usuario no encontrado'
            })
        }

        //eliminar la foto anterior si es que existe
        if(user.profilePic){
            const path = require('path');
            const previousPhoto = path.join(__dirname, '../uploads/profiles', user.profilePic);
            deleteOneFile(previousPhoto)
        }

        //actualizar con la nueva foto que envie el usuario
        user.profilePic = req.file.filename;
        await user.save();

        //enviamos la respuesta
        return res.status(201).json({
            ok: true,
            message: 'Foto de perfil actulizada ✅',
            data: user.profilePic
        })

    } catch (error) {
        next(error)
    }
}




module.exports = {
    register,
    login,
    verifyEmail,
    logout,
    getUserProfile,
    updateProfilePhoto
}