import { Routes, Route } from "react-router";

import Login from "./views/Login";
import Register from "./views/Register";
import ProtectedRoutes from "./ProtectedRoutes";
import Dashboard from "./views/Dashboard";
import Server from "./views/Server";
import useAuth from "./hooks/useAuth";
import { useEffect } from "react";
import { useBoundStore } from "./stores/useBoundStore";

const App = () => {
    const { initializeAuth } = useAuth();
    const authenticatedUser = useBoundStore((state) => state.authenticatedUser);

    useEffect(() => {
        if (authenticatedUser) return;

        initializeAuth();
    }, [authenticatedUser, initializeAuth])
    
	return (
		<Routes>
			<Route path='/login' element={<Login />} />
			<Route path='/register' element={<Register />} />
			<Route element={<ProtectedRoutes />}>
				<Route path='/' element={<Dashboard />}>
					<Route path='/channels/@me' element={<Register />} />
					<Route
						path='/channels/:serverId/:channelId'
						element={<Server />}
					/>
				</Route>
			</Route>
		</Routes>
	);
};

export default App;
