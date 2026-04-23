const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Account = sequelize.define('Account', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    // ON SUPPRIME numero_compte ICI car il n'existe pas dans Neon
    solde: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.00
    },
    userId: { // Vérifie bien si c'est userId ou user_id dans Neon
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'userId', // Force Sequelize à utiliser le nom exact de Neon
        references: { model: 'users', key: 'id' }
    }
}, {
    tableName: 'accounts',
    timestamps: true // Tu as des colonnes createdAt/updatedAt dans Neon, donc mets true
});

module.exports = Account;