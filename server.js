const express = require('express');
const swaggerUi = require('swagger-ui-express');
const sequelize = require('./config/db');
const apiRoutes = require('./routes/api');
require('dotenv').config();

const app = express();
app.use(express.json());

// Configuration manuelle de Swagger (Zéro crash)
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
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;

// Fonction de démarrage corrigée
async function startServer() {
    try {
        console.log('⏳ Synchronisation avec la base de données...');
        await sequelize.authenticate();
        console.log('✅ Connecté à PostgreSQL sur Neon');
        
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Serveur actif sur http://localhost:${PORT}/api-docs`);
        }).on('error', (err) => {
            if (err.code === 'EADDRINUSE') {
                console.error(`❌ Le port ${PORT} est déjà utilisé. Tapez: fuser -k ${PORT}/tcp`);
                process.exit(1);
            } else {
                console.error('❌ Erreur serveur:', err);
            }
        });

        server.keepAliveTimeout = 60000; 
    } catch (err) {
        console.error('❌ Erreur fatale au démarrage:', err.message);
        process.exit(1);
    }
}

// On lance le serveur
startServer();

// Garde le processus Node ouvert quoi qu'il arrive
setInterval(() => {}, 1000 * 60 * 60);