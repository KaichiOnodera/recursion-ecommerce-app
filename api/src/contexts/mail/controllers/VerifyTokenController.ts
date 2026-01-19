import { Response } from 'express';
import { AuthenticatedRequest } from 'src/middlewares';
import { IVerifyTokenInteractor } from '../usecases/IVerifyTokenInteractor';

export class VerifyTokenController {
  constructor(private verifyTokenInteractor: IVerifyTokenInteractor) {}

  async execute(req: AuthenticatedRequest, res: Response) {
    try {
      const userId = req.user?.userId;

      if (!userId) {
        return res.status(400).json({ message: 'User not authenticated' });
      }

      await this.verifyTokenInteractor.VerifyToken(userId);
      return res
        .status(200)
        .json({ message: 'Verification email sent successfully' });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error(
          '[VerifyTokenController] Failed to send verification email:',
          error,
        );
        return res.status(500).json({ message: error.message });
      }
      console.error('[VerifyTokenController] Unknown error occurred:', error);
      return res
        .status(500)
        .json({ message: 'Failed to send verification email' });
    }
  }
}
