const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const sequelize = require('../config/db');

// Consulter le solde
exports.getBalance = async (req, res) => {
    try {
        const account = await Account.findOne({ where: { user_id: req.params.userId } });
        if (!account) return res.status(404).json({ error: "Compte non trouvé" });
        res.json({ numero_compte: account.numero_compte, solde: account.solde });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Historique
exports.getHistory = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: {
                [sequelize.Op.or]: [
                    { expediteur_tel: req.params.userId }, // Simplifié pour le test
                    { destinataire_tel: req.params.userId }
                ]
            },
            order: [['createdAt', 'DESC']]
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Virement
exports.transfer = async (req, res) => {
    res.json({ message: "Fonction de virement prête" });
};

// Dépôt
exports.deposit = async (req, res) => {
    try {
        const { userId, montant } = req.body;
        const account = await Account.findOne({ where: { user_id: userId } });
        if (!account) return res.status(404).json({ error: "Compte non trouvé" });
        
        account.solde = parseFloat(account.solde) + parseFloat(montant);
        await account.save();
        
        res.json({ message: "✅ Dépôt réussi", nouveau_solde: account.solde });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Retrait
exports.withdraw = async (req, res) => {
    try {
        const { userId, montant } = req.body;
        const account = await Account.findOne({ where: { user_id: userId } });
        if (!account) return res.status(404).json({ error: "Compte non trouvé" });
        
        if (parseFloat(account.solde) < parseFloat(montant)) {
            return res.status(400).json({ error: "❌ Solde insuffisant" });
        }
        
        account.solde = parseFloat(account.solde) - parseFloat(montant);
        await account.save();
        
        res.json({ message: "✅ Retrait réussi", nouveau_solde: account.solde });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Simulation RIB
exports.getRIB = async (req, res) => {
    res.json({ 
        message: "📄 Génération du RIB en cours...", 
        info: "Cette fonction simulera bientôt l'envoi d'un PDF." 
    });
};

// Clôture
exports.closeAccount = async (req, res) => {
    try {
        const { userId } = req.body;
        await Account.destroy({ where: { user_id: userId } });
        res.json({ message: "⚠️ Compte clôturé. Action irréversible effectuée." });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};