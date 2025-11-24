import { SignJWT, jwtVerify } from 'jose';

export interface JWTPayload {
  userId: number;
  email: string;
  role: 'USER' | 'ADMIN';
  version: string;
}

export const TOKEN_VERSION = '1.0';
const JWT_SECRET = process.env.JWT_SECRET ?? 'invalid';
const ISSUER = 'recursion-ecommerce-app';
const AUDIENCE = 'api';

// JWTトークンの生成
export const generateJWT = async (payload: JWTPayload): Promise<string> => {
  const secret = new TextEncoder().encode(JWT_SECRET);
  const alg = 'HS256';

  return await new SignJWT({ ...payload, version: TOKEN_VERSION })
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

  if (
    typeof payload.userId !== 'number' ||
    typeof payload.email !== 'string' ||
    (payload.role !== 'USER' && payload.role !== 'ADMIN') ||
    typeof payload.version !== 'string'
  ) {
    throw new Error('Invalid token payload');
  }

  return {
    userId: payload.userId,
    email: payload.email,
    role: payload.role,
    version: payload.version,
  };
};
