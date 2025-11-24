import { LoginController } from './controllers/LoginController';
import { LogoutController } from './controllers/LogoutController';
import { LoginInteractor } from './interactors/LoginInteractor';
import { VerifyUserInteractor } from './interactors/VerifyUserInteractor';
import { UserRepository } from './infrastructures/repositories/UserRepository';
import { prisma } from '../../libs/prisma';
import express from 'express';

const authRouter = express.Router();

const userRepository = new UserRepository(prisma);
const loginInteractor = new LoginInteractor(userRepository);
const verifyUserInteractor = new VerifyUserInteractor(userRepository);
const loginController = new LoginController(loginInteractor);
const logoutController = new LogoutController();

authRouter.post('/login', loginController.execute.bind(loginController));
authRouter.post('/logout', logoutController.execute.bind(logoutController));

export { authRouter, verifyUserInteractor };
