const express = require("express");
const { validateUserId, validateMongoID, validateUpdateRole } = require("../middlewares/validator");



const router = express.Router();

//TODAS LAS RUTAS REQUIEREN AUTENTICACION Y PERMISOS DE ADMIN 
router.use();

//ENDPOINTS PRICADAS PARA ADMINISTRACION DE USUARIOS
router.get("/", ); //PEDIR TODOS LOS USUARIOS
router.get("/:id", validateUserId,); //PEDIR USUARIOS POR ID
router.patch("/:id/role", validateMongoID, validateUpdateRole); //EDITAR ROL DE USUARIO
router.delete("/:id", ); //ELIMINAR USUARIO

module.exports = router;


