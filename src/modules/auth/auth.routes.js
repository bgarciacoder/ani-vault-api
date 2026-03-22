import { Router } from 'express';
import { asyncHandler } from '../../shared/asyncHandler.js';
import * as authController from './auth.controller.js';

const router = Router();

router.post('/register', asyncHandler(authController.register));
router.post('/login', asyncHandler(authController.login));

export default router;

