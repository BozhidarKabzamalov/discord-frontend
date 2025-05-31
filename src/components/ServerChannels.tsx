import styled from "styled-components";
import { Server } from "../types/servers";
import Channel from "./Channel";
import { FaPlus } from "react-icons/fa";
import theme from "../theme.ts";
import CreateServerChannelDialog from "./dialogs/CreateServerChannelDialog.tsx";
import { useBoundStore } from "../stores/useBoundStore.ts";

type MemberProps = {
	server: Server;
};

const ServerMembers = ({ server }: MemberProps) => {
    const setShowCreateServerChannelDialog = useBoundStore(
		(state) => state.setShowCreateServerChannelDialog
	);

	const serverChannelsJsx = server.categories.map((category) => {
		return (
			category.channels.length > 0 && (
				<ServerChannelsContainer key={category.id}>
					<ChannelTypeTitleContainer>
						<ChannelTypeTitle key={`title-${category.name}`}>
							{category.name}
						</ChannelTypeTitle>
						<FaPlus
							size='14'
							color={theme.colors.gray200}
							onClick={() =>
								setShowCreateServerChannelDialog(true)
							}
						/>
					</ChannelTypeTitleContainer>
					{category.channels.map((channel) => (
						<Channel key={channel.id} channel={channel} />
					))}
				</ServerChannelsContainer>
			)
		);
	});

	return (
		<Container>
			<ServerName>{server.name}</ServerName>
			{serverChannelsJsx}
            <CreateServerChannelDialog />
		</Container>
	);
};

const Container = styled.div`
	width: 300px;
	background-color: ${({ theme }) => theme.colors.gray400};
`;

const ChannelTypeTitleContainer = styled.div`
	display: flex;
	flex-direction: row;
	align-items: center;
    justify-content: space-between;
	flex: 1;
    margin-bottom: 15px;
`;

const ServerName = styled.p`
	color: ${({ theme }) => theme.colors.gray100};
	padding: 15px;
	border-bottom: ${({ theme }) => `1px solid ${theme.colors.gray300}`};
`;

const ServerChannelsContainer = styled.div`
	padding: 15px;
`;

const ChannelTypeTitle = styled.p`
	font-size: 14px;
	font-weight: 500;
	color: ${({ theme }) => theme.colors.gray200};
`;

export default ServerMembers;
