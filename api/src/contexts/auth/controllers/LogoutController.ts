import express from 'express';

export class LogoutController {
  async execute(_req: express.Request, res: express.Response) {
    // Cookieを削除
    res.clearCookie('token', { path: '/' });
    res.status(200).json({ message: 'Logout successfully' });
  }
}
