import { randomUUID } from 'crypto';

/**
 * sessionIdを生成する
 * UUID v4形式の文字列を返す
 * @returns 生成されたsessionId
 */
export const generateSessionId = (): string => {
  return randomUUID();
};
