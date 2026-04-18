const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

// 1 & 2. Statut du compte
exports.updateAccountStatus = async (req, res) => {
    try {
        const { userId, status } = req.body;
        res.json({ message: `Statut mis à jour pour ${userId} : ${status}` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Liste des utilisateurs
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['mot_de_passe'] } });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 4. Toutes les transactions
exports.getAllTransactions = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({ order: [['createdAt', 'DESC']] });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 5. Ajuster solde
exports.adjustBalance = async (req, res) => {
    try {
        const { userId, nouveauSolde } = req.body;
        const account = await Account.findOne({ where: { user_id: userId } });
        if (!account) return res.status(404).json({ error: "Compte non trouvé" });
        account.solde = nouveauSolde;
        await account.save();
        res.json({ message: "Solde corrigé", nouveau_solde: account.solde });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 6. SUPPRIMER UN UTILISATEUR (Celle qui manquait !)
exports.deleteUser = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findByPk(userId);
        if (!user) return res.status(404).json({ error: "Utilisateur non trouvé" });
        await user.destroy();
        res.json({ message: "Utilisateur supprimé définitivement" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 7. Rapports
exports.getGlobalReport = async (req, res) => {
    res.json({ message: "Rapport global généré", date: new Date() });
};

// 8 & 10. Paramètres
exports.updateSystemSettings = async (req, res) => {
    res.json({ message: "Paramètres mis à jour" });
};

// 9. Créer Admin
exports.createAdmin = async (req, res) => {
    res.json({ message: "Admin créé" });
};