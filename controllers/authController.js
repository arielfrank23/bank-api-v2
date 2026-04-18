const User = require('../models/User');
const Account = require('../models/Account'); // IMPORTANT: Import du modèle Account
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// --- 1. INSCRIPTION + CRÉATION COMPTE (Points 1 & 3) ---
exports.register = async (req, res) => {
    console.log("🚀 Tentative d'inscription pour :", req.body.email);
    
    try {
        const { nom, email, mot_de_passe, telephone } = req.body;

        // 1. Hachage du mot de passe
        const salt = await bcrypt.genSalt(10);
        const hashedPwd = await bcrypt.hash(mot_de_passe, salt);

        // 2. Création de l'utilisateur
        const newUser = await User.create({
            nom,
            email,
            mot_de_passe: hashedPwd,
            telephone,
            role: 'CLIENT'
        });

        // 3. LOGIQUE MÉTIER : Création automatique du compte bancaire (Point 3)
        // On génère un numéro de compte unique (ex: ACC + timestamp)
        const generateAccountNumber = "ACC-" + Math.floor(100000 + Math.random() * 900000);

        const newAccount = await Account.create({
            numero_compte: generateAccountNumber,
            solde: 0.0, // Solde initial à zéro
            user_id: newUser.id
        });

        console.log(`✅ Compte ${generateAccountNumber} créé pour ${nom}`);

        res.status(201).json({
            message: "Utilisateur et compte créés avec succès !",
            user: { 
                id: newUser.id, 
                nom: newUser.nom, 
                email: newUser.email 
            },
            account: {
                numero_compte: newAccount.numero_compte,
                solde_initial: newAccount.solde
            }
        });

    } catch (error) {
        console.error("❌ Erreur inscription :", error.message);
        res.status(400).json({ error: error.message });
    }
};

// --- 2. CONNEXION (Point 2) ---
exports.login = async (req, res) => {
    try {
        const { email, mot_de_passe } = req.body;
        
        // On cherche l'utilisateur
        const user = await User.findOne({ where: { email } });

        // Note : is_active doit être dans ton modèle User, sinon enlève cette vérification
        if (!user) {
            return res.status(401).json({ error: "Utilisateur non trouvé." });
        }

        // Vérification du mot de passe
        const validPwd = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if (!validPwd) {
            return res.status(401).json({ error: "Mot de passe incorrect." });
        }

        // Génération du Token JWT
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || 'secret_yaounde_2026',
            { expiresIn: '24h' }
        );

        res.json({ 
            message: "Connexion réussie", 
            token,
            user: { id: user.id, nom: user.nom, role: user.role }
        });
        
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};