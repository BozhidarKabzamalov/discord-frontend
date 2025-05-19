import styled from "styled-components";
import { useGetServers } from "../services/serverService";
import SidebarServerItem from "./SidebarServerItem";
import SidebarCreateServerItem from "./SidebarCreateServerItem";

const Sidebar = () => {
	const { data: servers } = useGetServers();

	return (
		<StyledSidebar>
			{servers &&
				servers.map((server) => (
					<SidebarServerItem key={server.id} server={server} />
				))}
            <SidebarCreateServerItem />
		</StyledSidebar>
	);
};

const StyledSidebar = styled.div`
	width: 72px;
	height: 100%;
	background-color: ${({ theme }) => theme.colors.gray400};
	border-right: ${({ theme }) => `1px solid ${theme.colors.gray300}`};
    padding: 15px;
`;

export default Sidebar;
