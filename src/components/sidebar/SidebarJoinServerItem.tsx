import { FaSearch } from "react-icons/fa";
import styled from "styled-components";
import { useBoundStore } from "../../stores/useBoundStore";
import JoinServerDialog from "../dialogs/JoinServerDialog";

const SidebarJoinServerItem = () => {
	const setShowJoinServerDialog = useBoundStore(
		(state) => state.setShowJoinServerDialog
	);
	return (
		<>
			<Container onClick={() => setShowJoinServerDialog(true)}>
				<FaSearch />
			</Container>
			<JoinServerDialog />
		</>
	);
};

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	border-radius: 10px;
	background-color: ${({ theme }) => theme.colors.gray1000};
	color: ${({ theme }) => theme.colors.gray100};
	cursor: pointer;

	&:hover {
		color: ${({ theme }) => theme.colors.white};
		background-color: ${({ theme }) => theme.colors.blue200};
	}
`;

export default SidebarJoinServerItem;
