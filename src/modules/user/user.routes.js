import { Router } from 'express';
import { requireAuth } from '../../shared/auth.js';
import { asyncHandler } from '../../shared/asyncHandler.js';
import * as userController from './user.controller.js';
import * as animeListController from '../animeList/animeList.controller.js';

const router = Router();

router.get('/profile', requireAuth, asyncHandler(userController.profile));

router.get('/anime-list', requireAuth, asyncHandler(animeListController.list));
router.post('/anime-list', requireAuth, asyncHandler(animeListController.add));
router.put('/anime-list/:id', requireAuth, asyncHandler(animeListController.update));
router.delete('/anime-list/:id', requireAuth, asyncHandler(animeListController.remove));

export default router;

