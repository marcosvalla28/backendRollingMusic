const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    // Obtener token
    const authHeader = req.header("Authorization");

    if (!authHeader) {
      return res.status(401).json({
        success: false,
        message: "Acceso denegado. no se proporciono token.",
      });
    }

    // Extraer el token
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({
        success: false,
        message: "Formato de token inválido.",
      });
    }

    // Verifico el token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Agregar info del usuario a la request
    req.user = {
      userId: decoded.userId,
      email: decoded.email,
      role: decoded.role,
    };

    next();

    // Si todo esta bien, continuar

    // manejar errores
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        success: false,
        message: "Por favor, inicia sesion nuevamente.",
      });
    }

    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({
        success: false,
        message: "Token invalido.",
      });
    }

    res.status(500).json({
      success: false,
      message: "Error al verificar autenticacion.",
      error: error.message,
    });
  }
};

module.exports = auth;
