import { Request, Response } from "express";
import { UpdateUserProfileInteractor } from "../interactors/UpdateUserProfileInteractor";

export class UpdateUserProfileController {
  constructor(private readonly updateUserProfileInteractor: UpdateUserProfileInteractor) {}

  async execute(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "User ID must be a number" });
      }

      const { lastName, firstName, email, password } = req.body;

      const updateData: any = {};
      if (lastName) updateData.lastName = lastName;
      if (firstName) updateData.firstName = firstName;
      if (password) updateData.password = password;

      const updatedUserProfile = await this.updateUserProfileInteractor.execute({
        id: userId,
        ...updateData,

      });

      return res.status(200).json({
        success: true,
        data: updatedUserProfile,
      });
    } catch (error: any) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
