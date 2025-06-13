import styled from "styled-components";
import { Outlet } from "react-router";
import Sidebar from "../components/sidebar/Sidebar";

const Dashboard = () => {
	return (
		<Container>
			<Main>
				<Sidebar />
				<Outlet />
			</Main>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	min-height: 100vh;
	max-height: 100vh;
`;

const Main = styled.div`
	display: flex;
	flex-direction: row;
	flex: 1;
	min-height: 100vh;
	max-height: 100vh;
	background-color: ${({ theme }) => theme.colors.gray1100};
`;

export default Dashboard;
