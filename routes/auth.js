const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User'); // Vérifie que tu as bien ce fichier

// @route   POST /api/auth/register
// @desc    Créer un utilisateur
router.post('/register', async (req, res) => {
  const { username, email, password } = req.body;

  try {
    // Vérifier si l'user existe déjà
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ error: 'User already exists' });
    }

    // Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Créer l'user
    user = new User({
      username,
      email,
      password: hashedPassword
    });

    await user.save();

    // Créer le token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({ 
      token, 
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


// @route   POST /api/auth/login
// @desc    Connecter un utilisateur
router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    // Vérifier si l'user existe
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'User not found' });

    // Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: 'Wrong password' });

    // Créer le token - ATTENTION ICI C'EST JWT_SECRET EN MAJUSCULE
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({ 
      token, 
      user: {
        id: user._id,
        username: user.username,
        email: user.email
      }
    });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});


module.exports = router;
