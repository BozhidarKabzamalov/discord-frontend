import { useEffect, useState } from "react";
import axiosInstance from "../axiosInstance";
import { loginUser } from "../services/userService";
import { LoginPayload } from "../types/auth";
import { AuthContext } from "./AuthContext";
import { useNavigate } from "react-router-dom";

export const AuthProvider = ({ children }) => {
	const navigate = useNavigate();
	const [authenticatedUser, setAuthenticatedUser] = useState<any>(null);

	const register = () => {};

	const login = async (payload: LoginPayload) => {
		const authenticatedUser = await loginUser(payload);
		setAuthenticatedUser(authenticatedUser);

		axiosInstance.defaults.headers.common.Authorization = `Bearer ${authenticatedUser.token}`;
		localStorage.setItem(
			"authenticatedUser",
			JSON.stringify(authenticatedUser)
		);
	};

	const logout = () => {
		localStorage.removeItem("authenticatedUser");
	};

	useEffect(() => {
		const initializeAuth = async () => {
			const persistedAuthenticatedUser =
				localStorage.getItem("authenticatedUser");

			if (!persistedAuthenticatedUser) return;
                
            setAuthenticatedUser(persistedAuthenticatedUser);
            axiosInstance.defaults.headers.common.Authorization = `Bearer ${persistedAuthenticatedUser.token}`;
            navigate("/");
		};

		initializeAuth();
	}, [navigate]);

	const value = {
		authenticatedUser,
		register,
		login,
		logout,
	};

	return (
		<AuthContext.Provider value={value}>{children}</AuthContext.Provider>
	);
};
