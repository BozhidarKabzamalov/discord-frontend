import { useNavigate } from "react-router";
import { LoginPayload } from "../types/auth";
import { loginUser } from "../services/userService";
import axiosInstance from "../axiosInstance";
import { useBoundStore } from "../stores/useBoundStore";

const useAuth = () => {
    const navigate = useNavigate();
    const authenticatedUser = useBoundStore((state) => state.authenticatedUser);
    const setAuthenticatedUser = useBoundStore(
		(state) => state.setAuthenticatedUser
	);
    
    const register = () => {};

	const login = async (payload: LoginPayload) => {
		try {
			const authenticatedUser = await loginUser(payload);
			setAuthenticatedUser(authenticatedUser);

			axiosInstance.defaults.headers.common.Authorization = `Bearer ${authenticatedUser.token}`;
			localStorage.setItem(
				"authenticatedUser",
				JSON.stringify(authenticatedUser)
			);
		} catch (error) {
			console.log(error);
            throw error;
		}
	};

	const logout = () => {
		localStorage.removeItem("authenticatedUser");
        setAuthenticatedUser(null);
	};

    const initializeAuth = async () => {
        const persistedAuthenticatedUser =
            localStorage.getItem("authenticatedUser");

        if (!persistedAuthenticatedUser || authenticatedUser) return;

        const parsedPersistedAuthenticatedUser = JSON.parse(
            persistedAuthenticatedUser
        );

        setAuthenticatedUser(parsedPersistedAuthenticatedUser);
        axiosInstance.defaults.headers.common.Authorization = `Bearer ${parsedPersistedAuthenticatedUser.token}`;
        navigate("/");
    };

    return { register, login, logout, initializeAuth };
}

export default useAuth;