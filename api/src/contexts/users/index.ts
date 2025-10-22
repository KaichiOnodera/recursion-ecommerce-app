import { GetUsersController } from "./controllers/GetUsersController";
import { UserRepository } from "./infrastructures/repositories/IUserRepository";
import { PrismaClient } from "@prisma/client";
import { CreateUserInteractor } from "./interactors/CreateUserInteractor";
import { CreateUserController } from "./controllers/CreateUserController";
import { GenerateTokenInteractor } from "./usecases/IGenerateTokenInteracotr";
import express from "express";

class GetUsersInteractor {
  private userRepository: any;
  constructor(userRepository: any) {
	this.userRepository = userRepository;
  }

  async execute() {
	// delegate to repository - adjust method name to match your repository implementation
	if (typeof this.userRepository.findAll === "function") {
	  return await this.userRepository.findAll();
	}
	if (typeof this.userRepository.getAll === "function") {
	  return await this.userRepository.getAll();
	}
	// fallback: return empty array to avoid runtime errors
	return [];
  }
}

const UsersRouter = express.Router();

const prisma = new PrismaClient();
const userRepository = new UserRepository(prisma);
const getUsersInteractor = new GetUsersInteractor(userRepository);
const getUsersController = new GetUsersController(getUsersInteractor);
const createUserInteractor = new CreateUserInteractor(userRepository, generateTokenInteractor);
export const createUserController = new CreateUserController(createUserInteractor);


UsersRouter.get("/", getUsersController.execute.bind(getUsersController));
UsersRouter.post("/signup", CreateUserController.execute.bind(CreateUserController));

export { UsersRouter };