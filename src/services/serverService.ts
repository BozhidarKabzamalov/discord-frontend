import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import { EditServerPayload, Server } from "../types/servers";
import { useNavigate } from "react-router";

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
    const navigate = useNavigate();

	return useMutation({
		mutationFn: (serverName: string) => createServer(serverName),
		onSuccess: (response) => {
			const newServer = response.data.server;
            navigate(`/channels/${newServer.id}`)
			queryClient.setQueryData<Server[]>(
				["servers"],
				(oldServers = []) => [...oldServers, newServer]
			);
		},
	});
};

export const deleteServer = async (serverId: number) => {
	try {
		return await axiosInstance.delete(`/servers/${serverId}`);
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const useDeleteServer = () => {
    const navigate = useNavigate();
    const queryClient = useQueryClient();

    return useMutation({
		mutationFn: deleteServer,
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

export const editServer = async (payload: EditServerPayload) => {
	const { name, serverId } = payload;

	try {
		return await axiosInstance.put(`/servers/${serverId}`, { name });
	} catch (error) {
		console.log(error);
		throw error;
	}
};

export const useEditServer = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: editServer,
		onSuccess: (_data, variables) => {
            const { name, serverId } = variables;

			queryClient.setQueryData<Server[]>(["servers"], (oldServers) => {
				if (!oldServers) {
					return [];
				}

				return oldServers.map((server) => {
                    if (server.id !== serverId) return server;

                    return {...server, name }
                })
			});
		},
	});
};
