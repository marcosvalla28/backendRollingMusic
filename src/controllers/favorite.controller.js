const User = require('../models/User');

const toggleFavorite = async (req, res, next) => {
    try {
        
        const { id } = req.params; 
        const userId = req.user._id;

        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                ok: false,
                message: 'Usuario no encontrado'
            });
        }

        const isFavorite = user.favorites.includes(id);
        
        const updateAction = isFavorite 
            ? { $pull: { favorites: id } } 
            : { $addToSet: { favorites: id } };
        
        const message = isFavorite ? 'Quitada de favoritos' : 'Agregada a favoritos';

        await User.findByIdAndUpdate(userId, updateAction);

        return res.status(200).json({
            ok: true,
            message: `${message} 🎵`,
            isFavorite: !isFavorite 
        });

    } catch (error) {
        next(error);
    }
};

const getFavorites = async (req, res, next) => {
    try {
        const userId = req.user._id;
        const user = await User.findById(userId);

        return res.status(200).json({
            ok: true,
            data: user.favorites
        });
        
    } catch (error) {
        next(error);
    }
}

module.exports = {
    toggleFavorite,
    getFavorites
};