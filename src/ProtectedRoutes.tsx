import { Outlet, Navigate } from "react-router";
import { useBoundStore } from "./stores/useBoundStore";

const ProtectedRoutes = () => {
    const authenticatedUser = useBoundStore((state) => state.authenticatedUser);

	return authenticatedUser ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedRoutes;
