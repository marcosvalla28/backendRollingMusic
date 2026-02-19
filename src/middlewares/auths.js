const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
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

module.exports = auth;