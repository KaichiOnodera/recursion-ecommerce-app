import { randomUUID } from 'crypto';

export const generateDownloadToken = (): string => {
  return randomUUID();
};
