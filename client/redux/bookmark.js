import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  bookmark: [],
};

const bookmarkState = createSlice({
  name: "bookmarkState",
  initialState,
  reducers: {
    getBookmarkRD: (state, action) => {
      state.bookmark = action.payload;
    },

    addBookMarkRD: (state, action) => {
      return {
        ...state,
        bookmark: [...state.bookmark, action.payload],
      };
    },

    delBookMarkRD: (state, action) => {
      let indexToDelete = state.bookmark.findIndex(
        (item) =>
          item.post._id === action.payload.postID &&
          item.author._id === action.payload.userID
      );
      if (indexToDelete !== -1) {
        const newBookmarks = [
          ...state.bookmark.slice(0, indexToDelete),
          ...state.bookmark.slice(indexToDelete + 1),
        ];

        return {
          ...state,
          bookmark: newBookmarks,
        };
      } else {
        console.log("Bookmark not found");
      }
    },
    deleteBookmarkByPostId: (state, action) => {
      let isValidBookmark = state?.bookmark?.findIndex(
        (bookmark) => bookmark?.post?._id === action.payload
      );
      if (isValidBookmark !== -1) {
        const newBookmarks = [
          ...state.bookmark.slice(0, isValidBookmark),
          ...state.bookmark.slice(isValidBookmark + 1),
        ];
        return {
          ...state,
          bookmark: newBookmarks,
        };
      } else {
        console.log("Book is not valid");
      }
    },
    clearBookmark: (state) => {
      state.bookmark = [];
    },
  },
});
export const {
  getBookmarkRD,
  clearBookmark,
  addBookMarkRD,
  delBookMarkRD,
  deleteBookmarkByPostId,
} = bookmarkState.actions;

export default bookmarkState.reducer;
