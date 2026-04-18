const Account = require('../models/Account');
const Transaction = require('../models/Transaction');
const sequelize = require('../config/db');

exports.getBalance = async (req, res) => {
    try {
        const account = await Account.findOne({ where: { user_id: req.params.userId } });
        if (!account) return res.status(404).json({ error: "Compte non trouvé" });
        res.json({ numero_compte: account.numero_compte, solde: account.solde });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.getHistory = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: {
                [sequelize.Op.or]: [
                    { expediteur_id: req.params.userId },
                    { destinataire_id: req.params.userId }
                ]
            },
            order: [['createdAt', 'DESC']]
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

exports.transfer = async (req, res) => {
    try {
        res.json({ message: "Prêt pour le virement" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};