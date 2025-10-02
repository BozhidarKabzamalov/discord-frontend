import styled from "styled-components";
import {
	ChannelType as ChannelTypeEnum,
	Channel as ChannelType,
	Server,
} from "../types/servers";
import { FaHashtag, FaPen, FaTrash, FaVolumeDown } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import { useDeleteChannel } from "../services/channelService";
import { useBoundStore } from "../stores/useBoundStore";

type ChannelProps = {
	server: Server;
	channel: ChannelType;
};

const Channel = ({ channel, server }: ChannelProps) => {
	const navigate = useNavigate();
	const { serverId, channelId } = useParams();
	const { id, name, type } = channel;
	const isTextType = type === ChannelTypeEnum.TEXT;
	const authenticatedUser = useBoundStore((state) => state.authenticatedUser);
	const authenticatedUserMembership = server.members.find((member) => {
		return member.id === authenticatedUser!.id;
	});

	const isAuthenticatedUserOwner = authenticatedUserMembership?.roleId === 1;
	const isAuthenticatedUserAdmin = authenticatedUserMembership?.roleId === 2;

	const isAuthenticatedUserOwnerOrAdmin =
		isAuthenticatedUserOwner || isAuthenticatedUserAdmin;
	const { mutate: deleteChannel } = useDeleteChannel({
		onSuccess: () => {
			if (channel.id === parseInt(channelId!))
				navigate(`/channels/${serverId}`);
		},
	});
	const setShowEditChannelDialog = useBoundStore(
		(state) => state.setShowEditChannelDialog
	);
	const setChannelId = useBoundStore((state) => state.setChannelId);

	const handleChannelClick = () => {
		const url = `/channels/${serverId}/${
			isTextType ? "text" : "voice"
		}/${id}`;

		navigate(url);
	};

	const handleOnDelete = (event) => {
		event.stopPropagation();

		deleteChannel({ serverId: parseInt(serverId!), channelId: id });
	};

	return (
		<Container onClick={handleChannelClick}>
			{isTextType ? <FaHashtag size='18' /> : <FaVolumeDown size='18' />}
			<ChannelName>{name}</ChannelName>
			{isAuthenticatedUserOwnerOrAdmin && (
				<Actions>
					<UpdateAction
						onClick={() => {
							setChannelId(id);
							setShowEditChannelDialog(true);
						}}
					>
						<FaPen />
					</UpdateAction>
					<DeleteAction onClick={handleOnDelete}>
						<FaTrash />
					</DeleteAction>
				</Actions>
			)}
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 15px;
	padding: 10px;
	border-radius: 5px;
	color: ${({ theme }) => theme.colors.textColor};
	cursor: pointer;

	&:hover {
		color: ${({ theme }) => theme.colors.textColorHover};
		background-color: ${({ theme }) => theme.colors.gray1000};
	}

	&:last-child {
		margin-bottom: 0px;
	}
`;

const ChannelName = styled.p`
	margin-left: 15px;
	font-weight: 700;
`;

const Actions = styled.div`
	display: flex;
	flex-direction: row;
	margin-left: auto;
`;

const UpdateAction = styled.div`
	cursor: pointer;
`;

const DeleteAction = styled.div`
	margin-left: 10px;
	cursor: pointer;
`;

export default Channel;
