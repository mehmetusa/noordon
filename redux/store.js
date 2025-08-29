// redux/store.js
import { configureStore } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import cartReducer from "./cartSlice";
import storage from "redux-persist/lib/storage"; // defaults to localStorage
import { persistStore, persistReducer } from "redux-persist";

const persistConfig = {
  key: "root",
  storage,
  whitelist: ["cart"], // only persist cart slice
};

const rootReducer = combineReducers({
  cart: cartReducer,
  // other reducers here
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

export const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export const persistor = persistStore(store);
