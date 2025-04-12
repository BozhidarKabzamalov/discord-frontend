import { FunctionComponent } from "react";
import styled from "styled-components";
import { Server } from "../types/servers";
import { Link } from "react-router";

type Props = {
	server: Server;
};

const SidebarItem: FunctionComponent<Props> = ({ server }) => {
	return (
		<Link to='/channels/2/3'>
			<StyledSidebarItem>{server.name.charAt(0)}</StyledSidebarItem>
		</Link>
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

export default SidebarItem;
