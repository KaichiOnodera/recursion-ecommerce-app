import express from 'express';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from './infrastructures/repositories/UserRepository';
import { verifyAccessToken, verifyAdmin } from '../../middlewares';
import { adminItemsRouter } from '../items/admin';

adminItemsRouter.use(verifyAccessToken);
adminItemsRouter.use(verifyAdmin);

import { UpdateUserProfileInteractor } from './interactors/UpdateUserProfileInteractor';

import { UpdateUserProfileController } from './controllers/UpdateUserProfileController';

const UsersRouter = express.Router();

// Core dependencies
const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);

const updateUserInteractor = new UpdateUserProfileInteractor(userRepository);

// Controllers

const updateUserProfileController = new UpdateUserProfileController(
  updateUserInteractor,
);

// Routes
UsersRouter.put('/profile', verifyAccessToken, (req, res) => {
  updateUserProfileController.execute(req, res);
});

export { UsersRouter };
