export type LoginPayload = {
	email: string;
	password: string;
};

export type RegisterPayload = {
	username: string;
} & LoginPayload;

export type AuthenticatedUser = {
	email: string;
	id: number;
	token: string;
	username: string;
};
