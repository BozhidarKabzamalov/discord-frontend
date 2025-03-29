import { Outlet, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

const ProtectedRoutes = () => {
    const authenticatedUserId = useSelector(
        (state) => state.mainSlice.authenticatedUserId
    );

    return false ? <Outlet /> : <Navigate to="/login" />;
};

export default ProtectedRoutes;
