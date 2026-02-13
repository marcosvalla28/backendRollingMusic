const User = require("../models/User");
const jwt = require("jsonwebtoken");

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
      role,
    },
    process.env.JWT_SECRET,
    { expiresIn: "15m" },
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
        message: "Email y password son requeridos",
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales invalidas",
      });
    }

    const isPasswordValid = await user.comparePasswords(password);
    if (!isPasswordValid) {
      return res.status(401).json({
        ok: false,
        message: "Credenciales invalidas",
      });
    }

    if (!user.verifiedEmail) {
      return res.status(403).json({
        ok: false,
        message: "Debes verificar tu email antes de iniciar sesion",
      });
    }

    // Generar token
    const token = generateToken(user._id, user.role);

    // Guardar token en cookie  
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      maxAge: 15 * 60 * 1000, // 15 minutos
      secure: process.env.NODE_ENV === "production",   // secure: false  //   secure : true
    });

    return res.status(200).json({
      ok: true,
      message: "Login exitoso",
      data: {
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          role: user.role,
        },
      },
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
        const {email, code} = req.body;

        //SI EL EMAIL YA ESTA VERIFICADO
        const user = await User.findOne({email});

        if (user.verifiedEmail) {
            return res.status(400).json({
                success: false,
                message:'El email ya esta verificado'
            })
        }

        //VERIFICAMOS EL CODIGO Y SU EXPIRACION 
        if (user.verificationCode !== code) {
            return res.status(400).json({
                success: false,
                message:'Codigo de verificacion incorrecto'
            })
        }

        if (new Date() > user.codeExpiration) {
            return res.status(400).json({
                success: false,
                message:'El codigo de verificacion expiro'
            })
        }

        //MARCAR EL EMAIL DEL USUARIO COMO VERIFICADO
        user.verifiedEmail = true;
        user.verificationCode = null;
        user.codeExpiration = null;
        await user.save(); //ME SIENTO EN LA HOGUERA PARA SALVAR EL PUNTO

        return res.status(200).json({
            success: true,
            message: 'Email verificado exitosamente. Ahora podes iniciar sesion'
        })

    } catch (error) {
        next(error)
    }
}
/*
  PERFIL DEL USUARIO AUTENTICADO
*/
const getProfile = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.sub).select(
      "-password -verificationCode -codeExpiration",
    );

    if (!user) {
      return res.status(404).json({
        ok: false,
        message: "Usuario no encontrado",
      });
    }

    return res.status(200).json({
      ok: true,
      data: { user },
    });
  } catch (error) {
    next(error);
  }
};

const updateProfilePhoto = async (req,res, next) => {
    try {

        // validamos que el usuario suba una foto
        if(!req.file){
            return res.status(400).json({
                ok:false,
                message:"no se proporcionó ninguna imagen"
            })
        }

        const user = await User.findById(req.user._id)
        .select('-password -verificationCode -codeExpiration')
        ;

        // Eliminar la foto anterior si es que existe
        if(user.profilePic){
            const path = require('path');
            const previousPhoto = path.join(__dirname, '../../uploads/profiles',user.profilePic)
            deleteOneFile(previousPhoto)
        }

        // Actualizar con la nueva foto que envie el usuario
        user.profilePic = req.file.filename;
        await user.save()

        //enviamos la respuesta
        return res.status(201).json({
            ok:true,
            message:"foto de perfil actualizada 😊",
            data: user.profilePic
        })
        
    } catch (error) {
        next(error)
    }
}





/*
  LOGOUT
  Elimina la cookie httpOnly
*/
const logout = async (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    });

      return res.status(200).json({
      ok: true,
      message: "Sesion cerrada correctamente"
    });

  } catch (error) {
    next(error);
  }
};

module.exports = {
  login,
  verifyEmail,
  getProfile,
  logout,
  updateProfilePhoto
};
