import express from 'express';
import { verifyJWT, JWTPayload } from '../utils/jwt';
import { IVerifyUserInteractor } from '../contexts/auth/usecases/IVerifyUserInteractor';
import { VerifyUserInteractor } from '../contexts/auth/interactors/VerifyUserInteractor';
import { UserRepository } from '../contexts/auth/infrastructures/repositories/UserRepository';
import { prisma } from '../libs/prisma';

export interface AuthenticatedRequest extends express.Request {
  user?: JWTPayload;
}

/**
 * アクセストークン検証ミドルウェアを生成するファクトリー関数
 * @param verifyUserInteractor ユーザー存在チェック用のInteractor
 */
export const createVerifyAccessToken = (
  verifyUserInteractor: IVerifyUserInteractor,
) => {
  return async (
    req: AuthenticatedRequest,
    res: express.Response,
    next: express.NextFunction,
  ) => {
    try {
      const token = req.cookies?.token;

      if (!token) {
        return res
          .status(401)
          .json({ message: 'Authorization token required' });
      }

      const decodedToken = await verifyJWT(token);

      const userExists = await verifyUserInteractor.execute(
        decodedToken.userId,
      );
      if (!userExists) {
        return res.status(401).json({ message: 'User not found' });
      }

      req.user = decodedToken;

      next();
    } catch {
      return res.status(401).json({ message: 'Authentication error' });
    }
  };
};

const userRepository = new UserRepository(prisma);
const verifyUserInteractor = new VerifyUserInteractor(userRepository);
export const verifyAccessToken = createVerifyAccessToken(verifyUserInteractor);
