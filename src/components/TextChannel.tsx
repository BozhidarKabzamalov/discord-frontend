import { useGetChannelMessages } from "../services/messageService";
import styled from "styled-components";
import ChannelMessageInput from "./ChannelMessageInput";
import Message from "./Message";
import { useParams } from "react-router";
import { useGetServers } from "../services/serverService";
import { useSocket } from "../hooks/useSocket";

const TextChannel = () => {
    const { serverId, channelId } = useParams();
    const { data: servers } = useGetServers();

    const server = servers?.find((server) => server.id === parseInt(serverId));

    const channel = server?.categories
        .flatMap((category) => category.channels || [])
        .find((channel) => channel.id === parseInt(channelId));

    const { data: channelMessages } = useGetChannelMessages(channelId);

    useSocket(channelId);

    const channelMessagesJsx = channelMessages?.map((channelMessage) => (
        <Message key={channelMessage.id} message={channelMessage} />
    ));

    return (
        <Container>
            <ChannelName>{channel?.name}</ChannelName>
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
    background-color: ${({ theme }) => theme.colors.gray1100};
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
    margin-bottom: 10px;
`;

export default TextChannel;
