const bcrypt = require('bcrypt');
const crypto = require('crypto');
const pool = require('../config/db');

// Solicitar Recuperación
const requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;
        const userResult = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (userResult.rows.length === 0) {
            return res.status(404).json({ error: 'Correo no encontrado' });
        }

        const resetToken = crypto.randomBytes(20).toString('hex');
        const expireDate = new Date();
        expireDate.setHours(expireDate.getHours() + 1);

        await pool.query(
            'UPDATE users SET reset_token = $1, reset_token_expires = $2 WHERE email = $3',
            [resetToken, expireDate, email]
        );

        res.status(200).json({
            message: 'Token de recuperación generado',
            resetToken
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al solicitar recuperación' });
    }
};

// Restablecer Contraseña
const resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword } = req.body;

        const userResult = await pool.query(
            'SELECT * FROM users WHERE reset_token = $1 AND reset_token_expires > NOW()',
            [resetToken]
        );

        if (userResult.rows.length === 0) {
            return res.status(400).json({ error: 'Token inválido o expirado' });
        }

        const saltRounds = 10;
        const password_hash = await bcrypt.hash(newPassword, saltRounds);
        const userEmail = userResult.rows[0].email;

        await pool.query(
            'UPDATE users SET password_hash = $1, reset_token = NULL, reset_token_expires = NULL WHERE email = $2',
            [password_hash, userEmail]
        );

        res.status(200).json({ message: 'Contraseña actualizada exitosamente' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Error al restablecer la contraseña' });
    }
};

module.exports = {
    requestPasswordReset,
    resetPassword
};