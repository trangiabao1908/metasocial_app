import axios, { AxiosError } from "axios";
import {
  encryptRefreshToken,
  removeToken,
  saveToken,
} from "../utils/processStore";
import { Alert } from "react-native";
import { config } from "../utils/configAxios";
const BASE_URL = "https://metasocial-app.onrender.com/api";
export const API = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const registerApi = async (values) => {
  console.log("Register");
  try {
    const request = await API.post("/auth/register", values);
    if (request?.data?.success === true) {
      // Alert.alert("Thông Báo", request?.data.message);
      await loginApi(values);
      return request.data;
    }
  } catch (err) {
    console.log(err.message);
    if (err instanceof AxiosError) {
      Alert.alert("Thông Báo", err.response?.data.message);
    }
  }
};
export const loginApi = async (values) => {
  try {
    const res = await API.post("/auth/login", values);
    if (res.data.success === true) {
      saveToken(res.data.accessToken);
      console.log("RefreshToken before encryp: ", res.data.refreshToken);
      encryptRefreshToken(res.data.refreshToken);
      Alert.alert("Thông Báo", res.data.message);
    }
    API.defaults.headers.common[
      "Authorization"
    ] = `Bearer ${res.data.accessToken}`;
    return res.data;
  } catch (err) {
    console.log(err.message);
    if (err instanceof AxiosError) {
      console.log(err.response?.data.message);
      Alert.alert("Thông Báo", err.response?.data.message);
    }
  }
};

export const logoutApi = async () => {
  const headers = await config();
  try {
    const res = await API.get("/auth/logout", {
      headers,
    });

    if (res.data.success === true) {
      removeToken();
      Alert.alert("Thông Báo", res.data.message);
    }
    API.defaults.headers.common["Authorization"] = "";
    return res.data;
  } catch (err) {
    console.log(err.message);
    if (err instanceof AxiosError) {
      console.log(err.response?.data.message);
    }
  }
};

export const changePasswordAPI = async (values) => {
  try {
    const headers = await config();
    const res = await API.post("/auth/change_password", values, { headers });
    if (res?.data?.success) {
      return res.data;
    }
  } catch (err) {
    Alert.alert("Thông Báo", err?.response?.data?.message);
  }
};

export const forgotPasswordAPI = async (email) => {
  try {
    const res = await API.post("/auth/forgot_password", { email });
    if (res.data?.success) {
      return res.data;
    }
  } catch (err) {
    Alert.alert("Thông Báo", err?.response?.data?.message);
  }
};

export const resetPasswordAPI = async (values) => {
  try {
    const res = await API.post("/auth/reset_password", values);
    if (res.data?.success) {
      return res.data;
    }
  } catch (err) {
    Alert.alert("Thông Báo", err?.response?.data?.message);
  }
};
