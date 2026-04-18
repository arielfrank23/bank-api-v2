const User = require('../models/User');
const Account = require('../models/Account');
const Transaction = require('../models/Transaction');

// --- 1. VOIR TOUS LES UTILISATEURS (AVEC LEUR SOLDE) ---
exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({ 
            include: [{ model: Account, attributes: ['solde', 'devise'] }],
            attributes: { exclude: ['mot_de_passe'] } // Sécurité : on ne montre pas les hashs
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 2. GELER / ACTIVER UN COMPTE ---
exports.toggleUserStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);
        
        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        // On inverse le statut actuel
        user.is_active = !user.is_active;
        await user.save();

        res.json({ 
            message: `Utilisateur ${user.nom} est maintenant ${user.is_active ? 'ACTIF' : 'GELÉ'}` 
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 3. MODIFIER LE SOLDE (CORRECTION D'ERREUR) ---
exports.adjustBalance = async (req, res) => {
    try {
        const { telephone, nouveau_solde } = req.body;
        const user = await User.findOne({ where: { telephone }, include: Account });

        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        user.Account.solde = nouveau_solde;
        await user.Account.save();

        res.json({ message: `Le solde de ${telephone} a été ajusté à ${nouveau_solde} XAF` });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 4. SUPPRIMER UN COMPTE (IRRÉVERSIBLE) ---
exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findByPk(id);

        if (!user) return res.status(404).json({ message: "Utilisateur non trouvé" });

        await user.destroy(); // Grâce au CASCADE, le compte est aussi supprimé
        res.json({ message: "Compte et données associées supprimés définitivement" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- 5. RAPPORT FINANCIER GLOBAL ---
exports.getGlobalReport = async (req, res) => {
    try {
        const totalUsers = await User.count({ where: { role: 'CLIENT' } });
        const totalMoney = await Account.sum('solde');
        const totalTransactions = await Transaction.count();

        res.json({
            statistiques: {
                nombre_clients: totalUsers,
                masse_monetaire_totale: totalMoney || 0,
                volume_transactions: totalTransactions
            }
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};