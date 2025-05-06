import { createContext } from "react";
import { AuthenticatedUser, LoginPayload } from "../types/auth";

type AuthContextType = {
	authenticatedUser: AuthenticatedUser | null;
	register: () => void;
	login: (payload: LoginPayload) => Promise<void>;
	logout: () => void;
};

const defaultAuthContext = {
	authenticatedUser: null,
	register: async () => {
		throw new Error("register() must be used within an AuthProvider");
	},
	login: async () => {
		throw new Error("login() must be used within an AuthProvider");
	},
	logout: async () => {
		throw new Error("logout() must be used within an AuthProvider");
	},
};

export const AuthContext = createContext<AuthContextType>(defaultAuthContext);
