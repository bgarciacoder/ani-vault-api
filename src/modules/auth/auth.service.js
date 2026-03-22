import bcrypt from 'bcryptjs';
import { User } from '../user/user.model.js';
import { HttpError } from '../../shared/httpError.js';
import { signJwt } from '../../shared/auth.js';

export async function register({ email, username, password }) {
  const existing = await User.findOne({ email }).lean();
  if (existing) throw new HttpError(409, 'Email already registered');

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await User.create({ email, username, passwordHash });

  const token = signJwt({ sub: user._id.toString(), email: user.email, username: user.username });
  return { token, user: { id: user._id.toString(), email: user.email, username: user.username } };
}

export async function login({ email, password }) {
  const user = await User.findOne({ email });
  
  if (!user) throw new HttpError(401, 'Invalid credentials');

  const ok = await bcrypt.compare(password, user.passwordHash);
  if (!ok) throw new HttpError(401, 'Invalid credentials');

  const token = signJwt({ sub: user._id.toString(), email: user.email, username: user.username });
  return { token, user: { id: user._id.toString(), email: user.email, username: user.username } };
}

