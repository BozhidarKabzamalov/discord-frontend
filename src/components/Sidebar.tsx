import styled from "styled-components";
import { useGetUserServers } from "../services/serverService";
import SidebarServerItem from "./SidebarServerItem";

const Sidebar = () => {
    const { data: servers } = useGetUserServers();

	return (
		<StyledSidebar>
			{servers &&
				servers.map((server) => <SidebarServerItem key={server.id} server={server} />)}
		</StyledSidebar>
	);
};

const StyledSidebar = styled.div`
	width: 72px;
	height: 100%;
	background-color: #2d2d32;
`;

export default Sidebar;
