import { jwtDecode } from "jwt-decode";
import { refreshTokenApi } from "../api/refreshApi";
import {
  getToken,
  decryptRefreshToken,
  saveToken,
  encryptRefreshToken,
} from "./processStore";
import "core-js/stable/atob";
export const checkToken = async () => {
  try {
    const accessToken = await getToken();
    if (!accessToken) {
      console.log("AccessToken is not valid");
    }
    const decodedToken = jwtDecode(accessToken);
    const currentTime = Math.floor(Date.now() / 1000);
    if (decodedToken.exp < currentTime) {
      const refreshToken = await decryptRefreshToken();
      console.log("decryptRefreshToken:", refreshToken);
      const res = await refreshTokenApi(refreshToken);
      if (res && res.success === true) {
        await saveToken(res.accessToken);
        await encryptRefreshToken(res.refreshToken);
      }
    }
  } catch (err) {
    console.log(err);
  }
};
