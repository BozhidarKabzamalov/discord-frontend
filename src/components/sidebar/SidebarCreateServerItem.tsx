import { FaPlusCircle } from "react-icons/fa";
import styled from "styled-components";
import { useBoundStore } from "../../stores/useBoundStore";
import CreateServerDialog from "../dialogs/CreateServerDialog";
import EditServerDialog from "../dialogs/EditServerDialog";
import EditCategoryDialog from "../dialogs/EditCategoryDialog";
import EditChannelDialog from "../dialogs/EditChannelDialog";

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
            <EditServerDialog />
            <EditCategoryDialog />
            <EditChannelDialog />
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
    margin-bottom: 15px;

	&:hover {
		color: ${({ theme }) => theme.colors.white};
		background-color: ${({ theme }) => theme.colors.blue200};
	}
`;

export default SidebarCreateServerItem;
