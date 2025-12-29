import express from 'express';
import { PrismaClient } from '@prisma/client';
import { UserRepository } from './infrastructures/repositories/UserRepository';
import { verifyAccessToken, verifyAdmin } from '../../middlewares';
import { adminItemsRouter } from '../items/admin';

adminItemsRouter.use(verifyAccessToken);
adminItemsRouter.use(verifyAdmin);

import { UpdateUserProfileInteractor } from './interactors/UpdateUserProfileInteractor';
import { DeleteUserInteractor } from './interactors/DeleteUserInteractor';

import { UpdateUserProfileController } from './controllers/UpdateUserProfileController';
import { DeleteUserController } from './controllers/DeleteUserController';

const UsersRouter = express.Router();

// Core dependencies
const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);

const updateUserInteractor = new UpdateUserProfileInteractor(userRepository);
const deleteUserInteractor = new DeleteUserInteractor(userRepository);

// Controllers

const updateUserProfileController = new UpdateUserProfileController(
  updateUserInteractor,
);
const deleteUserController = new DeleteUserController(deleteUserInteractor);

// Routes
UsersRouter.put('/profile', verifyAccessToken, (req, res) => {
  updateUserProfileController.execute(req, res);
});
UsersRouter.delete(
  '/:id',
  verifyAccessToken,
  deleteUserController.execute.bind(deleteUserController),
);

export { UsersRouter };
