import express from 'express';
import { AuthenticatedRequest } from 'src/middlewares';
import { IUpdateUserProfileInteractor } from '../usecases/IUpdateUserProfileInteractor';
import { UpdateUserProfileInput } from '../interactors/UpdateUserProfileInteractor';
import { PatchReq, PatchRes } from '@shared/types/patches';

export class UpdateUserProfileController {
  constructor(
    private readonly updateUserProfileInteractor: IUpdateUserProfileInteractor,
  ) {}

  async execute(
    req: AuthenticatedRequest<PatchReq['/users/profile']>,
    res: express.Response<PatchRes['/users/profile'] | { message: string }>,
  ) {
    try {
      const userId = Number(req.user?.userId);
      if (isNaN(userId)) {
        return res.status(400).json({ message: 'User ID must be a number' });
      }

      const { lastName, firstName, email } = req.body;

      const input: UpdateUserProfileInput = {
        id: userId,
        lastName: lastName,
        firstName: firstName,
        email: email,
      };

      const user = await this.updateUserProfileInteractor.execute(input);

      return res.status(200).json({ user });
    } catch (error: any) {
      // Error Handling
      if (error instanceof Error) {
        if (error.message === 'Mail is registered already') {
          return res.status(400).json({ message: error.message });
        }
        if (error.message === 'User not found') {
          return res.status(400).json({ message: error.message });
        }
      }

      console.error('Error updating user profile:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
