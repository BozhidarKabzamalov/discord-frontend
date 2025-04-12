import { Outlet, Navigate } from "react-router-dom";
import { AuthContext } from "./context/AuthContext";
import { useContext } from "react";

const ProtectedRoutes = () => {
    const { authenticatedUser } = useContext(AuthContext);

    return authenticatedUser ? <Outlet /> : <Navigate to='/login' />;
};

export default ProtectedRoutes;
