import { FunctionComponent } from "react";
import styled from "styled-components";
import { Server } from "../types/servers";
import { Link } from "react-router";

type Props = {
	server: Server;
};

const SidebarItem: FunctionComponent<Props> = ({ server }) => {
    const { id, name } = server;
    const url = `/channels/${id}`;

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
	border-radius: 10px;
	color: ${({ theme }) => theme.colors.gray100};
	background-color: ${({ theme }) => theme.colors.gray1000};

	&:hover {
		color: ${({ theme }) => theme.colors.white};
		background-color: ${({ theme }) => theme.colors.blue200};
	}
`;

const StyledLink = styled(Link)`
	display: flex;
	justify-content: center;
	align-items: center;
	margin-bottom: 15px;
`;

export default SidebarItem;
