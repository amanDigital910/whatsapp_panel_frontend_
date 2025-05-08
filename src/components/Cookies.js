// utils/cookies.js
import Cookies from 'js-cookie';
import { encryptData, decryptData } from './EnCryptionKeys';

const TOKEN_KEY = 'userToken';
const USER_KEY = 'userData';

// Expiry in days (600 seconds ≈ 0.00694 days)
const COOKIE_EXPIRY = 6 / (24 * 60 * 60);

/** Save user and token in cookies (encrypted) */
export const setAuthCookies = (user, token) => {
  try {
    const encryptedToken = encryptData(token);
    const encryptedUser = encryptData(user);

    Cookies.set(TOKEN_KEY, encryptedToken, { expires: COOKIE_EXPIRY });
    Cookies.set(USER_KEY, encryptedUser, { expires: COOKIE_EXPIRY });
  } catch (err) {
    console.error("Failed to set auth cookies:", err);
  }
};

/** Get decrypted user and token from cookies */
export const getAuthCookies = () => {
  try {
    const encryptedToken = Cookies.get(TOKEN_KEY);
    const encryptedUser = Cookies.get(USER_KEY);

    if (!encryptedToken || !encryptedUser) return null;

    const token = decryptData(encryptedToken);
    const user = decryptData(encryptedUser);

    return { user, token };
  } catch (err) {
    console.warn("Failed to get auth cookies:", err);
    return null;
  }
};

/** * Remove auth cookies */
export const clearAuthCookies = () => {
  Cookies.remove(TOKEN_KEY);
  Cookies.remove(USER_KEY);
};

/**  Check if user is authenticated based on token presence  */
export const isAuthenticated = () => {
  return !!Cookies.get(TOKEN_KEY);
};
