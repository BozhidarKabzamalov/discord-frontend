import axiosInstance from "../axiosInstance";
import { loginUser } from "../services/userService";
import { setAuthenticatedUser } from "../store/slices/authSlice";
import { LoginPayload } from "../types/auth";
import { useAppDispatch } from "./hooks";

const useAuth = () => {
	const dispatch = useAppDispatch();

	const register = () => {};

	const login = async (payload: LoginPayload) => {
		const authenticatedUser = await loginUser(payload);

		dispatch(setAuthenticatedUser(authenticatedUser));
		axiosInstance.defaults.headers.common.Authorization = `Bearer ${authenticatedUser.token}`;
		localStorage.setItem(
			"authenticatedUser",
			JSON.stringify(authenticatedUser)
		);
	};

	const logout = () => {
		localStorage.removeItem("authenticatedUser");
	};

	return { register, login, logout };
};

export default useAuth;
