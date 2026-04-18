const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./User');

const Account = sequelize.define('Account', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    numero_compte: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    solde: {
        type: DataTypes.DECIMAL(15, 2),
        defaultValue: 0.00
    },
    user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: { model: 'users', key: 'id' }
    }
}, {
    tableName: 'accounts',
    timestamps: false // On reste sur false pour correspondre à ta structure actuelle
});

// Définir la relation
User.hasOne(Account, { foreignKey: 'user_id' });
Account.belongsTo(User, { foreignKey: 'user_id' });

module.exports = Account;