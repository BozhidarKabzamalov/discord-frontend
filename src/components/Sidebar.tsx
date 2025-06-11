import styled from "styled-components";
import { useGetServers } from "../services/serverService";
import SidebarServerItem from "./SidebarServerItem";
import SidebarCreateServerItem from "./SidebarCreateServerItem";
import SidebarJoinServerItem from "./SidebarJoinServerItem";
import { FaSignOutAlt } from "react-icons/fa";
import useAuth from "../hooks/useAuth";
import SidebarLanguageSwitcherItem from "./SidebarLanguageSwitcherItem";

const Sidebar = () => {
	const { data: servers } = useGetServers();
    const { logout } = useAuth();

	return (
		<StyledSidebar>
			{servers &&
				servers.map((server) => (
					<SidebarServerItem key={server.id} server={server} />
				))}
			<SidebarCreateServerItem />
			<SidebarJoinServerItem />
            <SidebarLanguageSwitcherItem />
			<LogoutItem onClick={logout}>
				<FaSignOutAlt />
			</LogoutItem>
		</StyledSidebar>
	);
};

const StyledSidebar = styled.div`
    display: flex;
    flex-direction: column;
	width: 72px;
	height: 100%;
	background-color: ${({ theme }) => theme.colors.gray400};
	border-right: ${({ theme }) => `1px solid ${theme.colors.gray300}`};
    padding: 15px;
`;

const LogoutItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	border-radius: 10px;
	color: ${({ theme }) => theme.colors.gray100};
	background-color: ${({ theme }) => theme.colors.gray1000};
    cursor: pointer;
    margin-top: 15px;

	&:hover {
		color: ${({ theme }) => theme.colors.white};
		background-color: ${({ theme }) => theme.colors.blue200};
	}
`;

export default Sidebar;
