const pool = require('../config/db');

// Agregar Video a Favoritos
const addFavorite = async (req, res) => {
    try {
        const { youtube_video_id, title, thumbnail_url } = req.body;
        const user_id = req.user.id;

        const newFavorite = await pool.query(
            `INSERT INTO favorite_videos (user_id, youtube_video_id, title, thumbnail_url) 
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [user_id, youtube_video_id, title, thumbnail_url]
        );

        res.status(201).json({
            message: 'Video guardado en favoritos',
            video: newFavorite.rows[0]
        });
    } catch (error) {
        if (error.code === '23505') {
            return res.status(400).json({ error: 'El video ya está en tus favoritos' });
        }
        console.error(error);
        res.status(500).json({ error: 'Error al guardar el video' });
    }
};

// Listar Favoritos del Usuario
const getFavorites = async (req, res) => {
    try {
        const user_id = req.user.id;

        const favorites = await pool.query(
            'SELECT * FROM user_favorites_view WHERE user_id = $1 ORDER BY saved_at DESC',
            [user_id]
        );

        res.status(200).json(favorites.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al obtener los favoritos' });
    }
};

// Eliminar Video de Favoritos
const removeFavorite = async (req, res) => {
    try {
        const { videoId } = req.params;
        const user_id = req.user.id;

        const result = await pool.query(
            'DELETE FROM favorite_videos WHERE user_id = $1 AND youtube_video_id = $2 RETURNING *',
            [user_id, videoId]
        );

        if (result.rowCount === 0) {
            return res.status(404).json({ error: 'Video no encontrado en favoritos' });
        }

        res.status(200).json({ message: 'Video eliminado de favoritos' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al eliminar el video' });
    }
};

module.exports = {
    addFavorite,
    getFavorites,
    removeFavorite
};