import express from 'express';
import { ISignupInteractor } from '../usecases/ISignupInteractor';
import { PostRes, PostReq } from '@shared/types/posts';
import { generateJWT, TOKEN_VERSION } from '../../../utils/jwt';
import { User } from '@shared/schemas/user';

export class SignupController {
  constructor(private readonly signupInteractor: ISignupInteractor) {}

  async execute(
    req: express.Request<
      null,
      PostRes['/auth/signup'] | { message: string },
      PostReq['/auth/signup']
    >,
    res: express.Response<PostRes['/auth/signup'] | { message: string }>,
  ) {
    try {
      const { lastName, firstName, email, password } = req.body;

      if (!lastName || !firstName || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
      }

      const createdUser = await this.signupInteractor.execute({
        lastName,
        firstName,
        email,
        password,
      });

      const token = await generateJWT({
        userId: createdUser.id,
        email: createdUser.email,
        role: createdUser.role,
        version: TOKEN_VERSION,
      });

      res.cookie('token', token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        maxAge: 86400000,
        path: '/',
      });

      const user: User = {
        id: createdUser.id,
        lastName: createdUser.lastName,
        firstName: createdUser.firstName,
        email: createdUser.email,
        role: createdUser.role,
      };

      return res.status(201).json({ user });
    } catch (error: unknown) {
      if (error instanceof Error) {
        if (error.message === 'Email already exists') {
          return res.status(400).json({ message: error.message });
        }
      }

      console.error('Error creating user:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  }
}
