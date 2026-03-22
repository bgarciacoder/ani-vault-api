import jwt from 'jsonwebtoken';
import { HttpError } from './httpError.js';

export function signJwt(payload) {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error('JWT_SECRET is required');
  return jwt.sign(payload, secret, { expiresIn: '7d' });
}

export function requireAuth(req, _res, next) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return next(new HttpError(401, 'Missing token'));

  try {
    const secret = process.env.JWT_SECRET;
    if (!secret) throw new Error('JWT_SECRET is required');
    const decoded = jwt.verify(token, secret);
    req.user = decoded;
    return next();
  } catch {
    return next(new HttpError(401, 'Invalid token'));
  }
}

