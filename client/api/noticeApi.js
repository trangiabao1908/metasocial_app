// GET IPV4 ADDRESS

import { API } from "./authApi";

import { config } from "../utils/configAxios";
// API POST

// Get 5 Post
export const getNotificationApi = async () => {
  const headers = await config();
  const { data } = await API.get(`/notification`, {
    headers,
  });

  return data;
};
