import { Request, Response } from "express";
import { DeleteUserInteractor } from "../interactors/DeleteUserInterector";

export class DeleteUserController {
  constructor(private readonly deleteUserInteractor: DeleteUserInteractor) {}

  async execute(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "User ID must be a number" });
      }

      // Delete only needs an ID
      await this.deleteUserInteractor.execute(userId);

      return res.status(200).json({
        success: true,
        message: "User deleted successfully",
        
      });
    } catch (error: any) {
      console.error("Error deleting user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
