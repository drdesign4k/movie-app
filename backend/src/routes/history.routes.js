import express from 'express';
import History from '../models/history.model.js';
import { protect } from '../middleware/auth.middleware.js';

const router = express.Router();

// GET /api/history
router.get('/', protect, async (req, res) => {
  try {
    const history = await History.find({ user: req.user._id })
      .sort({ viewedAt: -1 })
      .limit(50);
    res.json(history);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST /api/history
router.post('/', protect, async (req, res) => {
  try {
    const { imdbID, title, poster } = req.body;

    // Éviter les doublons — mettre à jour la date si déjà existant
    const entry = await History.findOneAndUpdate(
      { user: req.user._id, imdbID },
      { viewedAt: new Date(), title, poster },
      { upsert: true, new: true }
    );

    res.status(201).json(entry);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE /api/history
router.delete('/', protect, async (req, res) => {
  try {
    await History.deleteMany({ user: req.user._id });
    res.json({ message: 'Historique vidé' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
