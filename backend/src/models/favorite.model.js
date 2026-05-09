import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imdbID: { type: String, required: true },
  title: { type: String, required: true },
  year: { type: String },
  poster: { type: String },
  type: { type: String }
}, { timestamps: true });

// Un film ne peut être en favori qu'une seule fois par user
favoriteSchema.index({ user: 1, imdbID: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);
