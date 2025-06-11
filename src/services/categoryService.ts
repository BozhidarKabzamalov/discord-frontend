import { useMutation, useQueryClient } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import { Category, Server } from "../types/servers";
import {
	CreateCategoryPayload,
	DeleteCategoryPayload,
	UpdateCategoryPayload,
} from "../types/category";

export const createCategory = async (payload: CreateCategoryPayload) => {
	try {
		const { name, serverId } = payload;

		return await axiosInstance.post(`/servers/${serverId}/categories`, {
			name,
		});
	} catch (error) {
		console.log(error);
	}
};

export const useCreateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: createCategory,
		onSuccess: (response, variables) => {
			const { serverId } = variables;

			if (!response) return;

			const newCategory = response.data.category;

			queryClient.setQueryData<Server[]>(["servers"], (oldServers) => {
				if (!oldServers) {
					return [];
				}

				return oldServers.map((oldServer) => {
					if (oldServer.id === serverId) {
						const updatedCategories = [
							...(oldServer.categories || []),
							newCategory,
						];

						return { ...oldServer, categories: updatedCategories };
					}

					return oldServer;
				});
			});
		},
	});
};

export const deleteCategory = async (payload: DeleteCategoryPayload) => {
	try {
		const { serverId, categoryId } = payload;

		return await axiosInstance.delete(
			`/servers/${serverId}/categories/${categoryId}`
		);
	} catch (error) {
		console.log(error);
	}
};

export const useDeleteCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteCategory,
		onSuccess: (_data, variables) => {
			const { serverId, categoryId } = variables;

			queryClient.setQueryData<Server[]>(["servers"], (oldServers) => {
				if (!oldServers) {
					return [];
				}

				return oldServers.map((server) => {
					if (server.id === serverId) {
						const updatedCategories = server.categories.filter(
							(category: Category) => category.id !== categoryId
						);
						return { ...server, categories: updatedCategories };
					}
					return server;
				});
			});
		},
	});
};

export const updateCategory = async (payload: UpdateCategoryPayload) => {
	const { serverId, categoryId, name } = payload;

	try {
		return await axiosInstance.put(
			`/servers/${serverId}/categories/${categoryId}`,
			{ name }
		);
	} catch (error) {
		console.log(error);
	}
};

export const useUpdateCategory = () => {
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: deleteCategory,
		onSuccess: (_data, variables) => {
			const { serverId, categoryId } = variables;

			queryClient.setQueryData<Server[]>(["servers"], (oldServers) => {
				if (!oldServers) {
					return [];
				}

				return oldServers.map((server) => {
					if (server.id === serverId) {
						const updatedCategories = server.categories.filter(
							(category: Category) => category.id !== categoryId
						);
						return { ...server, categories: updatedCategories };
					}
					return server;
				});
			});
		},
	});
};
