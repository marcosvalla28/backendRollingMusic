const express = require("express");
require("dotenv").config();
const morgan = require("morgan");
const path = require("path");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const authRoutes = require("./routes/auth.routes");
const songRoutes = require("./routes/song.routes");
const userRoutes = require("./routes/user.routes");
const playlistRoutes = require("./routes/playlist.routes"); 
const connectDB = require("./config/database");
const createSuperAdmin = require("./utils/createSuperAdmin");
const errorHanlder = require("./middlewares/errorHandler");
const favoritesRoutes = require("./routes/favorite.routes");
const playlistRoutes = require("./routes/playlist.routes");

const app = express();

connectDB();
createSuperAdmin();

app.use(cors({
  origin: "https://rolling-music.vercel.app",
  credentials: true
}));
app.use(morgan("dev"));
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended: true}));

app.use('/uploads', express.static(path.join(__dirname, '../uploads'), {
    setHeaders: (res, filePath) => {
        res.set('Access-Control-Allow-Origin', '*');
        res.set('Content-Disposition', 'inline');
        if (filePath.endsWith('.mp3')) {
            res.set('Content-Type', 'audio/mpeg');
        }
    }
}));

app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/song", songRoutes);
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/favorites", favoritesRoutes);
app.use("/api/v1/playlists", playlistRoutes);

app.use(errorHanlder);

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Servidor corriendo en http://localhost:${port}`)
});
