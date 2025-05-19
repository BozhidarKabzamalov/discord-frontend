import axiosInstance from "../axiosInstance";

export const createServerChannel = async (serverId: number, payload: any) => {
	try {
		const { data } = await axiosInstance.post(
			`/servers/${serverId}/channels`,
			payload
		);

		return data.data;
	} catch (error) {
		console.log(error);
	}
};
