import { StateCreator } from "zustand";
import { DialogSliceType } from "../types/store";

const createDialogSlice: StateCreator<DialogSliceType> = (set) => ({
	showJoinServerDialog: false,
	setShowJoinServerDialog: (payload) =>
		set(() => ({ showJoinServerDialog: payload })),
	showCreateServerDialog: false,
	setShowCreateServerDialog: (payload) =>
		set(() => ({ showCreateServerDialog: payload })),
	showCreateServerChannelDialog: false,
	setShowCreateServerChannelDialog: (payload) =>
		set(() => ({ showCreateServerChannelDialog: payload })),
});

export default createDialogSlice;
