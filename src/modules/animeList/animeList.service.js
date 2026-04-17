import mongoose from 'mongoose';
import { AnimeListItem } from './animeList.model.js';
import { HttpError } from '../../shared/httpError.js';

export async function listForUser(userId, page = 1, status) {
  // return AnimeListItem.find({ userId }).sort({ updatedAt: -1 }).lean();
  const limit = 24;
  const safePage = Math.max(1, page);
  const safeLimit = Math.min(100, Math.max(1, limit)); // cap para evitar abusos

  const skip = (safePage - 1) * safeLimit;

  const query = { userId };

  if(status && status !== ""){
    query.status = status;
  }

  const [items, total, statusCountItems] = await Promise.all([
    AnimeListItem.find(query)
      .sort({ updatedAt: -1 })
      .skip(skip)
      .limit(safeLimit)
      .lean(),
    AnimeListItem.countDocuments({ userId }),
    AnimeListItem.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          visto: {
            $sum: { $cond: [{ $eq: ["$status", "visto"] }, 1, 0] }
          },
          enPausa: {
            $sum: { $cond: [{ $eq: ["$status", "en pausa"] }, 1, 0] }
          },
          cancelado: {
            $sum: { $cond: [{ $eq: ["$status", "cancelado"] }, 1, 0] }
          },
          pendiente: {
            $sum: { $cond: [{ $eq: ["$status", "pendiente"] }, 1, 0] }
          },
          siguiendo: {
            $sum: { $cond: [{ $eq: ["$status", "siguiendo"] }, 1, 0] }
          }
        }
      }
    ])
  ]);

  const defaultCounts = {
    visto: 0,
    enPausa: 0,
    cancelado: 0,
    pendiente: 0,
    siguiendo: 0
  };

  const statusCounts = statusCountItems[0] ? {
    ...defaultCounts,
    ...statusCountItems[0]
  } : defaultCounts;

  return {
    data: items,
    pagination: {
      total,
      page: safePage,
      limit: safeLimit,
      totalPages: Math.ceil(total / safeLimit)
    },
    statusCounts
  };
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

