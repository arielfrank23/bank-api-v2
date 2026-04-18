const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nom: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    telephone: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    mot_de_passe: {
        type: DataTypes.STRING,
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('CLIENT', 'ADMIN'),
        defaultValue: 'CLIENT'
    }
}, {
    tableName: 'users',
    // ⬇️ C'EST CETTE LIGNE QUI RÈGLE TON ERREUR ⬇️
    timestamps: false 
});

module.exports = User;