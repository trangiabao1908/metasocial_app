import { createSlice } from "@reduxjs/toolkit";
const initialState = {
  mode: "light",
  loading: true,
  isAuthenticated: false,
  accessToken: "",
  user: {
    _id: "",
    username: "",
    email: "",
  },
};
export const mediaState = createSlice({
  name: "media",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.loading = false;
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.accessToken = action.payload.accessToken;
    },
    setLogout: (state) => {
      state.loading = true;
      state.user = null;
      state.isAuthenticated = false;
      state.accessToken = null;
    },
  },
});

export const { setMode, setLogin, setLogout } = mediaState.actions;
export default mediaState.reducer;
