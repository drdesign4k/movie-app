import express from 'express';
import Favorite from '../models/favorite.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/favorites
router.get('/', protect, async (req, res) => {
  try {
    const favorites = await Favorite.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(favorites);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/favorites
router.post('/', protect, async (req, res) => {
  try {
    const { imdbID, title, year, poster, type } = req.body;

    const favorite = await Favorite.create({
      user: req.user._id,
      imdbID, title, year, poster, type
    });

    res.status(201).json(favorite);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Film déjà dans les favoris' });
    }
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/favorites/:imdbID
router.delete('/:imdbID', protect, async (req, res) => {
  try {
    await Favorite.findOneAndDelete({
      user: req.user._id,
      imdbID: req.params.imdbID
    });
    res.json({ message: 'Favori supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
