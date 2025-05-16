import { StateCreator } from "zustand";
import { DialogSliceType } from "../types/store";

const createDialogSlice: StateCreator<DialogSliceType> = (set) => ({
	shouldShowCreateServerDialog: false,
	setShouldShowCreateServerDialog: (payload) =>
		set(() => ({ shouldShowCreateServerDialog: payload })),
});

export default createDialogSlice;
