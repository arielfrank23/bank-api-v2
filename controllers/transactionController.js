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

const { Account, Transaction, User, sequelize } = require('../models');

exports.effectuerVirement = async (req, res) => {
    const { expediteurId, destinataireId, montant } = req.body;
    const t = await sequelize.transaction(); // Début de la transaction

    try {
        // 1. Vérification du montant
        if (montant <= 0) {
            throw new Error("Le montant doit être supérieur à 0");
        }

        // 2. Récupération des comptes
        const compteExp = await Account.findOne({ where: { userId: expediteurId }, transaction: t });
        const compteDest = await Account.findOne({ where: { userId: destinataireId }, transaction: t });

        if (!compteExp || !compteDest) {
            throw new Error("L'un des comptes est introuvable");
        }

        // 3. Vérification du solde (Samuel Etoo doit avoir assez d'argent)
        if (parseFloat(compteExp.solde) < montant) {
            throw new Error("Solde insuffisant pour effectuer cette opération");
        }

        // 4. Débit et Crédit
        await compteExp.update({ solde: parseFloat(compteExp.solde) - montant }, { transaction: t });
        await compteDest.update({ solde: parseFloat(compteDest.solde) + montant }, { transaction: t });

        // 5. Enregistrement de la transaction (Logique d'historique)
        await Transaction.create({
            expediteurId,
            destinataireId,
            montant,
            type: 'VIREMENT',
            statut: 'SUCCES'
        }, { transaction: t });

        await t.commit(); // Validation de toutes les étapes
        res.status(200).json({ message: "Virement effectué avec succès" });

    } catch (error) {
        await t.rollback(); // Annulation de tout en cas d'erreur
        res.status(400).json({ error: error.message });
    }
};