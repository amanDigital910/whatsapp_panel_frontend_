import CryptoJS from 'crypto-js';

const secretKey = 'U2FsdGVkX1/WXguSSdHZic87Lew2S2kf3XojHWrj1vg=';

export const setSecureItem = (key, data) => {
    try {
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
        localStorage.setItem(key, encrypted);
    } catch (error) {
        console.error('Error encrypting and storing data:', error);
    }
};

export const getSecureItem = (key) => {
    try {
        const encrypted = localStorage.getItem(key);
        if (!encrypted) return null;
        const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted) || null;
    } catch (error) {
        console.error('Error retrieving and decrypting data:', error);
        return null;
    }
};

export const removeSecureItem = (key) => {
    try {
        localStorage.removeItem(key);
    } catch (error) {
        console.error('Error removing item from localStorage:', error);
    }
};

export const clearSecureStorage = () => {
    try {
        localStorage.clear();
    } catch (error) {
        console.error('Error clearing localStorage:', error);
    }
};