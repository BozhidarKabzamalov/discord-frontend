import axiosInstance from "../axiosInstance";

export const registerUser = async (payload) => {
    try {
        await axiosInstance.post("/register", payload);
    } catch (error) {
        console.log(error);
    }
};

export const loginUser = async (payload) => {
    try {
        await axiosInstance.post("/login", payload);
    } catch (error) {
        console.log(error);
    }
}
