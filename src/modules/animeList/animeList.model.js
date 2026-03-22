import mongoose from 'mongoose';

const allowedStatuses = ['pendiente', 'visto', 'en pausa', 'cancelado'];

const animeListSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    animeId: { type: Number, required: true },
    title: { type: String, required: true },
    image: { type: String, required: true },
    status: { type: String, enum: allowedStatuses, default: 'pendiente', required: true },
  },
  { timestamps: true }
);

animeListSchema.index({ userId: 1, animeId: 1 }, { unique: true });

export const AnimeListItem = mongoose.model('AnimeListItem', animeListSchema);
export const ANIME_STATUSES = allowedStatuses;

