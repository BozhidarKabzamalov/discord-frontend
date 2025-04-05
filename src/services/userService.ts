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
        const { data } = await axiosInstance.post("/login", payload);
        
        return data.user;
    } catch (error) {
        console.log(error);
    }
}
