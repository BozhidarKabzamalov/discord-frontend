import axiosInstance from "../axiosInstance";
import { LoginPayload, RegisterPayload } from "../types/auth";

export const registerUser = async (payload: RegisterPayload) => {
	try {
		await axiosInstance.post("/register", payload);
	} catch (error) {
		console.log(error);
	}
};

export const loginUser = async (payload: LoginPayload) => {
	try {
		const { data } = await axiosInstance.post("/login", payload);

		return data.user;
	} catch (error) {
		console.log(error);
	}
};
