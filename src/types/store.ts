import { AuthenticatedUser } from "./auth";

export type AuthSliceType = {
	authenticatedUser: AuthenticatedUser | null;
	setAuthenticatedUser: (payload: AuthenticatedUser) => void;
};

export type DialogSliceType = {
	showCreateServerChannelDialog: boolean;
	setShowCreateServerChannelDialog: (payload: boolean) => void;
	showCreateServerDialog: boolean;
	setShowCreateServerDialog: (payload: boolean) => void;
};

export type StoreType = AuthSliceType & DialogSliceType;
