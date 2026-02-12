// controllers/auth.controller.js
import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';
// Génère un token JWT

export const register = async (req, res) => {
    try {
        const { email, password, firstname, lastname } = req.body;
        if (!email || !password || !firstname || !lastname) {
            return res.status(400).json({ error: 'Tous les champs sont requis' });
        }
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ error: 'Email déjà utilisé' });
        }
        const user = await User.create({ email, password, firstname, lastname });
        const token = generateToken(user);
        res.status(201).json({ message: 'Inscription réussie', user, token });
    } catch (error) {
        res.status(500).json({ error: 'Erreur serveur' });
    }
};