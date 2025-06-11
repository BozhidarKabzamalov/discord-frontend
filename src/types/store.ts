import { AuthenticatedUser } from "./auth";

export type AuthSliceType = {
	authenticatedUser: AuthenticatedUser | null;
	setAuthenticatedUser: (payload: AuthenticatedUser | null) => void;
};

export type DialogSliceType = {
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
};

export type StoreType = AuthSliceType & DialogSliceType;
