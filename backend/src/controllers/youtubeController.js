const axios = require('axios');

// Buscar videos en YouTube
const searchVideos = async (req, res) => {
    try {
        const { query } = req.query;

        if (!query) {
            return res.status(400).json({ error: 'Debes proporcionar un término de búsqueda' });
        }

        const response = await axios.get('https://www.googleapis.com/youtube/v3/search', {
            params: {
                part: 'snippet',
                q: query,
                type: 'video',
                maxResults: 12,
                key: process.env.YOUTUBE_API_KEY
            }
        });

        const videos = response.data.items.map(item => ({
            youtube_video_id: item.id.videoId,
            title: item.snippet.title,
            thumbnail_url: item.snippet.thumbnails.high.url,
            channel_title: item.snippet.channelTitle
        }));

        res.status(200).json(videos);
    } catch (error) {
        console.error('Error al consultar la API de YouTube:', error?.response?.data || error.message);
        res.status(500).json({ error: 'Error al buscar los videos' });
    }
};

module.exports = {
    searchVideos
};