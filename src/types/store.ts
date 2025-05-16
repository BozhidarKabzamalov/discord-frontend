import { AuthenticatedUser } from "./auth";

export type AuthSliceType = {
    authenticatedUser: AuthenticatedUser | null;
    setAuthenticatedUser: (payload: AuthenticatedUser) => void;
};

export type DialogSliceType = {
	shouldShowCreateServerDialog: boolean;
	setShouldShowCreateServerDialog: (payload: boolean) => void;
};

export type StoreType = AuthSliceType & DialogSliceType;