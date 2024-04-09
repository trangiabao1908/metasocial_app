import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  post: [],
};

const profileState = createSlice({
  name: "profileState",
  initialState,
  reducers: {
    getProfileUser: (state, action) => {
      console.log("Get Profile User");
      state.user = action.payload;
    },
    updateProfileUser: (state, action) => {
      console.log("Update Profile User");
      state.user = {
        ...state.user,
        username: action.payload.username,
        displayName: action.payload.displayName,
        story: action.payload.story,
        link: action.payload.link,
        picturePath: action.payload.picturePath,
      };
    },
    getProfilePost: (state, action) => {
      console.log("Get Profile Post");
      state.post = action.payload;
    },

    clearProfile: (state) => {
      console.log("Clean Profile");
      state.user = [];
      state.post = [];
    },
  },
});
export const {
  getProfileUser,
  getProfilePost,
  clearProfile,
  updateProfileUser,
} = profileState.actions;

export default profileState.reducer;
