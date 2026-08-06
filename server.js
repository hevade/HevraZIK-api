const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();

// 1. MIDDLEWARE
app.use(cors());
app.use(express.json());

// 2. CONNEXION MONGODB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('MongoDB Connecté'))
.catch(err => console.log(err));

// 3. IMPORT DES ROUTES
const authRoutes = require('./routes/auth');
const songRoutes = require('./routes/songs');

// 4. UTILISER LES ROUTES
app.use('/api/auth', authRoutes);
app.use('/api/songs', songRoutes);

// Route de test
app.get('/', (req, res) => {
  res.send('HevraZIK API is running');
});

// 5. LANCER LE SERVEUR - TOUJOURS EN DERNIER
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
