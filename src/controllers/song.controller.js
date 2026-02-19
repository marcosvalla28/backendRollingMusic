const Songs = require('../models/Song');
const { deleteOneFile, cleanUploadsFiles, deleteFiles, getCompleteRoute } = require('../utils/fileCleanup')

//Obtener todas las canciones
const getAllSongs = async (req, res, next) => {
    try {

        const songs = await Songs.find().sort({createdAt: -1}); //Traemos todas las canciones

        if(!songs || songs.length === 0){
            return res.status(400).json({
                ok: false,
                message: 'No se encontraron canciones'
            })
        }

        return res.status(200).json({
            ok: true,
            message: 'Canciones encontradas',
            data: songs
        })

    } catch (error) {
        next(error)
    }
}

//Buscar una cancion
const searchSong = async (req, res, next) => {
    try {

        //1- Capturar los parametros de busqueda de la query
        const {  title, author, artist, genre } = req.query;

        //2- Inicializamos variable para filtros
        let filters = {}; //Porque mongoose espera un objeto en los filtros

        //3- Añadir filtros al objeto pero de manera condicional
        if(genre){
            filters.genre = { $regex: genre, $options: 'i'}
        }

        if(author){
            filters.author = {$regex: author, $options: 'i'}
        } 

        if(artist){
            filters.artist = {$regex: artist, $options: 'i'}
        }

        if(title){
            filters.title = {$regex: title, $options: 'i'}
        }

        //4- Aplico los filtros directamente en el metodo find de mongoose
        const songs = await Songs.find(filters).sort({createdAt: -1});

        //5- Si no encontró canciones doy una respuesta
        if(!songs || songs.length === 0){
            return res.status(404).json({
                ok: false,
                message: 'No se encontraron coincidencias para la busqueda'
            })
        }

        //6- Respuesta al cliente en los resultados
        return res.json({
            ok: true,
            message: 'Canciones encontradas 🎵',
            length: songs.length,
            data: songs
        })
        
    } catch (error) {
        next(error)
    }
}

//Obtener una cancion por su ID
const getSongById = async (req, res, next) => {
    try {

        //1- Buscar el producto en mongo
        const song = await Songs.findById(req.params.id);

        //2- Validar que el producto exista
        if(!song){
            return res.status(404).json({
                ok: false,
                message: 'Canciones no encontradas'
            })
        }

        //3- Respuesta al cliente
        return res.status(200).json({
            ok: true,
            message: 'Cacion encontrada 🎵',
            data: song
        });
        
    } catch (error) {
        next(error)
    }
}

//Crear cancion (solo admin o super admin)
const createSong = async (req, res, next) => {
    try {
        //Capturar la informacion
        const { title, author, artist, genre, duration } = req.body;

        //Verificar que se hayan subido canciones
        if(!req.files || !req.files.cover || !req.files.audio){
            cleanUploadsFiles(req);
            return res.status(400).json({
                ok: false,
                message: 'Debe subir la portada y el audio de la canción'
            })
        }

        //Creo la cancion nueva
        const song = new Songs({
            title,
            author,
            artist,
            genre,
            duration,
            cover: req.files.cover[0].filename,
            audio: req.files.audio[0].filename
        });

        //Guardar en mongo
        await song.save();

        //Respuesta al cliente con mensaje exitoso
        return res.status(201).json({
            ok: true,
            message: 'Cancion creada con exito 🎵',
            data: song
        })
        
    } catch (error) {
        cleanUploadsFiles(req)
        next(error)
    }
}

//Actualizar cancion (solo admin o super admin)
const updateSong = async (req, res, next) => {
    try {
        //1- Capturamos la info necesaria
        const { id } = req.params; //ID de la cancion
        const { title, author, artist, duration, genre, cover } = req.body; //Info a actualizar

        //2- Buscar la cancion por su ID
        const song = await Songs.findById(id);

        //3- Validar que la cancion exista
        if(!song){
            cleanUploadsFiles(req)
            return res.status(404).json({
                ok: false,
                message: 'No existe la canción'
            })
        }

        //4- Actulizar los campos de la cancion
        if(title) song.title = title;
        if(author) song.author = author;
        if(artist) song.artist = artist;
        if(genre) song.genre = genre;
        if(duration) song.duration = duration;

        //5- Si se subio cover de la cancion, tengo que reemplazar las antiguas

        if(req.files && req.files.cover){

            //Buscamos las rutas de las imagenes viejas y la guardamos en una variable
            const oldCoverPath = getCompleteRoute(song.cover, 'songs');

        //Eliminamos las imagenes viejas usando las rutas que guardamos antes
        deleteFiles([oldCoverPath])

        //Asignamos las imagenes nuevas en mongo
        song.cover = req.files.cover[0].filename;
        }

        // Si subieron una nuevo audio
        if (req.files && req.files.audio){
            const oldAudioPath = getCompleteRoute(song.audio, 'songs');
            deleteFiles([oldAudioPath]);
            song.audio = req.files.audio[0].filename;
        }

        //6- Actulizamos la cancion en mongo con el save()
        await song.save();

        //7- Respuesta al cliente
        return res.status(200).json({
            ok: true,
            message: 'Cancion actulizada con exito 🎵',
            data: song
        })
        
    } catch (error) {
        next(error)
    }
}

//Eliminar una cancion
const deleteSong = async (req, res, next) => {
    try {
        //1- Buscar el ID de la cancion
        const { id } = req.params;

        //2- Buscar la cancion en mongo
        const song = await Songs.findById(id);

        //3- Validar que la cancion exista
        if(!song){
            return res.status(404).json({
                ok: false,
                message: 'Cancion no encontrada'
            })
        }

        //4- Eliminar la imagen y la canción
        const coverPath = getCompleteRoute(song.cover, 'songs');
        const audioPath = getCompleteRoute(song.audio, 'songs');

        //5- Eliminamos las imagenes viejas usando las rutas que guardamos antes
        deleteFiles([coverPath, audioPath]);

        //6- Eliminar la cancion en mongo
        await Songs.findByIdAndDelete(id);

        //7- Respuesta al cliente
        return res.status(200).json({
            ok: true,
            message: 'Cancion eliminada con exito 🎵',
            data: song
        })

    } catch (error) {
        next(error)
    }
}

module.exports = {
    getAllSongs,
    searchSong,
    getSongById,
    createSong,
    updateSong,
    deleteSong
}