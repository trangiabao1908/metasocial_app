// GET IPV4 ADDRESS

import { API } from "./authApi";

import { config } from "../utils/configAxios";
// API POST

export const getNotificationApi = async (updatedAt) => {
  try {
    const headers = await config();
    const { data } = await API.get(`/notification?updatedAt=${updatedAt}`, {
      headers,
    });
    return data;
  } catch (error) {
    console.log(error);
  }
};
