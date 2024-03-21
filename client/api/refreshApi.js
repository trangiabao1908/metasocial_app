import axios from "axios";

const BASE_URL = `${process.env.EXPO_PUBLIC_API_URL}/api`;
const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
export const refreshTokenApi = async (refreshToken) => {
  try {
    const res = await API.post("/auth/refresh_token", { refreshToken });
    if (res.data.success === true) {
      return res.data;
    }
  } catch (err) {
    console.log(err.response?.data.message);
  }
};
