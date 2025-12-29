import request from 'supertest';
import { createTestApp } from '../../../tests/helpers/app';
import { createRouter } from '../../../tests/helpers/router';
import { DeleteUserController } from './DeleteUserController';
import { DeleteUserInteractor } from '../interactors/DeleteUserInteractor';
import { UserRepository } from '../infrastructures/repositories/UserRepository';
import { VerifyUserInteractor } from '../../auth/interactors/VerifyUserInteractor';
import { createVerifyAccessToken } from '../../../middlewares/verifyAccessToken';
import { prismaTest } from '../../../libs/prisma-test';
import { cleanDatabase } from '../../../tests/helpers/database';
import { generateJWT } from '../../../utils/jwt';

describe('DeleteUserController', () => {
  let app: ReturnType<typeof createTestApp>;
  let verifyAccessToken: ReturnType<typeof createVerifyAccessToken>;

  beforeEach(async () => {
    await cleanDatabase();

    const userRepository = new UserRepository(prismaTest);
    const verifyUserInteractor = new VerifyUserInteractor(userRepository);
    verifyAccessToken = createVerifyAccessToken(verifyUserInteractor);

    const deleteUserInteractor = new DeleteUserInteractor(userRepository);
    const deleteUserController = new DeleteUserController(deleteUserInteractor);
    const router = createRouter('DELETE', '/:id', deleteUserController, [
      verifyAccessToken,
    ]);

    app = createTestApp([{ path: '/users', router }]);
  });

  describe('DELETE /users/:id', () => {
    it('should delete a user successfully', async () => {
      // テスト用ユーザーを作成
      const testUser = await prismaTest.users.create({
        data: {
          lastName: '削除',
          firstName: 'テスト',
          email: 'delete@example.com',
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
        .delete(`/users/${testUser.id}`)
        .set('Cookie', `token=${token}`)
        .expect(200);

      expect(response.body).toEqual({ success: true });

      // ユーザーが削除（isResigned=true）されていることを確認
      const deletedUser = await prismaTest.users.findUnique({
        where: { id: testUser.id },
      });
      expect(deletedUser).not.toBeNull();
      expect(deletedUser?.isResigned).toBe(true);
    });
  });
});
