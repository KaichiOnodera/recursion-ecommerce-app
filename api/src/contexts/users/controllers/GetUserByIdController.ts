import express from "express";
import { AuthenticatedRequest } from "src/middlewares/verifyAccesToken";
import { IGetUserByIdInteractor } from "../usecases/IGetUserByIdInteractor";

export class GetUserByIdController {
    constructor(private readonly getUserByIdInteractor: IGetUserByIdInteractor) {}

    async execute(req: AuthenticatedRequest, res: express.Response) {
        try {
            const authenticatedUser = req.user;
            if (!authenticatedUser) {
                return res.status(401).json({ message: "Authentication required" });
            }

            const user = await this.getUserByIdInteractor.execute(authenticatedUser.userId);

            if (!user) {
                return res.status(404).json({ message: "User not found" });
            }

            res.status(200).json({ user });
        } catch (error: any) {
            console.error("Error fetching user:", error);
            return res.status(500).json({ message: "Internal server error" });
        }
    }
}