import { Request, Response } from 'express';
import { IEmailVerifyInteractor } from '../usecases/IEmailVerifyInteractor';

export class EmailVerifyController {
  constructor(private readonly emailVerifyInteractor: IEmailVerifyInteractor) {}

  async execute(req: Request, res: Response) {
    const { token } = req.query;

    if (!token || typeof token !== 'string') {
      return res.status(400).json({ message: 'Invalid token' });
    }

    await this.emailVerifyInteractor.verifyEmail(token);
    return res.status(200).json({ message: 'Email verified successfully' });
  }
}
