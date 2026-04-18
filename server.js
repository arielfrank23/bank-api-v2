const express = require('express');
const swaggerUi = require('swagger-ui-express');
const sequelize = require('./config/db');
const apiRoutes = require('./routes/api');
require('dotenv').config();

const app = express();
app.use(express.json());

const swaggerDocs = {
  openapi: '3.0.0',
  info: {
    title: 'Bank API V2 - Ariel',
    version: '1.0.0',
    description: 'API Bancaire - Université de Yaoundé I'
  },
  tags: [
    { name: 'Authentification' },
    { name: 'Utilisateur (Client)' }
  ],
  paths: {
    '/api/auth/register': {
      post: { tags: ['Authentification'], summary: 'Inscription', responses: { 200: { description: 'OK' } } }
    },
    '/api/auth/login': {
      post: { tags: ['Authentification'], summary: 'Connexion', responses: { 200: { description: 'OK' } } }
    },
    '/api/account/balance/{userId}': {
      get: { 
        tags: ['Utilisateur (Client)'], 
        summary: 'Consulter son solde',
        parameters: [{ in: 'path', name: 'userId', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'OK' } } 
      }
    },
    '/api/transactions/history/{userId}': {
      get: { 
        tags: ['Utilisateur (Client)'], 
        summary: 'Historique des transactions',
        parameters: [{ in: 'path', name: 'userId', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'OK' } } 
      }
    },
    '/api/transactions/transfer': {
      post: { tags: ['Utilisateur (Client)'], summary: 'Effectuer un virement', responses: { 200: { description: 'OK' } } }
    },
    '/api/transactions/deposit': {
      post: { tags: ['Utilisateur (Client)'], summary: 'Déposer de l\'argent', responses: { 200: { description: 'OK' } } }
    },
    '/api/transactions/withdraw': {
      post: { tags: ['Utilisateur (Client)'], summary: 'Retirer de l\'argent', responses: { 200: { description: 'OK' } } }
    },
    '/api/user/update': {
      put: { tags: ['Utilisateur (Client)'], summary: 'Modifier mes informations', responses: { 200: { description: 'OK' } } }
    },
    '/api/account/rib/{userId}': {
      get: { 
        tags: ['Utilisateur (Client)'], 
        summary: 'Télécharger RIB (PDF)', 
        parameters: [{ in: 'path', name: 'userId', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'Fichier PDF envoyé' } } 
      }
    },
    '/api/account/close': {
      delete: { tags: ['Utilisateur (Client)'], summary: 'Clôturer le compte', responses: { 200: { description: 'Compte supprimé' } } }
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;

async function startServer() {
    try {
        await sequelize.authenticate();
        console.log('✅ Connecté à PostgreSQL sur Neon');
        app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Serveur actif sur http://localhost:${PORT}/api-docs`);
        });
    } catch (err) {
        console.error('❌ Erreur:', err.message);
        process.exit(1);
    }
}

startServer();