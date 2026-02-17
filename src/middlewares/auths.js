const jwt = require('jsonwebtoken');
const User = require('../models/User')


const auth =  (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        ok: false,
        message: 'No autenticado'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    

    
    /*
    decoded: id usuario, rol usuario
    */

    req.user = {
      sub: decoded.sub,
      role: decoded.role
    };


    next();

  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        ok: false,
        message: 'Token expirado. Inicia sesion nuevamente'
      });
    }

    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({
        ok: false,
        message: 'Token invalido'
      });
    }

    return res.status(500).json({
      ok: false,
      message: 'Error al verificar autenticacion'
    });
  }
};

const verifyAdmin = (req, res, next) => {
  if (req.user.role !== process.env.ADMIN_ROLE && req.user.role !== process.env.SUPER_ADMIN_ROLE) {
    return res.status(403).json({
      ok: false,
      message: 'Acceso denegado ⛔. Se requiere permiso de administrador.'
    })
  }
  next();
}

const verifySuperAdmin = (req, res, next) => {
  if (req.user.role !== process.env.SUPER_ADMIN_ROLE) {
    return res.status(403).json({
      ok: false,
      message: 'Acceso denegado ⛔, Se requiere permisos de super administrador.'
    })
  }

  next()
}








module.exports = {
  auth,
  verifyAdmin,
  verifySuperAdmin
};
