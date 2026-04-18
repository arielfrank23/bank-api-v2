const express = require('express');
const swaggerUi = require('swagger-ui-express');
const sequelize = require('./config/db');
const apiRoutes = require('./routes/api');
require('dotenv').config();

const app = express();
app.use(express.json());

// Configuration complète de Swagger (Zéro crash)
const swaggerDocs = {
  openapi: '3.0.0',
  info: {
    title: 'Bank API V2 - Ariel',
    version: '1.0.0',
    description: 'API Bancaire - Université de Yaoundé I'
  },
  tags: [
    { name: 'Authentification' },
    { name: 'Utilisateur (Client)' },
    { name: 'Administration' }
  ],
  paths: {
    // --- AUTHENTIFICATION ---
    '/api/auth/register': {
      post: { tags: ['Authentification'], summary: 'Inscription', responses: { 200: { description: 'OK' } } }
    },
    '/api/auth/login': {
      post: { tags: ['Authentification'], summary: 'Connexion', responses: { 200: { description: 'OK' } } }
    },
    '/api/user/update': {
      put: { tags: ['Utilisateur (Client)'], summary: 'Modifier mes informations', responses: { 200: { description: 'OK' } } }
    },

    // --- UTILISATEUR (CLIENT) ---
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
    '/api/account/rib/{userId}': {
      get: { 
        tags: ['Utilisateur (Client)'], 
        summary: 'Télécharger RIB (PDF)', 
        parameters: [{ in: 'path', name: 'userId', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'OK' } } 
      }
    },
    '/api/account/close': {
      delete: { tags: ['Utilisateur (Client)'], summary: 'Clôturer le compte', responses: { 200: { description: 'OK' } } }
    },

    // --- ADMINISTRATION ---
    '/api/admin/users': {
      get: { tags: ['Administration'], summary: 'Liste de tous les utilisateurs', responses: { 200: { description: 'OK' } } }
    },
    '/api/admin/user/{userId}': { 
      delete: { 
        tags: ['Administration'], 
        summary: 'Supprimer un utilisateur',
        parameters: [{ in: 'path', name: 'userId', required: true, schema: { type: 'integer' } }],
        responses: { 200: { description: 'OK' } } 
      } 
    },
    '/api/admin/transactions': {
      get: { tags: ['Administration'], summary: 'Voir toutes les transactions du système', responses: { 200: { description: 'OK' } } }
    },
    '/api/admin/reports/global': {
      get: { tags: ['Administration'], summary: 'Générer des rapports financiers globaux', responses: { 200: { description: 'OK' } } }
    },
    '/api/admin/create-admin': {
      post: { tags: ['Administration'], summary: 'Créer d\'autres comptes administrateurs', responses: { 201: { description: 'Admin créé' } } }
    },
    '/api/admin/settings': {
      put: { tags: ['Administration'], summary: 'Définir plafonds et frais bancaires', responses: { 200: { description: 'Paramètres mis à jour' } } }
    },
    '/api/admin/account/status': {
      put: { tags: ['Administration'], summary: 'Valider, Activer ou Bloquer un compte', responses: { 200: { description: 'OK' } } }
    },
    '/api/admin/account/adjust-balance': {
      put: { tags: ['Administration'], summary: 'Modifier le solde (Correction)', responses: { 200: { description: 'OK' } } }
    }
  }
};

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
app.use('/api', apiRoutes);

const PORT = process.env.PORT || 3000;

// Fonction de démarrage
async function startServer() {
    try {
        console.log('⏳ Synchronisation avec la base de données...');
        await sequelize.authenticate();
        console.log('✅ Connecté à PostgreSQL sur Neon');
        
        const server = app.listen(PORT, '0.0.0.0', () => {
            console.log(`🚀 Serveur actif sur http://localhost:${PORT}/api-docs`);
        });

        server.keepAliveTimeout = 60000; 

    } catch (err) {
        console.error('❌ Erreur fatale au démarrage:', err.message);
        process.exit(1);
    }
}

startServer();