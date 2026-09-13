import { Request, Response } from 'express';
import User from '../models/User.ts';
import { AppError } from '../lib/AppError.ts';
import { catchAsync } from '../lib/catchAsync.ts';

export const getMe = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw AppError.unauthorized('User not authenticated');
  }

  const user = await User.findById(userId);
  if (!user) {
    throw AppError.notFound('User not found');
  }

  res.json({
    success: true,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      neighborhood: user.neighborhood,
      emergencyContactName: user.emergencyContactName,
      emergencyContactPhone: user.emergencyContactPhone,
      notificationPrefs: user.notificationPrefs,
      picture: user.avatarUrl || '',
      profileCompleted: user.profileCompleted
    }
  });
});

export const updateProfile = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) {
    throw AppError.unauthorized('User not authenticated');
  }

  const { phone, neighborhood, emergencyContactName, emergencyContactPhone, notificationPrefs, avatarUrl } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    throw AppError.notFound('User not found');
  }

  if (phone !== undefined) user.phone = phone;
  if (neighborhood !== undefined) user.neighborhood = neighborhood;
  if (emergencyContactName !== undefined) user.emergencyContactName = emergencyContactName;
  if (emergencyContactPhone !== undefined) user.emergencyContactPhone = emergencyContactPhone;
  if (notificationPrefs !== undefined) user.notificationPrefs = notificationPrefs;
  if (avatarUrl !== undefined) user.avatarUrl = avatarUrl;

  user.profileCompleted = true;

  await user.save();

  res.json({
    success: true,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      phone: user.phone,
      neighborhood: user.neighborhood,
      emergencyContactName: user.emergencyContactName,
      emergencyContactPhone: user.emergencyContactPhone,
      notificationPrefs: user.notificationPrefs,
      picture: user.avatarUrl || '',
      profileCompleted: user.profileCompleted
    }
  });
});
