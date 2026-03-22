import { z } from 'zod';
import { ANIME_STATUSES } from './animeList.model.js';

export const addAnimeSchema = z.object({
  animeId: z.number().int().positive(),
  title: z.string().min(1).max(300),
  image: z.string().url(),
  chapterPaused: z.string()
});

export const updateAnimeStatusSchema = z.object({
  status: z.enum(ANIME_STATUSES),
});

