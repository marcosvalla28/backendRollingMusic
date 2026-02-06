const express = require("express");



const router = express.Router();

//TODAS LAS RUTAS REQUIEREN AUTENTICACION Y PERMISOS DE ADMIN 
router.use();

//ENDPOINTS PRICADAS PARA ADMINISTRACION DE USUARIOS
router.get("/", ); //PEDIR TODOS LOS USUARIOS
router.get("/:id", ); //PEDIR USUARIOS POR ID
router.patch("/:id/role", ); //EDITAR ROL DE USUARIO
router.delete("/:id", ); //ELIMINAR USUARIO

module.exports = router;


