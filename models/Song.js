const mongoose = require('mongoose');

const songSchema = new mongoose.Schema({
  title: { type: String, required: true },
  artist: { type: String, required: true },
  cover: { type: String }, // URL de l'image
  audioUrl: { type: String, required: true }, // Lien du mp3
  uploadedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  plays: { type: Number, default: 0 }
}, { timestamps: true });

module.exports = mongoose.model('Song', songSchema);
