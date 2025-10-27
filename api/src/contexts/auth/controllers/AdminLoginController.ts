import express from 'express';
import { ILoginInteractor } from '../usecases/ILoginInteractor';

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  user: {
    id: number;
    email: string;
    role: string;
  };
}

interface ErrorResponse {
  message: string;
}

export class AdminLoginController {
  constructor(private readonly loginInteractor: ILoginInteractor) {}

  async execute(
    req: express.Request<null, LoginResponse, LoginRequest>,
    res: express.Response<LoginResponse | ErrorResponse>,
  ) {
    try {
      const { email, password } = req.body;

      if (!email || !password) {
        return res
          .status(400)
          .json({ message: 'メールとパスワードが必要です' });
      }

      // ADMINロールのみ受け付ける
      const result = await this.loginInteractor.execute(
        email,
        password,
        'ADMIN',
      );

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
