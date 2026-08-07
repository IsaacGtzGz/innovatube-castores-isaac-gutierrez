require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');
const authRoutes = require('./routes/authRoutes');
const favoritesRoutes = require('./routes/favoritesRoutes');
const youtubeRoutes = require('./routes/youtubeRoutes');
const passwordRoutes = require('./routes/passwordRoutes');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares Globales
app.use(cors());
app.use(express.json());

// Endpoints
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/youtube', youtubeRoutes);
app.use('/api/password', passwordRoutes);

// Health Check
app.get('/api/health', async (req, res) => {
    try {
        const result = await pool.query('SELECT NOW()');
        res.status(200).json({
            status: 'Servidor y Base de Datos OK',
            timestamp: result.rows[0].now
        });
    } catch (error) {
        console.error('Error conectando a la base de datos:', error);
        res.status(500).json({ status: 'Error de conexión' });
    }
});

// Ruta de bienvenida
app.get('/', (req, res) => {
    res.status(200).json({
        status: 'success',
        message: 'InnovaTube API corriendo correctamente',
        developer: 'Isaac Gutiérrez',
        version: '1.0.0'
    });
});

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});