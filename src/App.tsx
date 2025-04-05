import { Routes, Route, useNavigate } from "react-router";

import { useEffect } from "react";
import Login from "./views/Login";
import Register from "./views/Register";
import ProtectedRoutes from "./ProtectedRoutes";
import Home from "./views/Home";
import axiosInstance from "./axiosInstance";
import { useAppDispatch, useAppSelector } from "./hooks/hooks";
import { setAuthenticatedUser } from "./store/slices/authSlice";

const App = () => {
	const dispatch = useAppDispatch();
	const navigate = useNavigate();
	const authenticatedUser = useAppSelector(
		(state) => state.auth.authenticatedUser
	);

	useEffect(() => {
		const persistedAuthenticatedUser =
			localStorage.getItem("authenticatedUser");

		if (!persistedAuthenticatedUser || authenticatedUser) return;

		const parsedPersistedAuthenticatedUser = JSON.parse(
			persistedAuthenticatedUser
		);

		axiosInstance.defaults.headers.common.Authorization = `Bearer ${parsedPersistedAuthenticatedUser.id}`;
		dispatch(setAuthenticatedUser(parsedPersistedAuthenticatedUser));
		navigate("/");
	}, [authenticatedUser, dispatch, navigate]);

	return (
		<Routes>
			<Route path='/login' element={<Login />} />
			<Route path='/register' element={<Register />} />
			<Route element={<ProtectedRoutes />}>
				<Route path='/' element={<Home />}></Route>
			</Route>
		</Routes>
	);
};

export default App;
