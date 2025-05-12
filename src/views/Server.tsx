import styled from "styled-components";
import Message from "../components/Message";
import Channel from "../components/Channel";
import { useParams } from "react-router";
import { useGetChannelMessages } from "../services/messagesService";
import { useGetServers } from "../services/serverService";
import Member from "../components/Member";
import ChannelMessageInput from "../components/ChannelMessageInput";
import { ChannelType } from "../types/servers";

const Server = () => {
	const { serverId, channelId } = useParams();
	const { data: servers } = useGetServers();
	const { data: channelMessages } = useGetChannelMessages(channelId);

    if (!serverId || !channelId) return;

	const server = servers?.find((server) => server.id === parseInt(serverId));
	const channel = server?.channels.find((channel) => channel.id === parseInt(channelId));

	if (!server || !channel || !channelMessages) return;

    const textServerChannels = server.channels.filter(
		(channel) => channel.type === ChannelType.Text
    );

    console.log("wtf", textServerChannels);

    const voiceServerChannels = server.channels.filter(
		(channel) => channel.type === ChannelType.Voice
	);

	const textServerChannelsJsx = textServerChannels.map((channel) => (
		<Channel channel={channel} />
	));

    const voiceServerChannelsJsx = voiceServerChannels.map((channel) => (
		<Channel channel={channel} />
	));

	const channelMessagesJsx = channelMessages.map((channelMessage) => (
		<Message message={channelMessage} />
	));

	const serverMembersJsx = server.members.map((member) => (
		<Member member={member} />
	));

	return (
		<Container>
			<LeftColumn>
				<ServerAndChannelName>{server.name}</ServerAndChannelName>
				<ServerChannelsContainer>
					{textServerChannelsJsx}
					{voiceServerChannelsJsx}
				</ServerChannelsContainer>
			</LeftColumn>
			<RightColumn>
				<ServerAndChannelName>{channel.name}</ServerAndChannelName>
				<Container>
					<ChannelMessagesAndInputContainer>
						<ChannelMessagesContainer>
							{channelMessagesJsx}
						</ChannelMessagesContainer>
						<ChannelMessageInput />
					</ChannelMessagesAndInputContainer>
					<ServerMembersContainer>
						{serverMembersJsx}
					</ServerMembersContainer>
				</Container>
			</RightColumn>
		</Container>
	);
};

const Container = styled.main`
	display: flex;
	flex-direction: row;
	flex: 1;
`;

const LeftColumn = styled.div`
	width: 300px;
	background-color: ${({ theme }) => theme.colors.gray400};
`;

const RightColumn = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
`;

const ServerAndChannelName = styled.p`
	color: ${({ theme }) => theme.colors.gray100};
	padding: 15px;
	border-bottom: ${({ theme }) => `1px solid ${theme.colors.gray300}`};
`;

const ServerChannelsContainer = styled.div`
	padding: 15px;
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

const ServerMembersContainer = styled.div`
	width: 265px;
	padding: 20px;
	border-left: ${({ theme }) => `1px solid ${theme.colors.gray300}`};
`;

export default Server;
