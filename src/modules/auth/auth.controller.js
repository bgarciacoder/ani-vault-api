import { registerSchema, loginSchema } from './auth.schemas.js';
import * as authService from './auth.service.js';

export async function register(req, res) {
  const input = registerSchema.parse(req.body);
  const result = await authService.register(input);
  res.status(201).json(result);
}

export async function login(req, res) {
  const input = loginSchema.parse(req.body);
  const result = await authService.login(input);
  res.json(result);
}

