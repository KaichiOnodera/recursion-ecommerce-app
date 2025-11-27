import express from 'express';
import { AuthenticatedRequest } from 'src/middlewares';
import { IUpdateUserProfileInteractor } from '../usecases/IUpdateUserProfileInteractor';
import { UpdateUserProfileInput } from '../interactors/UpdateUserProfileInteractor';

export class UpdateUserProfileController {
  constructor(
    private readonly updateUserProfileInteractor: IUpdateUserProfileInteractor,
  ) {}

  async execute(req: AuthenticatedRequest, res: express.Response) {
    try {
      const userId = Number(req.user?.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'User ID must be a number' });
      }

      const { lastName, firstName, email } = req.body;

      const input: UpdateUserProfileInput = {
        id: userId,
        lastName,
        firstName,
        email,
      };

      const updatedUser = await this.updateUserProfileInteractor.execute(input);

      return res.status(200).json({ updatedUser });
    } catch (error: any) {
      console.error('Error updating user profile:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
