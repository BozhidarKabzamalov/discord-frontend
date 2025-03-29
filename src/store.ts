import { configureStore } from "@reduxjs/toolkit";
import mainReducer from "./store/slices/mainSlice";

export const store = configureStore({
    reducer: {
        mainSlice: mainReducer,
    },
});
