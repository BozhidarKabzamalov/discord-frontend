import { FunctionComponent } from "react";
import styled from "styled-components";
import { Server } from "../types/servers";
import { Link } from "react-router";

type Props = {
	server: Server;
};

const SidebarItem: FunctionComponent<Props> = ({ server }) => {
    const { id, name, channels } = server;
    const url = `/channels/${id}/${channels[0].id}`;

	return (
		<StyledLink to={url}>
			<StyledSidebarItem>{name.charAt(0)}</StyledSidebarItem>
		</StyledLink>
	);
};

const StyledSidebarItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background-color: #3d3d45;
	color: #dfdfe2;
`;

const StyledLink = styled(Link)`
    display: flex;
    justify-content: center;
    align-items: center;
`

export default SidebarItem;
