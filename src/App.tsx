import { Routes, Route, useNavigate } from "react-router";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import Login from "./views/Login";
import Register from "./views/Register";
import ProtectedRoutes from "./ProtectedRoutes";
import Home from "./views/Home";
import axiosInstance from "./axiosInstance";

const App = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const isAuthenticated = useSelector(
		(state) => state.mainSlice.isAuthenticated
	);

	useEffect(() => {
		const persistedUserId = localStorage.getItem("userId");

		if (!persistedUserId || isAuthenticated) return;

		axiosInstance.defaults.headers.common["User-Id"] = persistedUserId;
		dispatch(setIsAuthenticated(true));
		dispatch(setAuthenticatedUserId(persistedUserId));
		navigate("/");
	}, [dispatch, isAuthenticated, navigate]);

	return (
		<Routes>
			<Route path='/login' element={<Login />} />
			<Route path='/register' element={<Register />} />
			<Route element={<ProtectedRoutes />}>
				<Route path='/' element={<Home />}>
				</Route>
			</Route>
		</Routes>
	);
};

export default App;
