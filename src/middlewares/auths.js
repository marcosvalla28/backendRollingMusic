const jwt = require('jsonwebtoken');

const auth = (req, res, next) => {
  try {
    // Obtener header Authorization
    const authHeader = req.header('Authorization');

    if (!authHeader) {
      return res.status(401).json({
        ok: false,
        message: 'Acceso denegado. No se proporciono token'
      });
    }

    // Validar formato bearer token
    if (!authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        ok: false,
        message: 'Formato de token invalido'
      });
    }

    // Extraer token
    const token = authHeader.split(' ')[1];

    // Verificar token
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
