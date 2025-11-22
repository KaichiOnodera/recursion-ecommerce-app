import { Response } from "express";
import { AuthenticatedRequest } from "src/middlewares/verifyAccesToken";
import { DeleteUserInteractor } from "../interactors/DeleteUserInteractor";
import { GetUserByIdInteractor } from "../interactors/GetUserByIdInteractor";

export class DeleteUserController {
  constructor(
    private readonly deleteUserInteractor: DeleteUserInteractor,
    private readonly getUserByIdInteractor: GetUserByIdInteractor
  ) {}

  async execute(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "User ID must be a number" });
      }

      const authenticatedUser = req.user;
      if (!authenticatedUser) {
        return res.status(401).json({ message: "Authentication required" });
      }

      const authenticatedUserId = authenticatedUser.userId;

      const user = await this.getUserByIdInteractor.execute(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }


      if (authenticatedUserId !== userId ) {
        return res.status(403).json({ message: "Not allowed to delete account except own account" });
      }

      await this.deleteUserInteractor.execute(userId);

      return res.status(200).json({
        success: true,
      });

    } catch (error) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
