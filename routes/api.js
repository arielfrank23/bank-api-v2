const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const transacCtrl = require('../controllers/transactionController');

// Authentification
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);
router.put('/user/update', authCtrl.updateProfile); // Ajouté

// Transactions
router.get('/account/balance/:userId', transacCtrl.getBalance);
router.get('/transactions/history/:userId', transacCtrl.getHistory);
router.post('/transactions/transfer', transacCtrl.transfer);
router.post('/transactions/deposit', transacCtrl.deposit); // Ajouté
router.post('/transactions/withdraw', transacCtrl.withdraw); // Ajouté

// Gestion Compte
router.get('/account/rib/:userId', transacCtrl.getRIB); // Ajouté
router.delete('/account/close', transacCtrl.closeAccount); // Ajouté

module.exports = router;