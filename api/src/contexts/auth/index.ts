import { LoginController } from './controllers/LoginController';
import { LogoutController } from './controllers/LogoutController';
import { MeController } from './controllers/MeController';
import { SignupController } from './controllers/SignupController';
import { LoginInteractor } from './interactors/LoginInteractor';
import { VerifyUserInteractor } from './interactors/VerifyUserInteractor';
import { GetMeInteractor } from './interactors/GetMeInteractor';
import { SignupInteractor } from './interactors/SignupInteractor';
import { UserRepository } from './infrastructures/repositories/UserRepository';
import { prisma } from '../../libs/prisma';
import express from 'express';
import { verifyAccessToken } from '../../middlewares';

const authRouter = express.Router();

const userRepository = new UserRepository(prisma);
const loginInteractor = new LoginInteractor(userRepository);
const verifyUserInteractor = new VerifyUserInteractor(userRepository);
const signupInteractor = new SignupInteractor(userRepository);
const loginController = new LoginController(loginInteractor);
const logoutController = new LogoutController();
const getMeInteractor = new GetMeInteractor(userRepository);
const meController = new MeController(getMeInteractor);
const signupController = new SignupController(signupInteractor);

authRouter.post('/signup', signupController.execute.bind(signupController));
authRouter.post('/login', loginController.execute.bind(loginController));
authRouter.post('/logout', logoutController.execute.bind(logoutController));
authRouter.get(
  '/me',
  verifyAccessToken,
  meController.execute.bind(meController),
);

export { authRouter, verifyUserInteractor };
