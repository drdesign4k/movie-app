import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imdbID: { type: String, required: true },
  movieTitle: { type: String, required: true },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    maxlength: 500
  }
}, { timestamps: true });

// Un seul avis par user par film
reviewSchema.index({ user: 1, imdbID: 1 }, { unique: true });

export default mongoose.model('Review', reviewSchema);
