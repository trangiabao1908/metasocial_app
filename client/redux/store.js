import userReducer from "./user";
import PostReducer from "./post";
import imageReducer from "./image";
import profileReducer from "./profile";
import bookmarkReducer from "./bookmark";

import AsyncStorage from "@react-native-async-storage/async-storage";
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import {
  persistStore,
  persistReducer,
  FLUSH,
  REHYDRATE,
  PAUSE,
  PERSIST,
  PURGE,
  REGISTER,
} from "redux-persist";
const persistConfig = {
  key: "root",
  storage: AsyncStorage,
  whitelist: ["userState", "postState"],
};

const rootReducer = combineReducers({
  userState: userReducer,
  postState: PostReducer,
  imageState: imageReducer,
  profileState: profileReducer,
  bookmarkState: bookmarkReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);
export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [FLUSH, REHYDRATE, PAUSE, PERSIST, PURGE, REGISTER],
      },
    }),
});
export const persistor = persistStore(store);
