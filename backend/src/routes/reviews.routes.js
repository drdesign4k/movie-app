import express from 'express';
import Review from '../models/review.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/reviews/:imdbID
router.get('/:imdbID', async (req, res) => {
  try {
    const reviews = await Review.find({ imdbID: req.params.imdbID })
      .populate('user', 'username')
      .sort({ createdAt: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/reviews
router.post('/', protect, async (req, res) => {
  try {
    const { imdbID, movieTitle, rating, comment } = req.body;

    const review = await Review.create({
      user: req.user._id,
      imdbID, movieTitle, rating, comment
    });

    const populated = await review.populate('user', 'username');
    res.status(201).json(populated);
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'Vous avez déjà noté ce film' });
    }
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/reviews/:id
router.delete('/:id', protect, async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ message: 'Avis introuvable' });

    if (review.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Non autorisé' });
    }

    await review.deleteOne();
    res.json({ message: 'Avis supprimé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
