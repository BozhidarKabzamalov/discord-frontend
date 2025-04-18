import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import { Server } from "../types/servers";

export const getUserServers = async () => {
	try {
		const { data } = await axiosInstance.get<{ servers: Server[] }>(
			"/servers"
		);

		return data.servers;
	} catch (error) {
		console.log(error);
	}
};

export const useGetUserServers = () => {
	return useQuery({
		queryKey: ["userServers"],
		queryFn: () => getUserServers(),
	});
};

export const createServer = async (serverName: string) => {
	try {
		const { data } = await axiosInstance.post("/servers", {
			name: serverName,
		});

		return data.data;
	} catch (error) {
		console.log(error);
	}
};

export const deleteServer = async (serverId: number) => {
	try {
		await axiosInstance.delete(`/servers/${serverId}`);
	} catch (error) {
		console.log(error);
	}
};

export const editServer = async (serverId: number, payload: unknown) => {
	try {
		await axiosInstance.put(`/servers/${serverId}`, payload);
	} catch (error) {
		console.log(error);
	}
};

export const addUserToServer = async (serverId: number, userId: number) => {
	try {
		await axiosInstance.post(
			`/servers/${serverId}/memberships/${userId}/add`
		);
	} catch (error) {
		console.log(error);
	}
};

export const removeUserFromServer = async (
	serverId: number,
	userId: number
) => {
	try {
		await axiosInstance.delete(
			`/servers/${serverId}/memberships/${userId}/remove`
		);
	} catch (error) {
		console.log(error);
	}
};

export const getAllServerMembers = async (serverId: number) => {
	try {
		const { data } = await axiosInstance.get(
			`/servers/${serverId}/members`
		);

		return data.data;
	} catch (error) {
		console.log(error);
	}
};

export const promoteUserToAdmin = async (
	serverId: number,
	memberId: number
) => {
	try {
		await axiosInstance.put(
			`/servers/${serverId}/memberships/${memberId}/promote`
		);
	} catch (error) {
		console.log(error);
	}
};
