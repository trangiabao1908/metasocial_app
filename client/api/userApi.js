// GET IPV4 ADDRESS

import { API } from "./authApi";

import { config } from "../utils/configAxios";
import { Alert } from "react-native";
// API POST

// Get 5 Post
export const updatedUserApi = async (
  { username, displayName, story, link },
  url
) => {
  const headers = await config();

  const values = {
    username,
    displayName,
    story,
    link,
  };

  const { data } = await API.put(`/user/update`, { values, url }, { headers });

  return data;
};

export const getFriends = async () => {
  try {
    const headers = await config();
    const res = await API.get("/user/friends", {
      headers,
    });
    if (res.data.success === true) {
      return res.data;
    }
  } catch (err) {
    console.log(err.response?.data.message);
  }
};

export const fetchMessageApi = async (selectedUserId, lastMessageCreatedAt) => {
  try {
    console.log("Started fetching messages");
    const headers = await config();
    const res = await API.get(
      `/user/message?selectedUserId=${selectedUserId}&lastMessageCreatedAt=${lastMessageCreatedAt}`,
      {
        headers,
      }
    );
    if (res.data.success) {
      return res.data;
    }
  } catch (err) {
    console.log(err.response?.data.message);
  }
};

export const sendMessage = async (values) => {
  try {
    const headers = await config();
    const res = await API.post("user/message", values, {
      headers,
    });
    if (res.data.success) {
      return res.data;
    }
  } catch (err) {
    console.log(err.response?.data.message);
  }
};

export const deleteMessageApi = async (values) => {
  try {
    const headers = await config();
    const res = await API.post("user/deleteMessage", values, {
      headers,
    });
    if (res.data.success) {
      return res.data;
    }
  } catch (err) {
    console.log(err.response?.data.message);
    Alert.alert("Thông Báo", err.response?.data.message);
  }
};

export const fetchChatApi = async () => {
  try {
    const headers = await config();
    const res = await API.get("/user/chat", { headers });
    if (res.data.success === true) {
      return res.data;
    }
  } catch (err) {
    console.log(err.response?.data.message);
  }
};

export const getRequestFriendAPI = async (userLoggedId) => {
  try {
    const headers = await config();
    const res = await API.get(`/user/friend-request/${userLoggedId}`, {
      headers,
    });
    if (res.data.success === true) {
      // console.log(res.data);
      return res.data;
    }
  } catch (err) {
    console.log(err.response?.data.message);
  }
};

export const acceptFriendRequestAPI = async (needAcceptId) => {
  try {
    const headers = await config();
    const res = await API.put(
      `/user/friend-request/accept`,
      { needAcceptId },
      {
        headers,
      }
    );
    if (res.data.success === true) {
      return res.data;
    }
  } catch (err) {
    console.log(err.response?.data.message);
  }
};

export const sendRequestFriend = async (selectedUserId) => {
  try {
    const headers = await config();
    const res = await API.post(
      "/user/friend-request",
      { selectedUserId },
      { headers }
    );
    if (res?.data?.success === true) {
      return res.data;
    }
  } catch (err) {
    console.log(err.response?.data.message);
  }
};

export const getSentFriendRequestAPI = async (selectedUserId) => {
  try {
    const headers = await config();
    const res = await API.get(
      `/user/sent-friend-request?selectedUserId=${selectedUserId}`,
      { headers }
    );
    if (res.data.success === true) {
      return res.data;
    }
  } catch (err) {
    console.log(err?.response?.data.message);
  }
};

export const getChatIdAPI = async (selectedUserId) => {
  try {
    const headers = await config();

    const res = await API.get(`/user/chatId?selectedUserId=${selectedUserId}`, {
      headers,
    });
    if (res.data.success === true) {
      return res.data;
    }
  } catch (err) {
    console.log(err?.response?.data.message);
  }
};

export const searchUserApi = async (q) => {
  try {
    const headers = await config();
    const res = await API.get(`/user/search?q=${q}`, { headers });
    if (res.data.success === true) {
      return res.data;
    }
  } catch (err) {
    console.log(err.response?.data.message);
  }
};

export const removeFriendAPI = async (selectedUserId) => {
  try {
    const headers = await config();
    const res = await API.put(
      `/user/unfriend-request`,
      { selectedUserId },
      { headers }
    );
    if (res?.data?.success) {
      return res.data;
    }
  } catch (err) {
    console.log(err.response?.data.message);
  }
};
export const openValidAPI = async () => {
  try {
    const headers = await config();
    const res = await API.put(`/user/openValid`, {}, { headers: headers });
    if (res?.data?.success) {
      return res.data;
    }
  } catch (err) {
    console.log(err.response?.data.message);
  }
};
