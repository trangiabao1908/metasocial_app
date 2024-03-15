import * as CryptoJS from "crypto-js";

const key = CryptoJS.enc.Utf8.parse("encryptedMessage");

export const encryptMessage = (text: string): string => {
  const ciphertext = CryptoJS.AES.encrypt(text, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  return ciphertext.toString();
};

export const decryptMessage = (encryptedText: string): string => {
  const bytes = CryptoJS.AES.decrypt(encryptedText, key, {
    mode: CryptoJS.mode.ECB,
    padding: CryptoJS.pad.Pkcs7,
  });
  const plaintext = bytes.toString(CryptoJS.enc.Utf8);
  return plaintext;
};
