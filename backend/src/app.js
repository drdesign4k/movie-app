import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import authRoutes from './routes/auth.routes.js';
import favoritesRoutes from './routes/favorites.routes.js';
import reviewsRoutes from './routes/reviews.routes.js';
import historyRoutes from './routes/history.routes.js';

dotenv.config();

const app = express();

// ── Middleware ────────────────────────────────────────
app.use(cors({ origin: process.env.CLIENT_URL }));
app.use(express.json());

// ── Routes ────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/history', historyRoutes);

// ── Route test ────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ message: '🎬 Movie App API is running !' });
});

// ── Connexion MongoDB ─────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('MongoDB connecté');
    app.listen(process.env.PORT, () => {
      console.log(`Serveur lancé sur le port ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.error('Erreur MongoDB :', err.message);
    process.exit(1);
});
