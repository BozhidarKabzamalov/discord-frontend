import styled from "styled-components";
import { useParams } from "react-router";
import { useGetServers } from "../services/serverService";
import ServerMembers from "../components/ServerMembers";
import ServerChannels from "../components/ServerChannels";
import ServerChannelMessages from "../components/ServerChannelMessages";

const Server = () => {
	const { serverId, channelId } = useParams();
	const { data: servers } = useGetServers();

	if (!serverId || !channelId) return;

	const server = servers?.find((server) => server.id === parseInt(serverId));
	const channel = server?.channels.find(
		(channel) => channel.id === parseInt(channelId)
	);

	if (!server || !channel) return;

	return (
		<Container>
			<ServerChannels server={server} />
			<ServerChannelMessages channel={channel} />
			<ServerMembers members={server.members} />
		</Container>
	);
};

const Container = styled.main`
	display: flex;
	flex-direction: row;
	flex: 1;
`;

export default Server;
