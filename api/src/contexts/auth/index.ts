import { LoginController } from './controllers/LoginController';
import { LogoutController } from './controllers/LogoutController';
import { LoginInteractor } from './interactors/LoginInteractor';
import { UserRepository } from './infrastructures/repositories/UserRepository';
import { PrismaClient } from '@prisma/client';
import express from 'express';

const authRouter = express.Router();

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const loginInteractor = new LoginInteractor(userRepository);
const loginController = new LoginController(loginInteractor);
const logoutController = new LogoutController();

authRouter.post('/login', loginController.execute.bind(loginController));
authRouter.post('/logout', logoutController.execute.bind(logoutController));

export { authRouter };
