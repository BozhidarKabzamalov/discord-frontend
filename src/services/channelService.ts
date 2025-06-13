import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import { CreateChannelPayload, DeleteChannelPayload } from "../types/channel";
import { Server } from "../types/servers";

export const createChannel = async (payload: CreateChannelPayload) => {
	const { name, type, serverId, categoryId } = payload;

	try {
		return await axiosInstance.post(
			`/servers/${serverId}/categories/${categoryId}/channels`,
			{ name, type }
		);
	} catch (error) {
		console.log(error);
	}
};

export const useCreateChannel = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createChannel,
		onSuccess: (response, variables) => {
			const { serverId, categoryId } = variables;

			if (!response) return;

			const newChannel = response.data.channel;

			queryClient.setQueryData<Server[]>(["servers"], (oldServers) => {
				if (!oldServers) {
					return [];
				}

				return oldServers.map((server) => {
					if (server.id !== serverId) return server;

					const updatedCategories = server.categories.map(
						(category) => {
							if (category.id !== categoryId) {
								return category;
							}

							return {
								...category,
								channels: [...category.channels, newChannel],
							};
						}
					);

					return {
						...server,
						categories: updatedCategories,
					};
				});
			});
		},
	});
};

export const deleteChannel = async (payload: DeleteChannelPayload) => {
	try {
		const { serverId, channelId } = payload;

		return await axiosInstance.delete(
			`/servers/${serverId}/channels/${channelId}`
		);
	} catch (error) {
		console.log(error);
	}
};

interface UseDeleteServerOptions {
	onSuccess?: () => void;
}

export const useDeleteChannel = (options: UseDeleteServerOptions = {}) => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteChannel,
		onSuccess: (_data, variables) => {
			const { serverId, channelId } = variables;

			queryClient.setQueryData<Server[]>(["servers"], (oldServers) => {
				if (!oldServers) {
					return [];
				}

				return oldServers.map((server) => {
					if (server.id !== serverId) {
						return server;
					}

					return {
						...server,
						categories: server.categories.map((category) => {
							const channelExistsInCategory =
								category.channels.some(
									(channel) => channel.id === channelId
								);

							if (!channelExistsInCategory) {
								return category;
							}

							return {
								...category,
								channels: category.channels.filter(
									(channel) => channel.id !== channelId
								),
							};
						}),
					};
				});
			});

			if (options.onSuccess) {
				options.onSuccess();
			}
		},
	});
};
