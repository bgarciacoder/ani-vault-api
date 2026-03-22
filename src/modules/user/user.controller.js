import { User } from './user.model.js';
import { HttpError } from '../../shared/httpError.js';

export async function profile(req, res) {
  const userId = req.user?.sub;
  if (!userId) throw new HttpError(401, 'Unauthorized');

  const user = await User.findById(userId).lean();
  if (!user) throw new HttpError(404, 'User not found');

  res.json({ id: user._id.toString(), email: user.email, username: user.username });
}

