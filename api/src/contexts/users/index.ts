import express from 'express';
import { UserRepository } from './infrastructures/repositories/UserRepository';
import { verifyAccessToken } from '../../middlewares';
import { UpdateUserProfileInteractor } from './interactors/UpdateUserProfileInteractor';
import { UpdateUserProfileController } from './controllers/UpdateUserProfileController';
import { prisma } from '../../libs/prisma';

const UsersRouter = express.Router();

// Core dependencies
const userRepository = new UserRepository(prisma);

const updateUserInteractor = new UpdateUserProfileInteractor(userRepository);

// Controllers

const updateUserProfileController = new UpdateUserProfileController(
  updateUserInteractor,
);

// Routes
UsersRouter.put(
  '/profile',
  verifyAccessToken,
  updateUserProfileController.execute.bind(updateUserProfileController),
);

export { UsersRouter };
