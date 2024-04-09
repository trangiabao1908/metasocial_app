import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  list: [],
};

const imageState = createSlice({
  name: "imageState",
  initialState,
  reducers: {
    getAllImage: (state, action) => {
      state.list = action.payload;
    },

    loadMoreImage: (state, action) => {
      state.list = [...state.list, ...action.payload];
    },

    clearImage: (state) => {
      state.list = [];
    },
  },
});
export const { getAllImage, clearImage, loadMoreImage } = imageState.actions;

export default imageState.reducer;
