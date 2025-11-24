import express from 'express';
import { AuthenticatedRequest } from 'src/middlewares/verifyAccesToken';
import { UpdateUserProfileInteractor } from '../interactors/UpdateUserProfileInteractor';

export class UpdateUserProfileController {
  constructor(
    private readonly updateUserProfileInteractor: UpdateUserProfileInteractor,
  ) {}

  async execute(req: AuthenticatedRequest, res: express.Response) {
    try {
      const authenticatedUser = req.user;
      if (!authenticatedUser) {
        return res.status(401).json({ message: 'Authentication required' });
      }
      const userId = parseInt(req.params.id, 10);

      const { lastName, firstName, email, password } = req.body;

      const updateData: any = {};
      if (lastName) updateData.lastName = lastName;
      if (firstName) updateData.firstName = firstName;
      if (password) updateData.password = password;
      if (email) updateData.email = email;

      const updatedUserProfile = await this.updateUserProfileInteractor.execute(
        {
          id: userId,
          ...updateData,
        },
      );

      return res.status(200).json({
        success: true,
        data: updatedUserProfile,
      });
    } catch (error: any) {
      console.error('Error updating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
