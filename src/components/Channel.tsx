import styled from "styled-components";
import {
	ChannelType as ChannelTypeEnum,
	Channel as ChannelType,
} from "../types/servers";
import { FaHashtag, FaVolumeDown } from "react-icons/fa";
import theme from "../theme.ts";
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
		navigate(`/channels/${serverId}/${id}`);
	};

	return (
		<Container onClick={handleChannelClick}>
			{isTextType ? (
				<FaHashtag size='18' color={theme.colors.gray200} />
			) : (
				<FaVolumeDown size='18' color={theme.colors.gray200} />
			)}
			<ChannelName>{name}</ChannelName>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 15px;

    &:last-child {
        margin-bottom: 0px;
    }
`;

const ChannelName = styled.p`
	color: ${({ theme }) => theme.colors.gray200};
	margin-left: 15px;
	font-weight: 700;
`;

export default Channel;
