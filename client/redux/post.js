import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  post: [],
  // for user object
  error: null,
  success: false, // for monitoring the registration process.
};

const postState = createSlice({
  name: "postState",
  initialState,
  reducers: {
    isSuccess: (state) => {
      // console.log("loading");
      // state.loading = false;
    },

    getAllPostSuccess: (state, action) => {
      state.loading = false;
      // state.post = action.payload;
      state.post = action.payload;

      state.success = true;
    },

    loadMorePost: (state, action) => {
      state.post = [...state.post, ...action.payload];
    },

    createPostRD: (state, action) => {
      state.loading = false;
      state.post = [action.payload, ...state.post];
      state.success = true;
    },

    updatePostRD: (state, action) => {
      state.post = state.post.map((item, index) => {
        if (item._id === action.payload._id) {
          return {
            ...item,
            title: action.payload.title,
            assets: action.payload.assets,
          };
        }
        return item;
      });
    },

    deletePostRD: (state, action) => {
      state.loading = false;
      state.post = state.post.filter((item) => item._id !== action.payload);
      state.success = true;
    },

    likePostRD: (state, action) => {
      state.post = state.post.map((item) => {
        if (item._id === action.payload.postID) {
          if (action.payload.type) {
            console.log("Like");
            return {
              ...item,
              like: action.payload.listLike,
            };
          } else {
            console.log("Dislike");
            return {
              ...item,
              like: item.like.filter(
                (data, index) => index !== action.payload.indexUpdate
              ),
            };
          }
        }
        return item;
      });
    },

    hideComment: (state, action) => {
      console.log({ id: action.payload });
      state.post = state.post.map((item) => {
        if (item._id === action.payload._id) {
          return {
            ...item,
            disableComment: !item.disableComment,
          };
        }
        return item;
      });
    },

    clearPost: (state) => {
      state.post = [];
    },
  },
});
export const {
  isLoading,
  getAllPostSuccess,
  isSuccess,
  clearPost,
  deletePostRD,
  updatePostRD,
  createPostRD,
  likePostRD,
  loadMorePost,
  hideComment,
} = postState.actions;

export default postState.reducer;
