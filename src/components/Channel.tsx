import styled from "styled-components";
import {
	ChannelType as ChannelTypeEnum,
	Channel as ChannelType,
} from "../types/servers";
import { FaHashtag, FaTrash, FaVolumeDown } from "react-icons/fa";
import { useNavigate, useParams } from "react-router";

type ChannelProps = {
	channel: ChannelType;
};

const Channel = ({ channel }: ChannelProps) => {
	const navigate = useNavigate();
	const { serverId } = useParams<{ serverId: string; channelId: string }>();
	const { id, name, type } = channel;
	const isTextType = type === ChannelTypeEnum.TEXT;

	const handleChannelClick = () => {
		if (isTextType) {
			navigate(`/channels/${serverId}/${id}`);
		}
	};

	return (
		<Container onClick={handleChannelClick}>
			{isTextType ? <FaHashtag size='18' /> : <FaVolumeDown size='18' />}
			<ChannelName>{name}</ChannelName>
			<DeleteAction>
				<FaTrash size='14' />
			</DeleteAction>
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

const DeleteAction = styled.div`
	margin-left: auto;
	cursor: pointer;
`;

export default Channel;
