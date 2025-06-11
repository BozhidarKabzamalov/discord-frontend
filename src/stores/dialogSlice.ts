import { StateCreator } from "zustand";
import { DialogSliceType } from "../types/store";

const createDialogSlice: StateCreator<DialogSliceType> = (set) => ({
	channelCategoryId: null,
	setChannelCategoryId: (payload) =>
		set(() => ({ channelCategoryId: payload })),
	showJoinServerDialog: false,
	setShowJoinServerDialog: (payload) =>
		set(() => ({ showJoinServerDialog: payload })),
	showCreateServerDialog: false,
	setShowCreateServerDialog: (payload) =>
		set(() => ({ showCreateServerDialog: payload })),
	showCreateChannelDialog: false,
	setShowCreateChannelDialog: (payload) =>
		set(() => ({ showCreateChannelDialog: payload })),
	showCreateCategoryDialog: false,
	setShowCreateCategoryDialog: (payload) =>
		set(() => ({ showCreateCategoryDialog: payload })),
});

export default createDialogSlice;
