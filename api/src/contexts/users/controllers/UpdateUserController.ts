import { Request, Response } from "express";
import { UpdateUserInteractor } from "../interactors/UpdateUserInteractor";

export class UpdateUserController {
  constructor(private readonly updateUserInteractor: UpdateUserInteractor) {}

  async execute(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id, 10);
      if (isNaN(userId)) {
        return res.status(400).json({ message: "User ID must be a number" });
      }

      const { lastName, firstName, email, password, role } = req.body;

      const updateData: any = {};
      if (lastName) updateData.lastName = lastName;
      if (firstName) updateData.firstName = firstName;
      if (email) updateData.email = email;
      if (password) updateData.password = password;
      if (role) updateData.role = role;

      const updatedUser = await this.updateUserInteractor.execute({
        id: userId,
        ...updateData,
      });

      return res.status(200).json({
        success: true,
        message: "User updated successfully",
        data: updatedUser,
      });
    } catch (error: any) {
      console.error("Error updating user:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
