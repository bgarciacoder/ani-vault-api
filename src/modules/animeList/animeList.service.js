import mongoose from 'mongoose';
import { AnimeListItem } from './animeList.model.js';
import { HttpError } from '../../shared/httpError.js';

export async function listForUser(userId) {
  return AnimeListItem.find({ userId }).sort({ updatedAt: -1 }).lean();
}

export async function addForUser(userId, { animeId, title, image }) {
  try {
    const created = await AnimeListItem.create({
      userId,
      animeId,
      title,
      image,
      status: 'pendiente',
    });
    return created.toObject();
  } catch (err) {
    // duplicate anime per user
    if (err?.code === 11000) throw new HttpError(409, 'Anime already in list');
    throw err;
  }
}

export async function update(userId, itemId, data) {
  if (!mongoose.isValidObjectId(itemId)) {
    throw new HttpError(400, 'Invalid id');
  }

  const updated = await AnimeListItem.findOneAndUpdate(
    { _id: itemId, userId },
    { $set: data },
    { new: true }
  ).lean();

  if (!updated) {
    throw new HttpError(404, 'Anime list item not found');
  }

  return updated;
}

export async function updateChapterPaused(userId, itemId, chapterPaused) {
  if (!mongoose.isValidObjectId(itemId)) throw new HttpError(400, 'Invalid id');

  const updated = await AnimeListItem.findOneAndUpdate(
    { _id: itemId, userId },
    { $set: { chapterPaused } },
    { new: true }
  ).lean();

  if (!updated) throw new HttpError(404, 'Anime list item not found');
  return updated;
}

export async function removeItem(userId, itemId) {
  if (!mongoose.isValidObjectId(itemId)) throw new HttpError(400, 'Invalid id');
  const deleted = await AnimeListItem.findOneAndDelete({ _id: itemId, userId }).lean();
  if (!deleted) throw new HttpError(404, 'Anime list item not found');
  return deleted;
}

