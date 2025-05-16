import { create } from "zustand";
import createAuthSlice from "./authSlice";
import createDialogSlice from "./dialogSlice";
import { StoreType } from "../types/store";

export const useBoundStore = create<StoreType>()((...a) => ({
	...createAuthSlice(...a),
	...createDialogSlice(...a),
}));
