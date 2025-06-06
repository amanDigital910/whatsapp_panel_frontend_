import CryptoJS from 'crypto-js';

// Generate a secure random 40-character alphanumeric key
const generateSecretKey = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()_+[]{}|;:,.<>?';
    let key = '';
    for (let i = 0; i < 100; i++) {
        key += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return key;
};

// Get secret key from localStorage or generate a new one
const getSecretKey = () => {
    let key = localStorage.getItem('secure_encryption_key');
    if (!key) {
        key = generateSecretKey();
        localStorage.setItem('secure_encryption_key', key);
    }
    return key;
};

// Encrypt data using AES and the dynamic secret key
export const encryptData = (data) => {
    try {
        const secretKey = getSecretKey();
        return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
    } catch (error) {
        console.error('Encryption failed:', error);
        return null;
    }
};

// Decrypt data using AES and the dynamic secret key
export const decryptData = (cipherText) => {
    try {
        if (!cipherText) {
            console.error('No cipher text provided');
            return null;
        }
        const secretKey = getSecretKey();
        const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted) || null;
    } catch (error) {
        console.error('Decryption failed:', error);
        return null;
    }
};

// Store encrypted data in localStorage
export const setSecureItem = (key, data) => {
    const encrypted = encryptData(data);
    if (encrypted) {
        localStorage.setItem(key, encrypted);
    }
};

// Retrieve decrypted data from localStorage
export const getSecureItem = (key) => {
    const encrypted = localStorage.getItem(key);
    return decryptData(encrypted);
};

// Remove a specific secure item
export const removeSecureItem = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing item from storage:', error);
    }
};

// Clear all secure data (optional: do NOT clear the secret key unless you want to reset everything)
export const clearSecureStorage = () => {
    try {
        localStorage.clear();
        localStorage.removeItem('secure_encryption_key');
    } catch (error) {
        console.error('Error clearing secure storage:', error);
    }
};
