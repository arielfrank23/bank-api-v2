const { Account, Transaction, User, sequelize } = require('../models');

// 1. Consulter le solde
exports.getBalance = async (req, res) => {
    try {
        const account = await Account.findOne({ where: { userId: req.params.userId } });
        if (!account) return res.status(404).json({ error: "Compte non trouvé" });
        res.json({ solde: account.solde });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 2. Historique des transactions
exports.getHistory = async (req, res) => {
    try {
        const transactions = await Transaction.findAll({
            where: {
                [sequelize.Op.or]: [
                    { expediteurId: req.params.userId },
                    { destinataireId: req.params.userId }
                ]
            },
            order: [['createdAt', 'DESC']]
        });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// 3. Logique de Virement (Transactionnelle)
exports.transfer = async (req, res) => {
    const { expediteurId, destinataireId, montant } = req.body;
    const t = await sequelize.transaction();

    try {
        if (montant <= 0) throw new Error("Le montant doit être supérieur à 0");

        const compteExp = await Account.findOne({ where: { userId: expediteurId }, transaction: t });
        const compteDest = await Account.findOne({ where: { userId: destinataireId }, transaction: t });

        if (!compteExp || !compteDest) throw new Error("Compte expéditeur ou destinataire introuvable");

        if (parseFloat(compteExp.solde) < montant) {
            throw new Error("❌ Solde insuffisant");
        }

        // Mise à jour des soldes
        await compteExp.update({ solde: parseFloat(compteExp.solde) - montant }, { transaction: t });
        await compteDest.update({ solde: parseFloat(compteDest.solde) + montant }, { transaction: t });

        // Création de l'enregistrement de transaction
        await Transaction.create({
            expediteurId,
            destinataireId,
            montant,
            type: 'VIREMENT',
            statut: 'SUCCES'
        }, { transaction: t });

        await t.commit();
        res.json({ message: "✅ Virement réussi" });
    } catch (error) {
        await t.rollback();
        res.status(400).json({ error: error.message });
    }
};

// 4. Dépôt
exports.deposit = async (req, res) => {
    try {
        const { userId, montant } = req.body;
        const account = await Account.findOne({ where: { userId } });
        if (!account) return res.status(404).json({ error: "Compte non trouvé" });

        account.solde = parseFloat(account.solde) + parseFloat(montant);
        await account.save();
        res.json({ message: "✅ Dépôt réussi", nouveau_solde: account.solde });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Les autres fonctions (withdraw, getRIB, closeAccount) suivent la même logique...