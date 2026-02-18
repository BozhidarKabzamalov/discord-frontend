import styled from "styled-components";
import { useGetServers } from "../../services/serverService";
import SidebarServerItem from "./SidebarServerItem";
import SidebarDMItem from "./SidebarDMItem";
import SidebarCreateServerItem from "./SidebarCreateServerItem";
import SidebarJoinServerItem from "./SidebarJoinServerItem";
import SidebarLanguageSwitcherItem from "./SidebarLanguageSwitcherItem";
import SidebarThemeSwitcherItem from "./SidebarThemeSwitcherItem";
import SidebarLogOutItem from "./SidebarLogOutItem";

const Sidebar = () => {
    const { data: servers } = useGetServers();

    return (
        <StyledSidebar>
            <SidebarDMItem />
            {servers &&
                servers.map((server) => (
                    <SidebarServerItem key={server.id} server={server} />
                ))}
            <SidebarCreateServerItem />
            <SidebarJoinServerItem />
            <SidebarLanguageSwitcherItem />
            <SidebarThemeSwitcherItem />
            <SidebarLogOutItem />
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

export default Sidebar;
