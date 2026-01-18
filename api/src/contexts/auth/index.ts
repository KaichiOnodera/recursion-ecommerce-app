import { LoginController } from './controllers/LoginController';
import { LogoutController } from './controllers/LogoutController';
import { MeController } from './controllers/MeController';
import { SignupController } from './controllers/SignupController';
import { ResignController } from './controllers/ResignController';
import { LoginInteractor } from './interactors/LoginInteractor';
import { VerifyUserInteractor } from './interactors/VerifyUserInteractor';
import { GetMeInteractor } from './interactors/GetMeInteractor';
import { SignupInteractor } from './interactors/SignupInteractor';
import { ResignInteractor } from './interactors/ResignInteractor';
import { UserRepository } from './infrastructures/repositories/UserRepository';
import { prisma } from '../../libs/prisma';
import express from 'express';
import { verifyAccessToken } from '../../middlewares';
import { EmailAdapter } from '../mail/infrastructures/adapters/EmailAdapter';
import { EmailVerificationRepository } from './infrastructures/repositories/EmailVerificationRepository';
import { VerifyTokenInteractor } from '../mail/interactors/VerifyTokenInteractor';
import { VerifyTokenController } from '../mail/controllers/VerifyTokenController';

const authRouter = express.Router();

const userRepository = new UserRepository(prisma);
const emailAdapter = new EmailAdapter();
const emailVerificationRepository = new EmailVerificationRepository(prisma);
const verifyTokenInteractor = new VerifyTokenInteractor(
  emailAdapter,
  userRepository,
  emailVerificationRepository,
);

const loginInteractor = new LoginInteractor(userRepository);
const verifyUserInteractor = new VerifyUserInteractor(userRepository);
const signupInteractor = new SignupInteractor(
  userRepository,
  verifyTokenInteractor,
);
const resignInteractor = new ResignInteractor(userRepository);
const loginController = new LoginController(loginInteractor);
const logoutController = new LogoutController();
const getMeInteractor = new GetMeInteractor(userRepository);
const meController = new MeController(getMeInteractor);
const signupController = new SignupController(signupInteractor);
const resignController = new ResignController(resignInteractor);
const verifyTokenController = new VerifyTokenController(verifyTokenInteractor);

authRouter.post('/signup', signupController.execute.bind(signupController));
authRouter.post('/login', loginController.execute.bind(loginController));
authRouter.post('/logout', logoutController.execute.bind(logoutController));
authRouter.get(
  '/me',
  verifyAccessToken,
  meController.execute.bind(meController),
);
authRouter.delete(
  '/resign',
  verifyAccessToken,
  resignController.execute.bind(resignController),
);

authRouter.post(
  '/verify-email',
  verifyUserInteractor.execute.bind(verifyUserInteractor),
);

// 認証メール再送信エンドポイント
authRouter.post(
  '/resend-verification-email',
  verifyAccessToken,
  verifyTokenController.execute.bind(verifyTokenController),
);

export { authRouter, verifyUserInteractor };
