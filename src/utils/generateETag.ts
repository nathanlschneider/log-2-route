import crypto from 'crypto';

export function generateETag(data: string): string {
  return crypto.createHash('md5').update(data, 'utf8').digest('hex');
}