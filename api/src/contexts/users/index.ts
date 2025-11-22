import express from "express";
import { PrismaClient } from "@prisma/client";
import { UserRepository } from "./infrastructures/repositories/UserRepository";
import { verifyAccessToken } from "src/middlewares/verifyAccesToken";

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


const getUserByIdInteractor = new GetUserByIdInteractor(userRepository);
const createUserInteractor = new CreateUserInteractor(userRepository);
const updateUserInteractor = new UpdateUserProfileInteractor(userRepository);
const deleteUserInteractor = new DeleteUserInteractor(userRepository);

// Controllers
const getUserByIdController = new GetUserByIdController(getUserByIdInteractor);
const createUserController = new CreateUserController(createUserInteractor);
const updateUserProfileController = new UpdateUserProfileController(updateUserInteractor);
const deleteUserController = new DeleteUserController(deleteUserInteractor);

// Routes
UsersRouter.get("/",
    verifyAccessToken,(req, res) => {
        getUserByIdController.execute(req, res);
    }
);
UsersRouter.post("/signup", createUserController.execute.bind(createUserController));
UsersRouter.put("/users/:id",
    verifyAccessToken, (req, res) => {
        updateUserProfileController.execute(req, res);
    }
);
UsersRouter.delete("/:id",
    verifyAccessToken,(req,res) => {
        deleteUserController.execute.bind(deleteUserController)
    }
);


export { UsersRouter };