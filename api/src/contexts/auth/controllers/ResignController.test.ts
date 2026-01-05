import request from 'supertest';
import { createTestApp } from '../../../tests/helpers/app';
import { createRouter } from '../../../tests/helpers/router';
import { ResignController } from './ResignController';
import { ResignInteractor } from '../interactors/ResignInteractor';
import { UserRepository } from '../infrastructures/repositories/UserRepository';
import { VerifyUserInteractor } from '../interactors/VerifyUserInteractor';
import { createVerifyAccessToken } from '../../../middlewares/verifyAccessToken';
import { prismaTest } from '../../../libs/prisma-test';
import { cleanDatabase } from '../../../tests/helpers/database';
import { generateJWT } from '../../../utils/jwt';

describe('ResignController', () => {
  let app: ReturnType<typeof createTestApp>;
  let verifyAccessToken: ReturnType<typeof createVerifyAccessToken>;

  beforeEach(async () => {
    await cleanDatabase();

    const userRepository = new UserRepository(prismaTest);
    const verifyUserInteractor = new VerifyUserInteractor(userRepository);
    verifyAccessToken = createVerifyAccessToken(verifyUserInteractor);

    const resignInteractor = new ResignInteractor(userRepository);
    const resignController = new ResignController(resignInteractor);
    const router = createRouter('DELETE', '/resign', resignController, [
      verifyAccessToken,
    ]);

    app = createTestApp([{ path: '/auth', router }]);
  });

  describe('DELETE /auth/resign', () => {
    it('should resign a user successfully', async () => {
      // テスト用ユーザーを作成
      const testUser = await prismaTest.users.create({
        data: {
          lastName: '退会',
          firstName: 'テスト',
          email: 'resign@example.com',
          password: 'hashedpassword',
          role: 'USER',
          isResigned: false,
        },
      });

      // 認証用のトークンを生成
      const token = await generateJWT({
        userId: testUser.id,
        email: testUser.email,
        role: testUser.role,
        version: '1.0',
      });

      const response = await request(app)
        .delete('/auth/resign')
        .set('Cookie', `token=${token}`)
        .expect(200);

      expect(response.body).toEqual({ success: true });

      // ユーザーが退会（isResigned=true）されていることを確認
      const resignedUser = await prismaTest.users.findUnique({
        where: { id: testUser.id },
      });
      expect(resignedUser).not.toBeNull();
      expect(resignedUser?.isResigned).toBe(true);
    });
  });
});
