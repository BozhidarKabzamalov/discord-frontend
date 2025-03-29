import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    isAuthenticated: false,
    authenticatedUserId: null,
    servers: null,
    friends: null,
};

export const mainSlice = createSlice({
    name: "mainSlice",
    initialState,
    reducers: {
        setIsAuthenticated: (state, action) => {
            state.isAuthenticated = action.payload;
        },
        setAuthenticatedUserId: (state, action) => {
            state.authenticatedUserId = action.payload;
        },
        setServers: (state, action) => {
            state.servers = action.payload;
        },
        setFriends: (state, action) => {
            state.friends = action.payload;
        },
    },
});

export const {
    setIsAuthenticated,
    setAuthenticatedUserId,
    setServers,
    setFriends,
} = mainSlice.actions;

export default mainSlice.reducer;
