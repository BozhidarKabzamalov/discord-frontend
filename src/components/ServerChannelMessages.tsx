import { useParams } from "react-router";
import { useGetChannelMessages } from "../services/messagesService";
import styled from "styled-components";
import ChannelMessageInput from "./ChannelMessageInput";
import { Channel } from "../types/servers";
import Message from "./Message";

type MemberProps = {
	channel: Channel;
};

const ServerChannelMessages = ({ channel }: MemberProps) => {
	const { channelId } = useParams();
	const { data: channelMessages } = useGetChannelMessages(channelId);

	if (!channelMessages) return;

	const channelMessagesJsx = channelMessages.map((channelMessage) => (
		<Message key={channelMessage.id} message={channelMessage} />
	));

	return (
		<Container>
			<ChannelName>{channel.name}</ChannelName>
			<ChannelMessagesAndInputContainer>
				<ChannelMessagesContainer>
					{channelMessagesJsx}
				</ChannelMessagesContainer>
				<ChannelMessageInput />
			</ChannelMessagesAndInputContainer>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
`;

const ChannelName = styled.p`
	color: ${({ theme }) => theme.colors.gray100};
	padding: 15px;
	border-bottom: ${({ theme }) => `1px solid ${theme.colors.gray300}`};
`;

const ChannelMessagesAndInputContainer = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	padding: 15px;
`;

const ChannelMessagesContainer = styled.div`
	display: flex;
	flex-direction: column-reverse;
	flex: 1;
`;

export default ServerChannelMessages;
