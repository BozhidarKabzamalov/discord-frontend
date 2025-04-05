import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AuthenticatedUser } from "../../types/auth";

export interface AuthState {
	authenticatedUser: AuthenticatedUser;
}

const initialState = {
	authenticatedUser: null,
};

export const authSlice = createSlice({
	name: "authSlice",
	initialState,
	reducers: {
		setAuthenticatedUser: (state, action: PayloadAction<null>) => {
			state.authenticatedUser = action.payload;
		},
	},
});

export const { setAuthenticatedUser } = authSlice.actions;

export default authSlice.reducer;
