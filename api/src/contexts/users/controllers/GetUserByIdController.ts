import express from "express";
import { GetRes } from "@shared/types/gets";
import { IGetUsersInteractor } from "../usecases/IGetUserByIdInteractor";

export class GetUsersController {
    constructor(private readonly getUsersInteractor: IGetUsersInteractor) {}

    async execute(_req: express.Request, res: express.Response) {
        const Users = await this.getUsersInteractor.execute();
        
        const responseUsers = Users.map(user => ({
            id : user.id,
            lastName:user.lastName,
            firstName: user.firstName,
            email: user.email,
            password: user.password,
            role: user.role,
            isResigned: user.isResigned,
            createdAt: Date,
            updatedAt: Date,
        }));
        
        res.status(201).json({ Users: responseUsers });
    }
}



