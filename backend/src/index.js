require('dotenv').config();
const express = require('express');
const cors = require('cors');
const pool = require('./config/db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Endpoint de prueba (Health Check)
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

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});