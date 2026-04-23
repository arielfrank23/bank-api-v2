const { Sequelize } = require('sequelize');
require('dotenv').config();

const sequelize = new Sequelize(process.env.DATABASE_URL, {
  dialect: 'postgres',
  protocol: 'postgres',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false // Indispensable pour éviter les blocages de certificats sur Ubuntu
    }
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000, // Temps max pour établir une connexion (30s)
    idle: 10000
  },
  logging: false // Pour ne pas polluer ton terminal
});
ssl: true

module.exports = sequelize;