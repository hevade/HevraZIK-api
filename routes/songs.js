const express = require('express');
const router = express.Router();
const Song = require('../models/Song');

// GET TOUTES LES MUSIQUES
router.get('/', async (req, res) => {
  try {
    const songs = await Song.find().sort({ createdAt: -1 });
    res.json(songs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST AJOUTER UNE MUSIQUE
router.post('/', async (req, res) => {
  try {
    const newSong = new Song(req.body);
    const savedSong = await newSong.save();
    res.status(201).json(savedSong);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
