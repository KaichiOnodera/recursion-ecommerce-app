import express from 'express';
import { AuthenticatedRequest } from './verifyAccessToken';

/**
 * 管理者権限チェックミドルウェア
 */

export const verifyAdmin = async (
  req: AuthenticatedRequest,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    // ユーザー情報が存在するか確認
    if (!req.user) {
      return res.status(401).json({ message: 'Authentication required' });
    }

    // 管理者権限をチェック
    if (req.user.role !== 'ADMIN') {
      return res.status(403).json({ message: 'Admin access required' });
    }

    next();
  } catch {
    return res.status(403).json({ message: 'Authorization error' });
  }
};
