import { Response } from "express";
import { AuthenticatedRequest } from "src/middlewares/verifyAccesToken";
import { DeleteUserInteractor } from "../interactors/DeleteUserInteractor";

export class DeleteUserController {
  constructor(
    private readonly deleteUserInteractor: DeleteUserInteractor,
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
