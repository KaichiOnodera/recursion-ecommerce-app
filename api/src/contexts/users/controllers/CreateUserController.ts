import express from "express";
import { ICreateUserInteractor } from "../usecases/ICreateUserInteractor";

export class CreateUserController {
  constructor(private readonly createUserInteractor: ICreateUserInteractor) {}

  async execute(req: express.Request, res: express.Response) {
    try {
      const { lastName, firstName, email, password } = req.body;

      //validation
      if (!lastName || !firstName || !email || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const role = 1; // default role

      // get token from interactor
      const token = await this.createUserInteractor.execute({
        lastName,
        firstName,
        email,
        password,
        role,
      });

      return res.status(201).json({ token });
    } catch (error: any) {
      if (error.message === "Email already registered") {
        return res.status(400).json({ message: error.message });
      }

      console.error("Error creating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
