import AsyncStorage from "@react-native-async-storage/async-storage";
import CryptoJS from "react-native-crypto-js";

export const saveToken = async (value) => {
  try {
    await AsyncStorage.setItem("accessToken", value);
  } catch (err) {
    console.error(err);
  }
};

export const getToken = async () => {
  try {
    const access_token = await AsyncStorage.getItem("accessToken");
    return access_token;
  } catch (err) {
    console.error(err);
  }
};

export const removeToken = async () => {
  try {
    await AsyncStorage.removeItem("accessToken");
    await AsyncStorage.removeItem("cachedImages");
  } catch (err) {
    console.error(err);
  }
};

export const encryptRefreshToken = async (refreshToken) => {
  try {
    const encryptedRefreshToken = CryptoJS.AES.encrypt(
      refreshToken,
      process.env.EXPO_PUBLIC_ENCRYPTED_KEY
    ).toString();
    await AsyncStorage.setItem("refreshToken", encryptedRefreshToken);
  } catch (err) {
    console.log(err);
  }
};
export const decryptRefreshToken = async () => {
  try {
    const encryptedRefreshToken = await AsyncStorage.getItem("refreshToken");
    if (encryptedRefreshToken) {
      const bytes = CryptoJS.AES.decrypt(
        encryptedRefreshToken,
        process.env.EXPO_PUBLIC_ENCRYPTED_KEY
      );
      const decryptedRefreshToken = bytes.toString(CryptoJS.enc.Utf8);
      return decryptedRefreshToken;
    } else {
      console.log("Do not have any encrypted refresh token");
    }
  } catch (err) {
    console.log(err);
  }
};
