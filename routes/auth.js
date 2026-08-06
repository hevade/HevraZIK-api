const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// LOGIN
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Vérifier si l'user existe
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

    // 2. Vérifier le mot de passe
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Email ou mot de passe incorrect' });

    // 3. Créer le token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
// REGISTER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 1. Vérifier si l'email existe déjà
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: 'Cet email est déjà utilisé' });

    // 2. Hasher le mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 3. Créer l'user
    const newUser = new User({
      name,
      email,
      password: hashedPassword
    });

    const savedUser = await newUser.save();

    res.status(201).json({ 
      message: 'Compte créé avec succès',
      user: { id: savedUser._id, name: savedUser.name, email: savedUser.email }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});
