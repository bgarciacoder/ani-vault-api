import { HttpError } from '../../shared/httpError.js';
import { addAnimeSchema, updateAnimeSchema } from './animeList.schemas.js';
import * as animeListService from './animeList.service.js';

function requireUserId(req) {
  const userId = req.user?.sub;
  if (!userId) throw new HttpError(401, 'Unauthorized');
  return userId;
}

export async function list(req, res) {
  const userId = requireUserId(req);
  const items = await animeListService.listForUser(userId);
  res.json(items);
}

export async function add(req, res) {
  const userId = requireUserId(req);
  const input = addAnimeSchema.parse(req.body);
  const created = await animeListService.addForUser(userId, input);
  res.status(201).json(created);
}

export async function update(req, res) {
  const userId = requireUserId(req);
  const { id } = req.params;

  const data = updateAnimeSchema.parse(req.body);

  if (Object.keys(data).length === 0) {
    throw new HttpError(400, 'No fields to update');
  }

  const updated = await animeListService.update(userId, id, data);

  res.json(updated);
}

export async function updateChapterPaused(req, res) {
  const userId = requireUserId(req);
  const { id } = req.params;
  const { chapterPaused } = updateAnimeStatusSchema.parse(req.body);
  const updated = await animeListService.updateStatus(userId, id, chapterPaused);
  res.json(updated);
}

export async function remove(req, res) {
  const userId = requireUserId(req);
  const { id } = req.params;
  await animeListService.removeItem(userId, id);
  res.status(204).send();
}

