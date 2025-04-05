import { Outlet, Navigate } from "react-router-dom";
import { useAppSelector } from "./hooks/hooks";

const ProtectedRoutes = () => {
    const authenticatedUser = useAppSelector(
		(state) => state.auth.authenticatedUser
	);

    return authenticatedUser ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedRoutes;
