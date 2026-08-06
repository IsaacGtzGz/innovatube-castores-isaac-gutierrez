const bcrypt = require('bcrypt');
const pool = require('../config/db');

const register = async (req, res) => {
    try {
        const { first_name, last_name, username, email, password, password_confirmation } = req.body;

        if (password !== password_confirmation) {
            return res.status(400).json({ error: 'Las contraseñas no coinciden' });
        }

        const userExists = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR username = $2',
            [email, username]
        );

        if (userExists.rows.length > 0) {
            return res.status(400).json({ error: 'El usuario o correo ya está registrado' });
        }

        const saltRounds = 10;
        const password_hash = await bcrypt.hash(password, saltRounds);

        const newUser = await pool.query(
            `INSERT INTO users (first_name, last_name, username, email, password_hash) 
             VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email`,
            [first_name, last_name, username, email, password_hash]
        );

        res.status(201).json({
            message: 'Usuario registrado exitosamente',
            user: newUser.rows[0]
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor durante el registro' });
    }
};

module.exports = {
    register
};