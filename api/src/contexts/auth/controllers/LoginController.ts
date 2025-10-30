import express from 'express';
import { ILoginInteractor } from '../usecases/ILoginInteractor';
import { PostRes } from '@shared/types/posts';

interface LoginRequest {
  email: string;
  password: string;
}

interface ErrorResponse {
  message: string;
}

export class LoginController {
  constructor(private readonly loginInteractor: ILoginInteractor) {}

  async execute(
    req: express.Request<null, PostRes['auth/login'], LoginRequest>,
    res: express.Response<PostRes['auth/login'] | ErrorResponse>,
  ) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: 'Email and password are required' });
      }

      const result = await this.loginInteractor.execute(email, password);

      res.cookie('token', result.token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 86400000,
        path: '/',
      });

      res.status(200).json({ user: result.user });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Internal server error';
      if (
        errorMessage.includes('Invalid email or password') ||
        errorMessage.includes('Invalid role')
      ) {
        return res.status(401).json({ message: errorMessage });
      }
      res.status(500).json({ message: errorMessage });
    }
  }
}
