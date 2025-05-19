import CryptoJS from 'crypto-js';

const secretKey = 'U2FsdGVkX1/WXguSSdHZic87Lew2S2kf3XojHWrj1vg=';

const setCookie = (key, value, minutes) => {
    const expires = new Date(Date.now() + minutes * 60 * 1000).toUTCString();
    document.cookie = `${encodeURIComponent(key)}=${encodeURIComponent(value)}; expires=${expires}; path=/; Secure; SameSite=Strict`;
};

const getCookie = (key) => {
    const cookies = document.cookie ? document.cookie.split('; ') : [];
    for (const cookie of cookies) {
        const [cookieKey, cookieVal] = cookie.split('=');
        if (decodeURIComponent(cookieKey) === key) {
            return decodeURIComponent(cookieVal);
        }
    }
    return null;
};

const deleteCookie = (key) => {
    document.cookie = `${encodeURIComponent(key)}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/; Secure; SameSite=Strict`;
};

export const setSecureItem = (key, data, expiryMinutes = 10) => {
    try {
        const encrypted = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
        setCookie(key, encrypted, expiryMinutes);
    } catch (error) {
        console.error('Error encrypting and storing data in cookie:', error);
    }
};

export const getSecureItem = (key) => {
    try {
        const encrypted = getCookie(key);
        if (!encrypted) return null;
        const bytes = CryptoJS.AES.decrypt(encrypted, secretKey);
        const decrypted = bytes.toString(CryptoJS.enc.Utf8);
        return JSON.parse(decrypted) || null;
    } catch (error) {
        console.error('Error retrieving and decrypting data from cookie:', error);
        return null;
    }
};

export const removeSecureItem = (key) => {
    try {
        deleteCookie(key);
    } catch (error) {
        console.error('Error removing cookie:', error);
    }
};

export const clearSecureStorage = () => {
    try {
        const cookies = document.cookie.split('; ');
        for (const cookie of cookies) {
            const key = cookie.split('=')[0];
            deleteCookie(decodeURIComponent(key));
        }
    } catch (error) {
        console.error('Error clearing cookies:', error);
    }
};