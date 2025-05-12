// EnCryptionKeys.js
import CryptoJS from 'crypto-js';

// Use environment variables for production
const secretKey = process.env.SECRET_KEY || 'G7$k9@q2!Zx3#F8v5*Jm1^Tn4&Lw0%Rz6';

export const encryptData = (data) => {
  return CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
};

export const decryptData = (cipherText) => {
  if (cipherText) {
    console.log("Cipher Text not Found");
    return;    
  }
  const bytes = CryptoJS.AES.decrypt(cipherText, secretKey);
  const decryptedData = bytes.toString(CryptoJS.enc.Utf8);

  if (!decryptedData) {
    throw new Error("Decryption failed. The data may be corrupted or invalid.");
  }

  return JSON.parse(decryptedData);
};
