import { SignJWT, jwtVerify } from 'jose';

export interface JWTPayload {
  userId: number;
  email: string;
  role: 'USER' | 'ADMIN';
}

const JWT_SECRET = process.env.JWT_SECRET ?? 'invalid';
const ISSUER = 'recursion-ecommerce-app';
const AUDIENCE = 'api';

// JWTトークンの生成
export const signJWT = async (payload: JWTPayload): Promise<string> => {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const alg = 'HS256';

  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg })
    .setIssuedAt()
    .setIssuer(ISSUER)
    .setAudience(AUDIENCE)
    .setExpirationTime('24h')
    .sign(secret);
};

// JWTトークンの検証
export const verifyJWT = async (token: string): Promise<JWTPayload> => {
  const secret = new TextEncoder().encode(JWT_SECRET);

  const { payload } = await jwtVerify(token, secret, {
    issuer: ISSUER,
    audience: AUDIENCE,
  });

  return {
    userId: payload.userId as number,
    email: payload.email as string,
    role: payload.role as 'USER' | 'ADMIN',
  };
};
