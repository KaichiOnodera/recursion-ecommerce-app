import { UserLoginController } from './controllers/UserLoginController';
import { AdminLoginController } from './controllers/AdminLoginController';
import { LogoutController } from './controllers/LogoutController';
import { LoginInteractor } from './interactors/LoginInteractor';
import { UserRepository } from './infrastructures/repositories/UserRepository';
import { PrismaClient } from '@prisma/client';
import express from 'express';

const authRouter = express.Router();

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const loginInteractor = new LoginInteractor(userRepository);
const userLoginController = new UserLoginController(loginInteractor);
const adminLoginController = new AdminLoginController(loginInteractor);
const logoutController = new LogoutController();

authRouter.post(
  '/user/login',
  userLoginController.execute.bind(userLoginController),
);
authRouter.post(
  '/admin/login',
  adminLoginController.execute.bind(adminLoginController),
);
authRouter.post('/logout', logoutController.execute.bind(logoutController));

export { authRouter };
