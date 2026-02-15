const express = require("express");
const { validateRegister, validateVerifyEmail, validateLogin } = require("../middlewares/validator");
const { uploadProfile } = require("../config/multer");
const { register, verifyEmail } = require("../controllers/auth.controller");


const router = express.Router();



//ENDPOINTS PUBLICOS 
router.post("/register", uploadProfile, validateRegister, register);
router.post("/verify-email", validateVerifyEmail, verifyEmail);
router.post("/login", validateLogin);



//ENDPOINTS PRIVADOS
/* router.post("/logout", ); */
/* router.get("/profile", ); */
router.put("/profile/photo", uploadProfile );



module.exports = router;