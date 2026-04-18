const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- INSCRIPTION ---
exports.register = async (req, res) => {
    try {
        const { nom, email, telephone, mot_de_passe } = req.body;
        const hashedPw = await bcrypt.hash(mot_de_passe, 10);
        const newUser = await User.create({ nom, email, telephone, mot_de_passe: hashedPw });
        res.status(201).json({ message: "Utilisateur créé !", user: newUser });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- CONNEXION ---
exports.login = async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;
        const user = await User.findOne({ where: { email } });
        if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

        const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if (!isMatch) return res.status(400).json({ error: "Mot de passe incorrect" });

        const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET || 'secret_key', { expiresIn: '1h' });
        res.json({ message: "Connecté !", token, userId: user.id });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- MODIFIER SES INFORMATIONS (Nouvelle fonction) ---
exports.updateProfile = async (req, res) => {
    try {
        const { userId, nom, email, telephone } = req.body;
        
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });

        // Mise à jour des champs s'ils sont fournis
        if (nom) user.nom = nom;
        if (email) user.email = email;
        if (telephone) user.telephone = telephone;

        await user.save();
        res.json({ message: "Profil mis à jour avec succès !", user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};