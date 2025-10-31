import express from "express";
import { PrismaClient } from "@prisma/client";
import { UserRepository } from "./infrastructures/repositories/UserRepository";

import { GetUsersInteractor } from "./interactors/GetUsersInteractor";
import { CreateUserInteractor } from "./interactors/CreateUserIntreractor";
import { UpdateUserInteractor } from "./interactors/UpdateUserInteractor";
import { DeleteUserInteractor } from "./interactors/DeleteUserInterector";

import { GetUsersController } from "./controllers/GetUsersController";
import { CreateUserController } from "./controllers/CreateUserController";
import { UpdateUserController } from "./controllers/UpdateUserController";
import { DeleteUserController } from "./controllers/DeleteUserController";

const UsersRouter = express.Router();

// Core dependencies
const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);


const getUsersInteractor = new GetUsersInteractor(userRepository);
const createUserInteractor = new CreateUserInteractor(userRepository);
const updateUserInteractor = new UpdateUserInteractor(userRepository);
const deleteUserInteractor = new DeleteUserInteractor(userRepository);

// Controllers
const getUsersController = new GetUsersController(getUsersInteractor);
const createUserController = new CreateUserController(createUserInteractor);
const updateUserController = new UpdateUserController(updateUserInteractor);
const deleteUserController = new DeleteUserController(deleteUserInteractor);

// Routes
UsersRouter.get("/", getUsersController.execute.bind(getUsersController));
UsersRouter.post("/signup", createUserController.execute.bind(createUserController));
UsersRouter.put("/:id", updateUserController.execute.bind(updateUserController));
UsersRouter.delete("/:id",deleteUserController.execute.bind(deleteUserController));


export { UsersRouter };
