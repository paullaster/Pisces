import { randomBytes } from 'crypto';
export const randomID = (bytes = 16) => randomBytes(bytes).toString('hex');