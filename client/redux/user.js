import { createSlice } from "@reduxjs/toolkit";
const initialUserState = {
  isAuthenticated: false,
  loading: true,
  user: null, // Khởi tạo user là null
};
export const userSlice = createSlice({
  name: "userState",
  initialState: initialUserState,
  reducers: {
    setLogin: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.user;
    },
    setLogout: (state) => {
      state.loading = true;
      state.isAuthenticated = false;
      state.user = null;
    },
    setFriends: (state, action) => {
      state.user.friends = [action.payload, ...state.user.friends];
    },
    updatedUser: (state, action) => {
      state.user = {
        ...state.user,
        username: action.payload.username,
        displayName: action.payload.displayName,
        story: action.payload.story,
        link: action.payload.link,
        picturePath: action.payload.picturePath,
      };
    },
  },
});

export const { setLogin, setLogout, updatedUser, setFriends } =
  userSlice.actions;
export default userSlice.reducer;
