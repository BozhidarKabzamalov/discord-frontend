import { AuthenticatedUser } from "./auth";
import { ThemeSliceType } from "../stores/themeSlice";

export type AuthSliceType = {
	authenticatedUser: AuthenticatedUser | null;
	setAuthenticatedUser: (payload: AuthenticatedUser | null) => void;
};

export type DialogSliceType = {
	serverId: number | null;
	setServerId: (payload: number | null) => void;
	channelId: number | null;
	setChannelId: (payload: number | null) => void;
	channelCategoryId: number | null;
	setChannelCategoryId: (payload: number | null) => void;
	showCreateChannelDialog: boolean;
	setShowCreateChannelDialog: (payload: boolean) => void;
	showCreateServerDialog: boolean;
	setShowCreateServerDialog: (payload: boolean) => void;
	showJoinServerDialog: boolean;
	setShowJoinServerDialog: (payload: boolean) => void;
	showCreateCategoryDialog: boolean;
	setShowCreateCategoryDialog: (payload: boolean) => void;
	showEditServerDialog: boolean;
	setShowEditServerDialog: (payload: boolean) => void;
	showEditCategoryDialog: boolean;
	setShowEditCategoryDialog: (payload: boolean) => void;
	showEditChannelDialog: boolean;
	setShowEditChannelDialog: (payload: boolean) => void;
};

export type StoreType = AuthSliceType & DialogSliceType & ThemeSliceType;
