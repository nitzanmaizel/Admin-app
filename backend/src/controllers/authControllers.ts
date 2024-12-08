import { Request, Response } from 'express';
import { google } from 'googleapis';
import jwt from 'jsonwebtoken';

import AdminUserModal from '../models/AdminUserModal';
import { oAuth2Client, SCOPES } from '../config/oauth2Client';
import { IAdminUser } from '../types/AdminUserTypes';

const jwtSecret = process.env.JWT_SECRET as string;
const frontendUrl = process.env.FRONTEND_URL as string;

export const login = (_req: Request, res: Response) => {
  const authUrl = oAuth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: SCOPES,
    prompt: 'consent',
  });
  res.redirect(authUrl);
};

export const googleCallback = async (req: Request, res: Response): Promise<void> => {
  const code = req.query.code as string;

  if (!code) {
    res.status(400).send('Authorization code not provided');
    return;
  }

  try {
    const { tokens } = await oAuth2Client.getToken(code);

    oAuth2Client.setCredentials(tokens);

    const oauth2 = google.oauth2({ auth: oAuth2Client, version: 'v2' });
    const userInfoResponse = await oauth2.userinfo.get();
    const userInfo = userInfoResponse.data;

    const email = userInfo.email;
    const firstName = userInfo.given_name || '';

    const lastName = userInfo.family_name || '';
    const picture = userInfo.picture || '';

    const adminUser = await AdminUserModal.findOne({ email });

    if (!adminUser || adminUser.role !== 'admin') {
      res.redirect(`${frontendUrl}/admin/unauthorized`);
      return;
    }

    adminUser.picture = picture;
    adminUser.accessToken = tokens.access_token!;
    adminUser.refreshToken = tokens.refresh_token || adminUser.refreshToken;
    adminUser.tokenExpiryDate = tokens.expiry_date ? new Date(tokens.expiry_date) : undefined;

    await adminUser.save();

    const jwtPayload = {
      userId: adminUser.userId,
      email,
      firstName,
      lastName,
      picture,
      role: adminUser.role,
    };

    const jwtToken = jwt.sign(jwtPayload, jwtSecret, { expiresIn: '7d' });

    res.redirect(`${frontendUrl}?token=${jwtToken}`);
  } catch (error) {
    console.error('Error exchanging code for token:', error);
    res.status(500).send('Authentication failed');
  }
};

export const getProfile = async (req: Request, res: Response): Promise<void> => {
  try {
    const user = req.user as IAdminUser;

    if (!user) {
      res.status(401).send('User not authenticated');
      return;
    }

    const { firstName, lastName, email, picture, role } = user;

    res.json({ firstName, lastName, email, picture, role });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).send('Failed to fetch profile');
  }
};
