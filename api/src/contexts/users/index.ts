import express from "express";
import { PrismaClient } from "@prisma/client";
import { UserRepository } from "./infrastructures/repositories/UserRepository";

import { GetUserByIdInteractor } from "./interactors/GetUserByIdInteractor";
import { CreateUserInteractor } from "./interactors/CreateUserInteractor";
import { UpdateUserProfileInteractor } from "./interactors/UpdateUserProfileInteractor";
import { DeleteUserInteractor } from "./interactors/DeleteUserInteractor";

import { GetUserByIdController } from "./controllers/GetUserByIdController";
import { CreateUserController } from "./controllers/CreateUserController";
import { UpdateUserProfileController } from "./controllers/UpdateUserProfileController";
import { DeleteUserController } from "./controllers/DeleteUserController";

const UsersRouter = express.Router();

// Core dependencies
const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);


const getUsersInteractor = new GetUserByIdInteractor(userRepository);
const createUserInteractor = new CreateUserInteractor(userRepository);
const updateUserInteractor = new UpdateUserProfileInteractor(userRepository);
const deleteUserInteractor = new DeleteUserInteractor(userRepository);

// Controllers
const getUsersController = new GetUserByIdController(getUsersInteractor);
const createUserController = new CreateUserController(createUserInteractor);
const updateUserController = new UpdateUserProfileController(updateUserInteractor);
const deleteUserController = new DeleteUserController(deleteUserInteractor);

// Routes
UsersRouter.get("/", getUsersController.execute.bind(getUsersController));
UsersRouter.post("/signup", createUserController.execute.bind(createUserController));
UsersRouter.put("/:id", updateUserController.execute.bind(updateUserController));
UsersRouter.delete("/:id",deleteUserController.execute.bind(deleteUserController));


export { UsersRouter };