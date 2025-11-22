import express from 'express';
import { verifyJWT, JWTPayload } from '../utils/jwt';

export interface AuthenticatedRequest extends express.Request {
  user?: JWTPayload;
}

export const verifyAccessToken = async (
  req: AuthenticatedRequest,
  res: express.Response,
  next: express.NextFunction,
) => {
  try {
    // ヘッダーからトークン取得
    const token = req.cookies?.token;

    if (!token) {
      return res.status(401).json({ message: 'Authorization token required' });
    }

    // トークン検証
    const decodedToken = await verifyJWT(token);

    // ユーザー情報の追加
    req.user = decodedToken;

    next();
  } catch {
    return res.status(401).json({ message: 'Authentication error' });
  }
};
