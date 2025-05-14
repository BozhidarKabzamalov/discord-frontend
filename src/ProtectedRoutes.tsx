import { Outlet, Navigate } from "react-router";
import useAuthStore from "./stores/authStore";

const ProtectedRoutes = () => {
    const authenticatedUser = useAuthStore((state) => state.authenticatedUser);

	return authenticatedUser ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedRoutes;
