import mongoose from 'mongoose';

const historySchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  imdbID: { type: String, required: true },
  title: { type: String, required: true },
  poster: { type: String },
  viewedAt: {
    type: Date,
    default: Date.now
  }
});

export default mongoose.model('History', historySchema);
