const express = require("express");


const router = express.Router();


//ENDPOINTS PUBLICAS
router.get("/", ); //para pedir todas las canciones
router.get("/search", ); //buscar canciones
router.get(":id", ); //pedir cancion mediante su id



//ENDPOINTS PRIVADOS
router.post("/", );  //RUTA PARA CREAR CANCIONES
router.put("/:id", ); //RUTA PARA EDITAR CANCION
router.delete("/:id", ); //RUTA PARA ELIMINAR CANCION 


module.exports = router;