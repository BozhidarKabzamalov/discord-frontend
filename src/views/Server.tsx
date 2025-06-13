import styled from "styled-components";
import { Outlet, useParams } from "react-router";
import { useGetServers } from "../services/serverService";
import ServerMembers from "../components/ServerMembers";
import ServerChannels from "../components/ServerChannels";

const Server = () => {
	const { serverId } = useParams();
	const { data: servers } = useGetServers();
	const server = servers?.find((server) => server.id === parseInt(serverId));

    if (!server) return;

	return (
		<Container>
			<ServerChannels server={server} />
            <Outlet />
			<ServerMembers server={server} />
		</Container>
	);
};

const Container = styled.main`
	display: flex;
	flex-direction: row;
	flex: 1;
`;

export default Server;
