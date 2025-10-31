import express from "express";
import { ICreateUserInteractor } from "../usecases/ICreateUserInteractor";


//Receive HTTP request
//It handles recieve -> execute interactor -> response
export class CreateUserController {
    //reset Business Logic Layer
    constructor(private readonly createUserInteractor: ICreateUserInteractor) {}

    //Execute HTTP request and Check data itself
    async execute(req: express.Request, res: express.Response) {
        try {
        //get request body
        const { lastName, firstName, email, password, isResigned, role  } = req.body;

        //validation
        if (!lastName || !firstName || !email || !password) {
            return res.status(400).json({ message: "Missing required fields" });
        }


        // get token from interactor(Business Logic Layer)
        const token = await this.createUserInteractor.execute({
            lastName,
            firstName,
            email,
            password,
            isResigned,
            role,
        });

        // Return token as response
        return res.status(201).json({ token });
        } catch (error: any) {
        // Error Handling
        if (error.message === "Email already registered") {
            return res.status(400).json({ message: error.message });
        }
        
        // Error messages for smth wrong in creating user
        console.error("Error creating user:", error);
        return res.status(500).json({ message: "Internal server error" });
        }
    }
}
