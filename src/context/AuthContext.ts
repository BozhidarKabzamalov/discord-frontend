import { createContext } from "react";

const defaultAuthContext = {
	authenticatedUser: null,
};

export const AuthContext = createContext(defaultAuthContext);
