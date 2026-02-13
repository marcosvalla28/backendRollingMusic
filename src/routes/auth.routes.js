const express = require("express");
const { validateRegister, validateVerifyEmail, validateLogin } = require("../middlewares/validator");
const { uploadProfile } = require("../config/multer");


const router = express.Router();



//ENDPOINTS PUBLICOS 
router.post("/register", uploadProfile, validateRegister);
router.post("/verify-email", validateVerifyEmail);
router.post("/login", validateLogin);



//ENDPOINTS PRIVADOS
/* router.post("/logout", ); */
/* router.get("/profile", ); */
router.put("/profile/photo", uploadProfile );



module.exports = router;