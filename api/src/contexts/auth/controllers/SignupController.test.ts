import request from 'supertest';
import { createTestApp } from '../../../tests/helpers/app';
import { createRouter } from '../../../tests/helpers/router';
import { SignupController } from './SignupController';
import { SignupInteractor } from '../interactors/SignupInteractor';
import { UserRepository } from '../infrastructures/repositories/UserRepository';
import { prismaTest } from '../../../libs/prisma-test';
import { cleanDatabase } from '../../../tests/helpers/database';

describe('SignupController', () => {
  let app: ReturnType<typeof createTestApp>;

  beforeEach(async () => {
    await cleanDatabase();

    const userRepository = new UserRepository(prismaTest);
    const signupInteractor = new SignupInteractor(userRepository);
    const signupController = new SignupController(signupInteractor);
    const router = createRouter('POST', '/signup', signupController);

    app = createTestApp([{ path: '/auth', router }]);
  });

  describe('POST /auth/signup', () => {
    it('should create a user successfully', async () => {
      const email = 'test-success@example.com';
      const response = await request(app)
        .post('/auth/signup')
        .send({
          lastName: '山田',
          firstName: '太郎',
          email,
          password: 'password123',
        })
        .expect(201);

      expect(response.body).toHaveProperty('createdUser');
      expect(response.body.createdUser).toHaveProperty('id');
      expect(response.body.createdUser).toHaveProperty('lastName', '山田');
      expect(response.body.createdUser).toHaveProperty('firstName', '太郎');
      expect(response.body.createdUser).toHaveProperty('email', email);
      expect(response.body.createdUser).toHaveProperty('password');
      expect(response.body.createdUser).toHaveProperty('role', 'USER');
      expect(response.body.createdUser).toHaveProperty('isResigned', false);

      // データベースに保存されていることを確認
      const createdUser = await prismaTest.users.findUnique({
        where: { email },
      });
      expect(createdUser).not.toBeNull();
      expect(createdUser?.lastName).toBe('山田');
      expect(createdUser?.firstName).toBe('太郎');
    });

    it('should return 400 when lastName is missing', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          firstName: '太郎',
          email: 'test-lastname@example.com',
          password: 'password123',
        })
        .expect(400);

      expect(response.body).toHaveProperty(
        'message',
        'Missing required fields',
      );
    });

    it('should return 400 when firstName is missing', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          lastName: '山田',
          email: 'test-firstname@example.com',
          password: 'password123',
        })
        .expect(400);

      expect(response.body).toHaveProperty(
        'message',
        'Missing required fields',
      );
    });

    it('should return 400 when email is missing', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          lastName: '山田',
          firstName: '太郎',
          password: 'password123',
        })
        .expect(400);

      expect(response.body).toHaveProperty(
        'message',
        'Missing required fields',
      );
    });

    it('should return 400 when password is missing', async () => {
      const response = await request(app)
        .post('/auth/signup')
        .send({
          lastName: '山田',
          firstName: '太郎',
          email: 'test-password@example.com',
        })
        .expect(400);

      expect(response.body).toHaveProperty(
        'message',
        'Missing required fields',
      );
    });

    it('should return 400 when email already exists', async () => {
      // 既存のユーザーを作成
      await prismaTest.users.create({
        data: {
          lastName: '既存',
          firstName: 'ユーザー',
          email: 'existing@example.com',
          password: 'hashedpassword',
          role: 'USER',
          isResigned: false,
        },
      });

      const response = await request(app)
        .post('/auth/signup')
        .send({
          lastName: '新規',
          firstName: 'ユーザー',
          email: 'existing@example.com',
          password: 'password123',
        })
        .expect(400);

      expect(response.body).toHaveProperty('message', 'Email already exists');
    });

    it('should hash password before saving', async () => {
      const email = 'test-hash@example.com';
      await request(app)
        .post('/auth/signup')
        .send({
          lastName: '山田',
          firstName: '太郎',
          email,
          password: 'password123',
        })
        .expect(201);

      const createdUser = await prismaTest.users.findUnique({
        where: { email },
      });

      expect(createdUser).not.toBeNull();
      expect(createdUser?.password).not.toBe('password123');
      expect(createdUser?.password).toHaveLength(60); // bcrypt hash length
    });
  });
});
