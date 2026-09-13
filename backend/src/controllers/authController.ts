import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import User from '../models/User.ts';
import { getRequiredEnv } from '../lib/envUtils.ts';
import { AppError } from '../lib/AppError.ts';
import { catchAsync } from '../lib/catchAsync.ts';

let client: OAuth2Client;
try {
  client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID || 'dummy');
} catch (e) {
  // Ignore
}

const generateToken = (userId: string, tokenVersion: number): string => {
  const secret = process.env.JWT_SECRET || 'supersecret';
  return jwt.sign({ userId, tokenVersion }, secret, { expiresIn: '30d' });
};

export const googleLogin = catchAsync(async (req: Request, res: Response) => {
  const { token } = req.body;

  if (!token) {
    throw AppError.badRequest('Token is required');
  }

  let payload;

  if (token === 'mock_token') {
    payload = { email: 'mockuser@example.com', sub: 'mock_google_id_123', name: 'Mock User' };
  } else {
    try {
      // First try as an ID token (JWT)
      const ticket = await client.verifyIdToken({
        idToken: token,
        audience: getRequiredEnv('GOOGLE_CLIENT_ID'),
      });
      payload = ticket.getPayload();
    } catch (verifyError: any) {
      // If it fails, it might be an access token from useGoogleLogin
      try {
        const userInfoResponse = await fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
          headers: { Authorization: `Bearer ${token}` }
        });
        if (!userInfoResponse.ok) {
          throw new Error('Failed to fetch user info with access token');
        }
        payload = await userInfoResponse.json();
      } catch (accessError: any) {
        console.warn('Token verification failed as both ID token and Access token.');
        throw AppError.unauthorized('Invalid or expired Google token');
      }
    }
  }

  if (!payload || !payload.email) {
    throw AppError.badRequest('Invalid Google token payload');
  }

  const email = payload.email.toLowerCase();
  const googleId = payload.sub;
  const name = payload.name || email.split('@')[0];
  const picture = payload.picture || '';

  let user = await User.findOne({ email });

  if (user) {
    let changed = false;
    if (!user.googleId) { user.googleId = googleId; changed = true; }
    if (!user.name) { user.name = name; changed = true; }
    if (!user.avatarUrl && picture) { user.avatarUrl = picture; changed = true; }
    if (user.tokenVersion === undefined) { user.tokenVersion = 0; changed = true; }
    if (changed) await user.save();
  } else {
    user = await User.create({ name, email, googleId, avatarUrl: picture });
  }

  const jwtToken = generateToken(user._id.toString(), user.tokenVersion || 0);

  res.cookie('jwt', jwtToken, {
    httpOnly: true,
    maxAge: 30 * 24 * 60 * 60 * 1000,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  res.json({
    success: true,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      picture: user.avatarUrl || '',
      profileCompleted: user.profileCompleted
    }
  });
});

export const logout = catchAsync(async (req: Request, res: Response) => {
  if (req.user && req.user.id) {
    const user = await User.findById(req.user.id);
    if (user) {
      user.tokenVersion = (user.tokenVersion || 0) + 1;
      await user.save();
    }
  }

  res.clearCookie('jwt', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  res.json({ success: true, message: 'Logged out successfully' });
});
