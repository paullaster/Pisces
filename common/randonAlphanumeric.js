import crypto from 'crypto'; // ESM import for the native crypto module

export function generateSecureRandomAlphanumeric(length) {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charsLength = chars.length;
    let result = '';

    const randomBytes = crypto.randomBytes(length);

    for (let i = 0; i < length; i++) {
        result += chars[randomBytes[i] % charsLength];
    }

    return result;
}

console.log(generateSecureRandomAlphanumeric(100))