import { Response } from 'express';
import { AuthenticatedRequest } from 'src/middlewares';
import { IVerifyTokenInteractor } from '../usecases/IVerifyTokenInteractor';

export class VerifyTokenController {
  constructor(private verifyTokenInteractor: IVerifyTokenInteractor) {}

  async execute(req: AuthenticatedRequest, res: Response) {
    const userId = req.user?.userId;

    if (!userId) {
      return res.status(400).json({ message: 'User not authenticated' });
    }

    await this.verifyTokenInteractor.VerifyToken(userId);
    return res
      .status(200)
      .json({ message: 'Verification email sent successfully' });
  }
}
