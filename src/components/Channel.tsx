import styled from "styled-components";
import { Channel as ChannelType } from "../types/servers";

type ChannelProps = {
	channel: ChannelType;
};

const Channel = ({ channel }: ChannelProps) => {
	const { name } = channel;

	return (
		<Container>
			<ChannelName>{name}</ChannelName>
		</Container>
	);
};

const Container = styled.div`
    margin-bottom: 15px;
`;

const ChannelName = styled.p`
	color: ${({ theme }) => theme.colors.gray200};
    font-weight: 500;
`;

export default Channel;
