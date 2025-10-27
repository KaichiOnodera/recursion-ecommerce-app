import { UserLoginController } from './controllers/UserLoginController';
import { AdminLoginController } from './controllers/AdminLoginController';
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

authRouter.post(
  '/user/login',
  userLoginController.execute.bind(userLoginController),
);
authRouter.post(
  '/admin/login',
  adminLoginController.execute.bind(adminLoginController),
);

export { authRouter };
