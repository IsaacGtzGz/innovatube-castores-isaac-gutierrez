const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const axios = require('axios');

// Registro de Usuarios
const register = async (req, res) => {
    try {
        const { first_name, last_name, username, email, password, password_confirmation, recaptcha } = req.body;

        if (!recaptcha) {
            return res.status(400).json({ error: 'Falta el token de seguridad ReCaptcha' });
        }

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

// Inicio de Sesión
const login = async (req, res) => {
    try {
        const { identifier, password } = req.body;

        const userResult = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR username = $1',
            [identifier]
        );

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const user = userResult.rows[0];
        const isMatch = await bcrypt.compare(password, user.password_hash);

        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas' });
        }

        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '24h' }
        );

        res.status(200).json({
            message: 'Inicio de sesión exitoso',
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error en el servidor durante el login' });
    }
};

module.exports = {
    register,
    login
};