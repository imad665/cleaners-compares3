// lib/encryption.ts
import CryptoJS from 'crypto-js';

const SECRET_KEY = process.env.ENCRYPTION_SECRET_KEY;

if (!SECRET_KEY) {
  throw new Error('ENCRYPTION_SECRET_KEY environment variable is required');
}

// Encrypt function
export function encrypt(text: string): string {
  return CryptoJS.AES.encrypt(text, SECRET_KEY).toString();
}

// Decrypt function  
export function decrypt(encryptedText: string): string {
  try {
    const bytes = CryptoJS.AES.decrypt(encryptedText, SECRET_KEY);
    return bytes.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw new Error('Failed to decrypt value');
  }
}

// Helper function to check if a value is already encrypted
export function isEncrypted(value: string): boolean {
  // Simple check - encrypted values typically have a specific pattern
  // This might need adjustment based on your encryption output
  return value.includes('U2FsdGVkX1') || value.length > 50;
}