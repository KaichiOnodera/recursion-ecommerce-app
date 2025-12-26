import { randomUUID } from 'crypto';

/**
 * verificationtokenを生成する
 * UUID v4形式の文字列を返す
 * @returns 生成されたverificationtoken
 */
export const generateverificationtoken = (): string => {
  return randomUUID();
};
