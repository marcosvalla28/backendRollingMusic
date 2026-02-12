const User = require('../models/User');
const jwt = require('jsonwebtoken');

/*
   Genera un JWT de corta duracion, Sub(identificador del usuario es estandar en JWT: ID del usuario)

   role: rol del usuario (admin, user, etc)
   se incluye para que podamos proteger rutas
   segun el rol sin tener que consultar la DB en cada request.
*/
const generateToken = (userId, role) => {
    return jwt.sign(
        {
            sub: userId,
            role
        },
        process.env.JWT_SECRET,
        { expiresIn: '15m' }
    );
};

/*
  LOGIN
     requiere email verificado
*/
const login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                ok: false,
                message: 'Email y password son requeridos'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(401).json({
                ok: false,
                message: 'Credenciales invalidas'
            });
        }

        const isPasswordValid = await user.comparePasswords(password);
        if (!isPasswordValid) {
            return res.status(401).json({
                ok: false,
                message: 'Credenciales invalidas'
            });
        }

        if (!user.verifiedEmail) {
            return res.status(403).json({
                ok: false,
                message: 'Debes verificar tu email antes de iniciar sesion'
            });
        }

        // Genera token, Devuelve info basica del usuario + token.

        const token = generateToken(user._id, user.role);

        return res.status(200).json({
            ok: true,
            message: 'Login exitoso',
            data: {
                user: {
                    id: user._id,
                    username: user.username,
                    email: user.email,
                    role: user.role
                },
                token
            }
        });

    } catch (error) {
        next(error);
    }
};

/*
  VERIFICAR EMAIL: habilita la cuenta y verifica
  
*/
const verifyEmail = async (req, res, next) => {
    try {
        const { email, code } = req.body;

        if (!email || !code) {
            return res.status(400).json({
                ok: false,
                message: 'Email y codigo son requeridos'
            });
        }

        const user = await User.findOne({ email: email.toLowerCase() });

        if (!user) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario no encontrado'
            });
        }

        if (user.verifiedEmail) {
            return res.status(400).json({
                ok: false,
                message: 'El email ya esta verificado'
            });
        }

        if (!user.verificationCode || user.verificationCode !== code) {
            return res.status(400).json({
                ok: false,
                message: 'Codigo de verificacion invalido'
            });
        }

        /*evita que usen un codigo Incorrecto o expirado*/

        if (new Date() > user.codeExpiration) {
            return res.status(400).json({
                ok: false,
                message: 'El codigo de verificacion ha expirado'
            });
        }

        // Activar cuenta y limpiar datos sensibles
        user.verifiedEmail = true;
        user.verificationCode = undefined;
        user.codeExpiration = undefined;
        await user.save();

        //El usuario puede hacer login ahora.

        return res.status(200).json({
            ok: true,
            message: 'Email verificado correctamente. Ya puedes iniciar sesion'
        });

    } catch (error) {
        next(error);
    }
};

/*
  PERFIL DEL USUARIO AUTENTICADO
*/
const getProfile = async (req, res, next) => {
    try {
        const user = await User.findById(req.user.sub)
            .select('-password -verificationCode -codeExpiration');

        if (!user) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario no encontrado'
            });
        }

        return res.status(200).json({
            ok: true,
            data: { user }
        });

    } catch (error) {
        next(error);
    }
};

/*
  LOGOUT
*/
const logout = async (req, res, next) => {
    try {
        return res.status(200).json({
            ok: true,
            message: 'Logout realizado correctamente'
        });
    } catch (error) {
        next(error);
    }
};

module.exports = {
    login,
    verifyEmail,
    getProfile,
    logout
};
