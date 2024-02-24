import axios from "axios";
import { AxiosError } from "axios";
const BASE_URL = "http://192.168.1.21:3000/api";
export const authApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});
export const registerApi = async (values) => {
  try {
    const res = await authApi.post("/users", values, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    if (res.data.success === true) {
      return res.data;
    }
  } catch (err) {
    console.log(err);
  }
};
export const loginApi = async (values) => {
  const res = await authApi.post("/auth/login", values);
  return res.data;
};

export const logoutApi = async (values) => {};
