import { LoginController } from './controllers/LoginController';
import { LogoutController } from './controllers/LogoutController';
import { MeController } from './controllers/meController';
import { LoginInteractor } from './interactors/LoginInteractor';
import { VerifyUserInteractor } from './interactors/VerifyUserInteractor';
import { GetMeInteractor } from './interactors/GetMeInteractor';
import { UserRepository } from './infrastructures/repositories/UserRepository';
import { prisma } from '../../libs/prisma';
import express from 'express';
import { verifyAccessToken } from '../../middlewares';

const authRouter = express.Router();

const userRepository = new UserRepository(prisma);
const loginInteractor = new LoginInteractor(userRepository);
const verifyUserInteractor = new VerifyUserInteractor(userRepository);
const loginController = new LoginController(loginInteractor);
const logoutController = new LogoutController();
const getMeInteractor = new GetMeInteractor(userRepository);
const meController = new MeController(getMeInteractor);

authRouter.post('/login', loginController.execute.bind(loginController));
authRouter.post('/logout', logoutController.execute.bind(logoutController));
authRouter.get(
  '/me',
  verifyAccessToken,
  meController.execute.bind(meController),
);

authRouter.post(
  'verify-email',
  verifyUserInteractor.execute.bind(verifyUserInteractor),
);

export { authRouter, verifyUserInteractor };
