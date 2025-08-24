import styled from "styled-components";
import { Message as MessageType } from "../types/servers";
import { FaTrash, FaUser } from "react-icons/fa";
import { useDeleteChannelMessage } from "../services/messageService";
import { useParams } from "react-router";
import { useGetServers } from "../services/serverService";
import { useBoundStore } from "../stores/useBoundStore";

type MessageProps = {
	message: MessageType;
};

const Message = ({ message }: MessageProps) => {
	const { serverId, channelId } = useParams();
	const { id, content, user } = message;
	const { mutate: deleteMessage } = useDeleteChannelMessage();
	const { data: servers } = useGetServers();
	const server = servers?.find((server) => server.id === parseInt(serverId!));
	const authenticatedUser = useBoundStore((state) => state.authenticatedUser);
	const authenticatedUserMembership = server!.members.find((member) => {
		return member.id === authenticatedUser!.id;
	});

	const isAuthenticatedUserOwner = authenticatedUserMembership?.roleId === 1;
	const isAuthenticatedUserAdmin = authenticatedUserMembership?.roleId === 2;

	const isAuthenticatedUserOwnerOrAdmin =
		isAuthenticatedUserOwner || isAuthenticatedUserAdmin;

	const isAuthenticatedUserMessageCreator = authenticatedUser!.id === user.id;

	return (
		<Container>
			<ProfilePicture>
				<FaUser />
			</ProfilePicture>
			<Column>
				<MessageOwner>{user.username}</MessageOwner>
				<MessageContent>{content}</MessageContent>
			</Column>
			{(isAuthenticatedUserMessageCreator ||
				isAuthenticatedUserOwnerOrAdmin) && (
				<Actions>
					<DeleteAction
						onClick={() =>
							deleteMessage({
								channelId: parseInt(channelId!),
								messageId: id,
							})
						}
					>
						<FaTrash size='20' />
					</DeleteAction>
				</Actions>
			)}
		</Container>
	);
};

const Actions = styled.div`
	opacity: 0;
	margin-left: auto;
`;

const Container = styled.div`
	display: flex;
	align-items: center;
	padding: 10px;
	border-radius: 5px;

	&:hover {
		background-color: ${({ theme }) => theme.colors.gray1200};

		${Actions} {
			opacity: 1;
			visibility: visible;
		}
	}
`;

const Column = styled.div`
	display: flex;
	flex-direction: column;
`;

const ProfilePicture = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	color: ${({ theme }) => theme.colors.white};
	background-color: ${({ theme }) => theme.colors.gray1400};
	margin-right: 15px;
`;

const MessageOwner = styled.p`
	color: ${({ theme }) => theme.colors.gray100};
	margin-bottom: 5px;
`;

const MessageContent = styled.p`
	color: ${({ theme }) => theme.colors.gray100};
`;

const DeleteAction = styled.div`
	color: ${({ theme }) => theme.colors.red100};
`;

export default Message;
