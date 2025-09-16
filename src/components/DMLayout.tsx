import styled from "styled-components";
import { Outlet } from "react-router";
import DMSidebar from "./DMSidebar";

const DMLayout = () => {
	return (
		<Container>
			<DMSidebar />
			<Content>
				<Outlet />
			</Content>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
    flex: 1;
	height: 100vh;
	background-color: ${({ theme }) => theme.colors.gray800};
`;

const Content = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
`;

export default DMLayout;
