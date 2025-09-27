import { StateCreator } from "zustand";

export type ThemeSliceType = {
	theme: "dark" | "light";
	toggleTheme: () => void;
};

const createThemeSlice: StateCreator<ThemeSliceType> = (set) => ({
	theme: "light",
	toggleTheme: () =>
		set((state) => {
			const newTheme = state.theme === "dark" ? "light" : "dark";

			return { theme: newTheme };
		}),
});

export default createThemeSlice;
