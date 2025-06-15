import styled from "styled-components";
import {
	ChannelType as ChannelTypeEnum,
	Channel as ChannelType,
} from "../types/servers";
import { FaHashtag, FaPen, FaTrash, FaVolumeDown } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";
import { useDeleteChannel } from "../services/channelService";
import { useBoundStore } from "../stores/useBoundStore";

type ChannelProps = {
	channel: ChannelType;
};

const Channel = ({ channel }: ChannelProps) => {
	const navigate = useNavigate();
	const { serverId, channelId } = useParams();
	const { id, name, type } = channel;
	const isTextType = type === ChannelTypeEnum.TEXT;
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
		if (isTextType) {
			navigate(`/channels/${serverId}/${id}`);
		}
	};

	const handleOnDelete = (event) => {
		event.stopPropagation();

		deleteChannel({ serverId: parseInt(serverId!), channelId: id });
	};

	return (
		<Container onClick={handleChannelClick}>
			{isTextType ? <FaHashtag size='18' /> : <FaVolumeDown size='18' />}
			<ChannelName>{name}</ChannelName>
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
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 15px;
	padding: 10px;
	border-radius: 5px;
	color: ${({ theme }) => theme.colors.gray200};
	cursor: pointer;

	&:hover {
		color: ${({ theme }) => theme.colors.white};
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
