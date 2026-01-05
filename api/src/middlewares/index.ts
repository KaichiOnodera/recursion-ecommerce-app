import {
  createVerifyAccessToken,
  createOptionalVerifyAccessToken,
} from './verifyAccessToken';
import { VerifyUserInteractor } from '../contexts/auth/interactors/VerifyUserInteractor';
import { UserRepository } from '../contexts/auth/infrastructures/repositories/UserRepository';
import { prisma } from '../libs/prisma';

const userRepository = new UserRepository(prisma);
const verifyUserInteractor = new VerifyUserInteractor(userRepository);

export const verifyAccessToken = createVerifyAccessToken(verifyUserInteractor);
export const optionalVerifyAccessToken =
  createOptionalVerifyAccessToken(verifyUserInteractor);

export { verifyAdmin } from './verifyAdmin';
export type { AuthenticatedRequest } from './verifyAccessToken';
