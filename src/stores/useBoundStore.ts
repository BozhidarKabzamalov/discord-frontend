import { create } from "zustand";
import createAuthSlice from "./authSlice";
import createDialogSlice from "./dialogSlice";
import createThemeSlice from "./themeSlice";
import { StoreType } from "../types/store";

export const useBoundStore = create<StoreType>()((...a) => ({
    ...createAuthSlice(...a),
    ...createDialogSlice(...a),
    ...createThemeSlice(...a),
}));
