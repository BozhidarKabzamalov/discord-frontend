import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import { Server } from "../types/servers";

export const getServers = async () => {
	try {
		const { data } = await axiosInstance.get<{ servers: Server[] }>(
			"/servers"
		);

		return data.servers;
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const useGetServers = () => {
	return useQuery({
		queryKey: ["servers"],
		queryFn: () => getServers(),
	});
};

export const createServer = async (serverName: string) => {
	try {
		return await axiosInstance.post("/servers", {
			name: serverName,
		});
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const useCreateServer = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (serverName: string) => createServer(serverName),
		onSuccess: (response) => {
			const newServer = response.data.server;

			queryClient.setQueryData<Server[]>(
				["servers"],
				(oldServers = []) => [...oldServers, newServer]
			);
		},
	});
};

export const joinServer = async (inviteCode: string) => {
	try {
		return await axiosInstance.post(`/servers/join/${inviteCode}`);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const useJoinServer = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (invideCode: string) => joinServer(invideCode),
		onSuccess: (response) => {
			const newServer = response.data.server;

			queryClient.setQueryData<Server[]>(
				["servers"],
				(oldServers = []) => [...oldServers, newServer]
			);
		},
	});
};

export const deleteServer = async (serverId: number) => {
	try {
		await axiosInstance.delete(`/servers/${serverId}`);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const editServer = async (serverId: number, payload: unknown) => {
	try {
		await axiosInstance.put(`/servers/${serverId}`, payload);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const addUserToServer = async (serverId: number, userId: number) => {
	try {
		await axiosInstance.post(
			`/servers/${serverId}/memberships/${userId}/add`
		);
	} catch (error) {
		console.log(error);
		throw error;
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
		throw error;
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
		throw error;
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
		throw error;
	}
};
