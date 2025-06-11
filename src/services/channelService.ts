import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import { CreateChannelPayload } from "../types/channel";
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

            console.log('WTF', newChannel);

			queryClient.setQueryData<Server[]>(["servers"], (oldServers) => {
				if (!oldServers) {
					return [];
				}

				const hehe = oldServers.map((server) => {
					if (server.id !== serverId) return server;

					const updatedCategories = server.categories.map(
						(category) => {
							if (category.id !== categoryId) {
								return category;
							}

							return {
								...category,
								channels: [
									...category.channels,
									newChannel,
								],
							};
						}
					);

					return {
						...server,
						categories: updatedCategories,
					};
				});

                console.log(hehe)

                return hehe;
			});
		},
	});
};
