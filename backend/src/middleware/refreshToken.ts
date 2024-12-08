import { Request, Response, NextFunction } from 'express';
import { oAuth2Client } from '../config/oauth2Client';
import { refreshAccessToken } from '../services/authServices';
import { IAdminUser } from '../types/AdminUserTypes';
import AdminUserModal from '../models/AdminUserModal';

export const refreshTokenMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  if (!req.user) {
    console.error('No user found in refreshTokenMiddleware');
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  const userId = req.user.userId;

  if (!userId) {
    console.error('No userId found in refreshTokenMiddleware');
    res.status(401).json({ error: 'Unauthorized' });
    return;
  }

  try {
    const user = (await AdminUserModal.findById(userId)) as IAdminUser;

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    const tokenExpiryDate = user.tokenExpiryDate;
    const accessToken = user.accessToken;

    // Check if the token is missing or expired
    if (!accessToken || !tokenExpiryDate || tokenExpiryDate <= new Date()) {
      await refreshAccessToken(userId);
    }

    // Retrieve the updated user after refreshing the token
    const updatedUser = (await AdminUserModal.findById(userId)) as IAdminUser;

    if (!updatedUser || !updatedUser.accessToken) {
      res.status(500).json({ error: 'Failed to refresh access token' });
      return;
    }

    oAuth2Client.setCredentials({ access_token: updatedUser.accessToken });

    // Attach OAuth2 client and access token to the request
    req.oauth2Client = oAuth2Client;
    req.accessToken = updatedUser.accessToken;

    next();
  } catch (error) {
    console.error('Error in refreshTokenMiddleware:', error);
    res.status(401).json({ error: 'Unauthorized' });
  }
};
