const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const path = require('path');
const cookieParser = require("cookie-parser");
const cors = require("cors");

//IMPORTAMOS 
const connectDB = require("./config/database");

const app = express();

connectDB();

app.use(cors());
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}))



const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}}`)
}) 