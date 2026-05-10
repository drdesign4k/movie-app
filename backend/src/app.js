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
app.use(
  cors({
    origin: function (origin, callback) {
      const allowedOrigins = [
        'http://localhost:4200',
        'https://cinemap-app.vercel.app',
        process.env.CLIENT_URL,
      ];
      // Autoriser les requêtes sans origin (Postman, mobile) et les origins autorisées
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  }),
);

app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/favorites', favoritesRoutes);
app.use('/api/reviews', reviewsRoutes);
app.use('/api/history', historyRoutes);

// ── Health check pour Render ──────────────────────────
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// ── Connexion MongoDB ─────────────────────────────────
mongoose
  .connect(process.env.MONGODB_URI)
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
