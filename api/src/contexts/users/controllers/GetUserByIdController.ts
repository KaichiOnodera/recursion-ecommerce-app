import express from "express";
import { AuthenticatedRequest } from "src/middlewares/verifyAccesToken";
import { verifyJWT } from "src/utils/jwt";
import { IGetUserByIdInteractor } from "../usecases/IGetUserByIdInteractor";

export class GetUserByIdController {
    constructor(private readonly getUserByIdInteractor: IGetUserByIdInteractor) {}

    async execute(req: AuthenticatedRequest, res: express.Response) {

        const authenticatedUser = await verifyJWT(req.cookies?.token || '');
        
        const User = await this.getUserByIdInteractor.execute(authenticatedUser.userId);
        
        res.status(201).json({ User });
    }catch (error: any) {
        console.error("Error fetching users:", error);
        return express.response.status(500).json({ message: "Internal server error" });
    }
}



