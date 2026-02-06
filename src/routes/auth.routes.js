const express = require("express");


const router = express.Router();



//ENDPOINTS PUBLICOS 
router.post("/register", );
router.post("/verify-email", );
router.post("/login", );



//ENDPOINTS PRIVADOS
router.post("/logout", );
router.get("/profile", );
router.put("/profile/photo");



module.exports = router;