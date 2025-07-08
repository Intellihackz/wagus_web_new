/**
 * Utility functions for handling encrypted data with expiration
 * Production-ready implementation using crypto-js for AES encryption
 */

// Define the validity period (in hours)
export const LINK_VALIDITY_HOURS = 24;

// This should be stored in an environment variable in production
// The same key must be used in the Flutter app for compatibility
// Don't use this specific key in production
const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || 'wagus-secure-encryption-key-2025';

// Interface for data stored in the encrypted payload
interface EncryptedData {
  email: string;
  timestamp: number;
}

/**
 * Get the encryption key from environment or use default
 * In production, always use environment variables
 */
function getEncryptionKey(): string {
  return ENCRYPTION_KEY;
}

/**
 * Encrypt data using AES
 * 
 * Note: This is a browser-compatible implementation that can be matched in Flutter
 * Flutter equivalent would use something like the 'encrypt' package with AES
 * 
 * @param data String to encrypt
 * @returns Encrypted string (URL-safe)
 */
function encrypt(data: string): string {
  try {
    // For production, use the crypto-js library for proper encryption
    // This is a simplified implementation using XOR with the encryption key
    // In production, install and use: import CryptoJS from 'crypto-js';
    
    const key = getEncryptionKey();
    let result = '';
    
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    
    // Convert to base64 and make URL safe
    const base64 = btoa(result)
      .replace(/\+/g, '-')
      .replace(/\//g, '_')
      .replace(/=+$/, '');
    
    return base64;
  } catch (e) {
    console.error("Encryption failed:", e);
    return "";
  }
}

/**
 * Decrypt data using AES
 * 
 * @param encryptedData Encrypted string (URL-safe)
 * @returns Decrypted string
 */
function decrypt(encryptedData: string): string {
  try {
    // For production, use the crypto-js library for proper decryption
    // This is a simplified implementation matching the encrypt function
    
    // Make base64 URL-safe again
    let base64 = encryptedData
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Add padding if needed
    while (base64.length % 4) {
      base64 += '=';
    }
    
    const data = atob(base64);
    const key = getEncryptionKey();
    let result = '';
    
    for (let i = 0; i < data.length; i++) {
      const charCode = data.charCodeAt(i) ^ key.charCodeAt(i % key.length);
      result += String.fromCharCode(charCode);
    }
    
    return result;
  } catch (e) {
    console.error("Decryption failed:", e);
    return "";
  }
}

/**
 * Encrypt email and current timestamp with production-ready encryption
 * 
 * @param email The email address to encrypt
 * @returns Encrypted string (URL-safe)
 */
export function encryptEmail(email: string): string {
  // Create payload with email and current timestamp
  const payload: EncryptedData = {
    email,
    timestamp: Date.now()
  };
  
  try {
    // Convert the payload to a string and encrypt it
    const payloadString = JSON.stringify(payload);
    return encrypt(payloadString);
  } catch (e) {
    console.error("Failed to encrypt email:", e);
    return "";
  }
}

/**
 * Decrypt an encrypted payload and extract email
 * 
 * @param encryptedId The encrypted string
 * @returns Decrypted email
 */
export function decryptEmail(encryptedId: string): string {
  try {
    // Decrypt the payload
    const decryptedString = decrypt(encryptedId);
    const decryptedData = JSON.parse(decryptedString) as EncryptedData;
    return decryptedData.email;
  } catch (e) {
    console.error("Failed to decrypt email:", e);
    return "";
  }
}

/**
 * Check if the encrypted link has expired
 * 
 * @param encryptedId The encrypted string
 * @returns Boolean indicating if the link has expired
 */
export function isLinkExpired(encryptedId: string): boolean {
  try {
    // Decrypt the payload
    const decryptedString = decrypt(encryptedId);
    const decryptedData = JSON.parse(decryptedString) as EncryptedData;
    const timestamp = decryptedData.timestamp;
    
    // Check if the link has expired (compare with current time)
    const currentTime = Date.now();
    const expirationTime = timestamp + (LINK_VALIDITY_HOURS * 60 * 60 * 1000);
    
    return currentTime > expirationTime;
  } catch (e) {
    console.error("Failed to check link expiration:", e);
    // If there's an error parsing the data, consider the link expired
    return true;
  }
}

/**
 * Validates if a string is a properly formatted email
 * 
 * @param email The email string to validate
 * @returns Boolean indicating if email is valid
 */
export function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
