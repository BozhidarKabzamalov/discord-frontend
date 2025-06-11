import styled from "styled-components";
import { Server } from "../types/servers";
import Channel from "./Channel";
import { FaFolderPlus, FaPen, FaPlus, FaSignOutAlt, FaTrash } from "react-icons/fa";
import CreateChannelDialog from "./dialogs/CreateChannelDialog.tsx";
import { useBoundStore } from "../stores/useBoundStore.ts";
import { useDeleteCategory } from "../services/categoryService.ts";
import CreateCategoryDialog from "./dialogs/CreateCategoryDialog.tsx";

type MemberProps = {
	server: Server;
};

const ServerMembers = ({ server }: MemberProps) => {
	const { mutate: deleteCategory } = useDeleteCategory();
	const setShowCreateChannelDialog = useBoundStore(
		(state) => state.setShowCreateChannelDialog
	);
	const setShowCreateCategoryDialog = useBoundStore(
		(state) => state.setShowCreateCategoryDialog
	);
	const setChannelCategoryId = useBoundStore(
		(state) => state.setChannelCategoryId
	);

	const onDelete = async (categoryId: number) => {
		deleteCategory({ serverId: server.id, categoryId });
	};

	const serverCategoriesJsx = server.categories.map((category) => {
		return (
			<ServerChannelsContainer key={category.id}>
				<ChannelTypeTitleContainer>
					<ChannelTypeTitle key={`title-${category.name}`}>
						{category.name}
					</ChannelTypeTitle>
					<Actions>
						<CreateAction
							onClick={() => {
								setShowCreateChannelDialog(true);
								setChannelCategoryId(category.id);
							}}
						>
							<FaPlus size='14' />
						</CreateAction>
						<UpdateAction>
							<FaPen />
						</UpdateAction>
						<DeleteAction onClick={() => onDelete(category.id)}>
							<FaTrash size='14' />
						</DeleteAction>
					</Actions>
				</ChannelTypeTitleContainer>
				{category.channels.map((channel) => (
					<Channel key={channel.id} channel={channel} />
				))}
			</ServerChannelsContainer>
		);
	});

	return (
		<Container>
			<ServerNameContainer>
				<ServerName>{server.name}</ServerName>
				<Actions>
					<CreateAction
						onClick={() => setShowCreateCategoryDialog(true)}
					>
						<FaFolderPlus size='14' />
					</CreateAction>
					<UpdateAction>
						<FaPen />
					</UpdateAction>
					<DeleteAction>
						<FaTrash size='14' />
					</DeleteAction>
                    <ExitAction><FaSignOutAlt /></ExitAction>
				</Actions>
			</ServerNameContainer>
			{serverCategoriesJsx}
			<CreateCategoryDialog />
			<CreateChannelDialog />
		</Container>
	);
};

const Container = styled.div`
	width: 300px;
	background-color: ${({ theme }) => theme.colors.gray400};
`;

const ServerNameContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
	padding: 15px 25px;
	color: ${({ theme }) => theme.colors.gray200};
	border-bottom: ${({ theme }) => `1px solid ${theme.colors.gray300}`};

	&:hover {
		color: ${({ theme }) => theme.colors.white};
		background-color: ${({ theme }) => theme.colors.gray1000};
	}
`;

const ServerName = styled.p`
	color: ${({ theme }) => theme.colors.gray100};
	margin-right: auto;
`;

const ChannelTypeTitleContainer = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: space-between;
	align-items: center;
	flex: 1;
	padding: 10px;
	border-radius: 5px;
	color: ${({ theme }) => theme.colors.gray200};

	&:hover {
		color: ${({ theme }) => theme.colors.white};
		background-color: ${({ theme }) => theme.colors.gray1000};
	}
`;

const ServerChannelsContainer = styled.div`
	padding: 15px;
`;

const ChannelTypeTitle = styled.p`
	font-size: 14px;
	font-weight: 500;
`;

const Actions = styled.div`
	display: flex;
	flex-direction: row;
`;

const CreateAction = styled.div`
	margin-right: 10px;
	cursor: pointer;
`;

const UpdateAction = styled.div`
	margin-right: 10px;
	cursor: pointer;
`;

const DeleteAction = styled.div`
	margin-right: 10px;
	cursor: pointer;
`;

const ExitAction = styled.div`
	cursor: pointer;
`;

export default ServerMembers;
