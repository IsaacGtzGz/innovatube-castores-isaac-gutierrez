const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');
const axios = require('axios');

// Base de Datos: Registro
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

// Base de Datos: Inicio de Sesión
const login = async (req, res) => {
    try {
        const { identifier, email, username, password } = req.body;
        const loginIdentifier = identifier || email || username;

        const userResult = await pool.query(
            'SELECT * FROM users WHERE email = $1 OR username = $1',
            [loginIdentifier]
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

// Base de Datos: Olvidé Contraseña
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'No existe una cuenta con este correo' });
        }

        const resetToken = crypto.randomBytes(16).toString('hex');
        const tokenExpires = new Date(Date.now() + 3600000);

        await pool.query(
            'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
            [resetToken, tokenExpires, email]
        );

        res.status(200).json({
            message: 'Token generado exitosamente',
            token: resetToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al procesar la solicitud' });
    }
};

// Base de Datos: Restablecer Contraseña
const resetPassword = async (req, res) => {
    try {
        const { token, newPassword, password } = req.body;
        const passwordToHash = newPassword || password;

        const userResult = await pool.query(
            'SELECT * FROM users WHERE TRIM(reset_token) = $1',
            [token]
        );

        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'El token es inválido o ha expirado' });
        }

        const user = userResult.rows[0];
        const saltRounds = 10;
        const passwordHash = await bcrypt.hash(passwordToHash, saltRounds);

        await pool.query(
            'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE id = $2',
            [passwordHash, user.id]
        );

        res.status(200).json({ message: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al actualizar la contraseña' });
    }
};

module.exports = {
    register,
    login,
    forgotPassword,
    resetPassword
};