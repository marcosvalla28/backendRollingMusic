const express = require("express");
const { validateSong, validateUpdateSong, validateMongoID } = require("../middlewares/validator");


const router = express.Router();


//ENDPOINTS PUBLICAS
/* router.get("/", ); */ //para pedir todas las canciones
/* router.get("/search", ); */ //buscar canciones
/* router.get(":id", ); */ //pedir cancion mediante su id



//ENDPOINTS PRIVADOS
router.post("/", 
    validateSong
);  //RUTA PARA CREAR CANCIONES
router.put("/:id",
    validateMongoID,
    validateUpdateSong
); //RUTA PARA EDITAR CANCION
router.delete("/:id", 
    validateMongoID
); //RUTA PARA ELIMINAR CANCION 


module.exports = router;