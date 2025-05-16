import { StateCreator } from "zustand";
import { AuthSliceType } from "../types/store";

const createAuthSlice: StateCreator<AuthSliceType> = (set) => ({
	authenticatedUser: null,
	setAuthenticatedUser: (payload) =>
		set(() => ({ authenticatedUser: payload })),
});

export default createAuthSlice;
