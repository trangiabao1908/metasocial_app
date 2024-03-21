// GET IPV4 ADDRESS

import { API } from "./authApi";

import { config } from "../utils/configAxios";
import { Alert } from "react-native";
// API POST

// Get 5 Post
export const getAllPostApi = async (updatedAt) => {
  // console.log(updatedAt);
  // console.log({ page: page });

  const headers = await config();
  const { data } = await API.get(`/post?updatedAt=${updatedAt}`, {
    headers,
  });

  return data;
};

export const getListImagesApi = async (updatedAt) => {
  // console.log(updatedAt);
  // console.log({ page: page });

  const headers = await config();
  const { data } = await API.get(`/post/images?updatedAt=${updatedAt}`, {
    headers,
  });

  return data;
};

// Get Post By UserID
export const getPostByUserIdApi = async (id, type) => {
  let urlApi = "";
  if (type === "personal") {
    urlApi = `/post/view/${id}`;
  } else {
    urlApi = `/post/${id}`;
  }

  try {
    if (type) {
      const headers = await config();
      const { data } = await API.get(`${urlApi}`, { headers });
      return data;
    }
  } catch (error) {
    console.log(error);
  }
};

// Create post
export const createPostApi = async (values, arrayData) => {
  let optionData = {
    title: values.title,
    assets: arrayData,
  };

  try {
    const headers = await config();
    const { data } = await API.post(`/post/create/`, optionData, {
      headers,
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const updatePostApi = async (values, arrayData, postID) => {
  const headers = await config();
  let optionData = {
    title: values.title,
    assets: arrayData,
  };
  console.log(arrayData);
  try {
    console.log(`/post/update/${postID}/`);
    const { data } = await API.put(`/post/update/${postID}/`, optionData, {
      headers,
    });

    return data;
  } catch (err) {
    console.log(err);
  }
};

export const deletePostApi = async (postID) => {
  const headers = await config();

  try {
    const { data } = await API.delete(`/post/delete/${postID}/`, { headers });

    return data;
  } catch (err) {
    console.log(err);
  }
};

export const likePostApi = async (postID) => {
  const headers = await config();
  let data = {};

  try {
    const { data } = await API.put(`post/like/${postID}/`, data, { headers });

    return data;
  } catch (err) {
    console.log(err);
    // throw err;
  }
};

export const getCommentPostApi = async (postID) => {
  const headers = await config();

  try {
    const { data } = await API.get(`post/comment/get/${postID}`, {
      headers,
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const commentPost = async (req) => {
  console.log({ req: req });
  // console.log(data.postID);
  console.log(`${API.getUri()}/comment/${req.postID}/`);
  const headers = await config();

  try {
    const { data } = await API.post(`post/comment/${req.postID}`, req, {
      headers,
    });
    return data;
  } catch (err) {
    Alert.alert("Thông Báo", err?.response?.data?.message);
  }
};

export const UpdateCommentPostApi = async (req) => {
  const headers = await config();

  try {
    const { data } = await API.put(
      `post/comment/update/${req.postID}?id=${req.id}`,
      req,
      {
        headers,
      }
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const delCommentPostApi = async (postID, id) => {
  const headers = await config();

  try {
    const { data } = await API.delete(
      `post/comment/delete/${postID}?id=${id}`,
      {
        headers,
      }
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const replyCommentApi = async (req) => {
  const { postID, comment, id, tag } = req;
  const headers = await config();

  try {
    const { data } = await API.post(
      `post/comment/reply/${postID}?commentID=${id}`,
      { comment, tag },
      {
        headers,
      }
    );
    return data;
  } catch (err) {
    Alert.alert("Thông Báo", err?.response?.data?.message);
  }
};

export const editReplyCommentApi = async (req) => {
  const { postID, comment, cmtID, replyID } = req;
  const headers = await config();

  console.log({ postID, comment, cmtID, replyID });

  try {
    const { data } = await API.put(
      `post/comment/reply/update/${postID}?cmtID=${cmtID}&replyID=${replyID}`,
      { comment },
      {
        headers,
      }
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const delReplyCommentApi = async (req) => {
  const { postID, commentID, replyID } = req;
  const headers = await config();

  try {
    const { data } = await API.delete(
      `post/comment/reply/delete/${postID}?commentID=${commentID}&replyID=${replyID}`,
      {
        headers,
      }
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const hideCommentApi = async (postID, disableComment) => {
  const headers = await config();
  console.log({ postID, disableComment });

  try {
    const { data } = await API.put(
      `post/comment/hide/${postID}`,
      { disableComment },
      {
        headers,
      }
    );
    return data;
  } catch (err) {
    console.log(err);
  }
};

export const getLikeListApi = async (postID) => {
  const headers = await config();

  try {
    const { data } = await API.get(`post/like/list/${postID}`, {
      headers,
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};
export const searchUserLikeApi = async (postID, q) => {
  const headers = await config();
  console.log({ postID, q });
  try {
    const { data } = await API.get(`post/like/search/${postID}?q=${q}`, {
      headers,
    });
    return data;
  } catch (err) {
    console.log(err);
  }
};
