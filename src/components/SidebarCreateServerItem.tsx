import { FaPlusCircle } from "react-icons/fa";
import styled from "styled-components";
import { useBoundStore } from "../stores/useBoundStore";
import CreateServerDialog from "./dialogs/CreateServerDialog";

const SidebarCreateServerItem = () => {
	const setShowCreateServerDialog = useBoundStore(
		(state) => state.setShowCreateServerDialog
	);
	return (
		<>
			<Container onClick={() => setShowCreateServerDialog(true)}>
				<FaPlusCircle />
			</Container>
			<CreateServerDialog />
		</>
	);
};

const Container = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background-color: #3d3d45;
	color: #dfdfe2;
	cursor: pointer;
`;

export default SidebarCreateServerItem;
