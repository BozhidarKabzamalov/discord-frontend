import { create } from "zustand";

const useAuthStore = create((set) => ({
	authenticatedUser: null,
	setAuthenticatedUser: (payload) =>
		set(() => ({ authenticatedUser: payload })),
}));

export default useAuthStore;
