import { PrismaClient, UserRole } from '@prisma/client';
import { hashPassword } from '../src/contexts/utils/hashPassword';
import { config } from 'dotenv';

if (!process.env.DATABASE_URL) {
  config({ path: '.env.test' });
}

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL,
    },
  },
});

export async function seedTestData(prismaClient?: PrismaClient) {
  const client = prismaClient || prisma;

  // Users
  const hashedPassword = await hashPassword('password123');

  const testUser = await client.users.upsert({
    where: { email: 'test-user@example.com' },
    update: {
      password: hashedPassword,
      lastName: 'テスト',
      firstName: 'ユーザー',
      role: UserRole.USER,
      isResigned: false,
    },
    create: {
      email: 'test-user@example.com',
      password: hashedPassword,
      lastName: 'テスト',
      firstName: 'ユーザー',
      role: UserRole.USER,
      isResigned: false,
    },
  });

  const testAdmin = await client.users.upsert({
    where: { email: 'test-admin@example.com' },
    update: {
      password: hashedPassword,
      lastName: 'テスト',
      firstName: '管理者',
      role: UserRole.ADMIN,
      isResigned: false,
    },
    create: {
      email: 'test-admin@example.com',
      password: hashedPassword,
      lastName: 'テスト',
      firstName: '管理者',
      role: UserRole.ADMIN,
      isResigned: false,
    },
  });

  // Items 
  const itemData = [
    { name: 'リュックサック', description: '軽量で丈夫なナイロン製リュックサック。長時間のハイキングにも最適です。', price: 12000 },
    { name: 'テント', description: '2〜3人用のコンパクトなドーム型テント。簡単に設営できます。', price: 25000 },
    { name: '寝袋', description: '保温性に優れたダウン素材の寝袋。-5℃まで対応可能です。', price: 15000 },
    { name: 'アウトドアチェア', description: '折りたたみ式のコンパクトなキャンプチェア。持ち運びに便利です。', price: 3000 },
    { name: 'クーラーボックス', description: '保冷力が高い大型クーラーボックス。キャンプやバーベキューに最適です。', price: 8000 },
    { name: 'LEDランタン', description: '明るさ3段階調節可能な充電式LEDランタン。最大50時間点灯可能です。', price: 4500 },
    { name: 'ポータブルストーブ', description: '軽量コンパクトなガスストーブ。アウトドアでの調理に便利です。', price: 5000 },
    { name: 'トレッキングシューズ', description: 'グリップ力の高いトレッキングシューズ。滑りにくいソール設計です。', price: 18000 },
    { name: '防水ジャケット', description: '透湿防水素材を使用した軽量ジャケット。突然の雨にも安心です。', price: 12000 },
    { name: 'アウトドアテーブル', description: '折りたたみ式のコンパクトテーブル。設営が簡単で収納も便利です。', price: 6000 },
  ];

  const items = [];
  for (let i = 0; i < itemData.length; i++) {
    const { name, description, price } = itemData[i];
    const item = await client.items.upsert({
      where: { id: i + 1 },
      update: {
        name,
        description,
        type: 1,
        displayStatus: i % 2 === 0 ? 'public' : 'private',
        price,
      },
      create: {
        name,
        description,
        type: 1,
        displayStatus: i % 2 === 0 ? 'public' : 'private',
        price,
      },
    });
    items.push(item);
  }

  return { testUser, testAdmin, items };
}

async function main() {
  await seedTestData();
}

main()
  .catch((error) => {
    console.error('Seed failed', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
