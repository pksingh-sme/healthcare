import crypto from 'crypto';

const ENCRYPTION_KEY = process.env.ENCRYPTION_KEY || 'a1b2c3d4e5f67890123456789012345678901234567890123456789012345678';
const IV_LENGTH = 16;

export function encrypt(text: string): string {
  if (!text || typeof text !== 'string') return '';
  
  try {
    const iv = crypto.randomBytes(IV_LENGTH);
    const cipher = crypto.createCipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex').slice(0, 32), iv);
    let encrypted = cipher.update(text, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return iv.toString('hex') + ':' + encrypted;
  } catch (error) {
    console.error('Encryption error:', error);
    throw new Error('Failed to encrypt data');
  }
}

export function decrypt(text: string): string {
  if (!text || typeof text !== 'string') return '';
  
  try {
    // Check if the text has the expected format (contains ':')
    if (!text.includes(':')) {
      // If it doesn't have the expected format, it might be plain text or corrupted
      // In this case, we'll return it as is to prevent errors
      console.warn('Decryption warning: Text does not have expected encrypted format, returning as is');
      return text;
    }
    
    const textParts = text.split(':');
    if (textParts.length !== 2) {
      throw new Error('Invalid encrypted text format');
    }
    
    const iv = Buffer.from(textParts[0], 'hex');
    const encryptedText = textParts[1];
    
    // Validate that the IV is the correct length
    if (iv.length !== IV_LENGTH) {
      throw new Error('Invalid IV length');
    }
    
    const decipher = crypto.createDecipheriv('aes-256-cbc', Buffer.from(ENCRYPTION_KEY, 'hex').slice(0, 32), iv);
    let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch (error) {
    console.error('Decryption error:', error);
    // Instead of throwing an error, we'll return the original text
    // This prevents the entire API from failing if some records have issues
    return text;
  }
}

// Utility functions for specific PHI fields
export function encryptPHI(text: string): string {
  return text && typeof text === 'string' ? encrypt(text) : '';
}

export function decryptPHI(text: string): string {
  return text && typeof text === 'string' ? decrypt(text) : '';
}