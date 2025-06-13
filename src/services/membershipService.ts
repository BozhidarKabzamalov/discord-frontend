import {
	useMutation,
	useQueryClient,
} from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import { Server } from "../types/servers";
import { useNavigate } from "react-router";
import {
	DemoteAdminPayload,
	KickUserPayload,
	PromoteMemberPayload,
} from "../types/membership";

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

export const leaveServer = async (serverId: number) => {
	try {
		return await axiosInstance.post(`/servers/${serverId}/leave`);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const useLeaveServer = () => {
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: leaveServer,
		onSuccess: (_data, serverId) => {
			navigate("/");
			queryClient.setQueryData<Server[]>(["servers"], (oldServers) => {
				if (!oldServers) {
					return [];
				}

				return oldServers.filter((server) => server.id !== serverId);
			});
		},
	});
};

export const promoteMember = async (payload: PromoteMemberPayload) => {
	const { serverId, userId } = payload;

	try {
		return await axiosInstance.patch(
			`/servers/${serverId}/members/${userId}/promote`
		);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const usePromoteMember = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: promoteMember,
		onSuccess: (_data, variables) => {
			const { serverId, userId } = variables;

			queryClient.setQueryData<Server[]>(["servers"], (oldServers) => {
				if (!oldServers) {
					return [];
				}

				return oldServers.map((server) => {
					if (server.id !== serverId) return server;

					const updatedMembers = server.members.map((member) => {
						if (member.id !== userId) {
							return member;
						}

						return {
							...member,
							roleId: 2,
						};
					});

					return {
						...server,
						members: updatedMembers,
					};
				});
			});
		},
	});
};

export const demoteAdmin = async (payload: DemoteAdminPayload) => {
	const { serverId, userId } = payload;

	try {
		return await axiosInstance.patch(
			`/servers/${serverId}/members/${userId}/demote`
		);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const useDemoteAdmin = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: demoteAdmin,
		onSuccess: (_data, variables) => {
			const { serverId, userId } = variables;

			queryClient.setQueryData<Server[]>(["servers"], (oldServers) => {
				if (!oldServers) {
					return [];
				}

				return oldServers.map((server) => {
					if (server.id !== serverId) return server;

					const updatedMembers = server.members.map((member) => {
						if (member.id !== userId) {
							return member;
						}

						return {
							...member,
							roleId: 3,
						};
					});

					return {
						...server,
						members: updatedMembers,
					};
				});
			});
		},
	});
};

export const kickUser = async (payload: KickUserPayload) => {
	const { serverId, userId } = payload;

	const { data } = await axiosInstance.delete(
		`/servers/${serverId}/members/${userId}`
	);

	return data;
};

export const useKickUser = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: kickUser,
		onSuccess: (_data, variables) => {
			const { serverId, userId } = variables;

			queryClient.setQueryData<Server[]>(["servers"], (oldServers) => {
				if (!oldServers) {
					return [];
				}

				return oldServers.map((server) => {
					if (server.id !== serverId) return server;

					if (server.id === serverId) {
						const updatedMembers = server.members.filter(
							(member) => member.id !== userId
						);

						return {
							...server,
							members: updatedMembers,
						};
					}

					return server;
				});
			});
		},
	});
};
