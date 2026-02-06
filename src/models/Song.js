const mongoose = require('mongoose');


const songSchema = new mongoose.Schema({

    title:{
        type: String,
        required: true
    },
    artist:{
        type: String,
        required: true
    },
    genre: {
        type: String,
        required: true,
        enum: ['rock','pop', 'cumbia', 'bachata', 'trap', 'hip-hop', 'baladas', 'otro'],
        unique: true
    },
    frontPage: {
        type: String,
        default: "https://rolling-music.vercel.app/assets/Logo-CK57mjsi.png",
    },
    duration: {
        type: Number,
        require: true,
    },
    audio: {
        type: String,
        require: true
    }


},{
    timestamps: true
});


module.exports = mongoose.model('Song', songSchema);