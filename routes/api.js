const express = require('express');
const router = express.Router();
const authCtrl = require('../controllers/authController');
const transacCtrl = require('../controllers/transactionController');

// Routes Authentification
router.post('/auth/register', authCtrl.register);
router.post('/auth/login', authCtrl.login);

// Routes Transactions
router.get('/account/balance/:userId', transacCtrl.getBalance);
router.get('/transactions/history/:userId', transacCtrl.getHistory);
router.post('/transactions/transfer', transacCtrl.transfer);

module.exports = router;