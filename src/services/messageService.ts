import { useQuery } from "@tanstack/react-query";
import axiosInstance from "../axiosInstance";
import { Message } from "../types/servers";

export const getChannelMessages = async (channelId: number) => {
	try {
		const { data } = await axiosInstance.get<{ messages: Message[] }>(
			`/channels/${channelId}/messages`
		);

		return data.messages;
	} catch (error) {
		console.log(error);
        throw error;
	}
};

export const useGetChannelMessages = (channelId: number) => {
	return useQuery({
		queryKey: ["channelMessages", channelId],
		queryFn: () => getChannelMessages(channelId),
	});
};

export const createChannelMessage = async (channelId: number, content: number) => {
	try {
		const { data } = await axiosInstance.post(
			`/channels/${channelId}/messages`,
			{ content }
		);

		return data.message;
	} catch (error) {
		console.log(error);
        throw error;
	}
};
