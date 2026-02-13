const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const path = require('path');
const cookieParser = require("cookie-parser");
const cors = require("cors");

//IMPORTAMOS 
const authRoutes = require("./routes/auth.routes");
const songRoutes = require("./routes/song.routes");
const userRoutes = require("./routes/user.routes");
const connectDB = require("./config/database");
const createSuperAdmin = require("./utils/createSuperAdmin");
const errorHanlder = require("./middlewares/errorHandler");

const app = express();

connectDB();

createSuperAdmin();


app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));


//ENRUTADORES
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/song", songRoutes);
app.use("/api/v1/users", userRoutes);



//ACA HAY QUE LLAMAR AL MIDDELWARE MANEJADOR DE ERRORES
app.use(errorHanlder);


const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}}`)
}) 