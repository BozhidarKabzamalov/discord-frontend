import { StateCreator } from "zustand";
import { DialogSliceType } from "../types/store";

const createDialogSlice: StateCreator<DialogSliceType> = (set) => ({
    serverId: null,
    setServerId: (payload) => set(() => ({ serverId: payload })),
    channelId: null,
    setChannelId: (payload) => set(() => ({ channelId: payload })),
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
    showEditServerDialog: false,
    setShowEditServerDialog: (payload) =>
        set(() => ({ showEditServerDialog: payload })),
    showEditCategoryDialog: false,
    setShowEditCategoryDialog: (payload) =>
        set(() => ({ showEditCategoryDialog: payload })),
    showEditChannelDialog: false,
    setShowEditChannelDialog: (payload) =>
        set(() => ({ showEditChannelDialog: payload })),
});

export default createDialogSlice;
