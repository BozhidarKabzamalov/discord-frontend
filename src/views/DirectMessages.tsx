import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { FaUser } from "react-icons/fa";
import {
    useGetConversation,
    useSendDirectMessage,
} from "../services/directMessageService";
import { useGetFriends } from "../services/friendService";
import { useBoundStore } from "../stores/useBoundStore";
import { useDMSocket } from "../hooks/useDMSocket";

const DirectMessages: React.FC = () => {
    const { userId } = useParams();
    const currentUser = useBoundStore((state) => state.authenticatedUser);
    const [messageInput, setMessageInput] = useState("");
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const friendId = parseInt(userId || "0");
    const { data: friendsData } = useGetFriends();
    const { data: conversationData, isLoading } = useGetConversation(friendId);
    const sendMessage = useSendDirectMessage();

    const friend = friendsData?.friends.find((f) => f.id === friendId);
    const messages = conversationData?.messages || [];

    // Use DM socket hook for real-time updates
    useDMSocket();

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    const handleKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === "Enter") {
            event.preventDefault();
            onSubmit();
        }
    };

    const onSubmit = async () => {
        if (!messageInput.trim() || !friendId || !currentUser) return;

        const messageData = {
            content: messageInput.trim(),
            receiverId: friendId,
        };

        try {
            await sendMessage.mutateAsync(messageData);
            setMessageInput("");
        } catch (error) {
            console.error("Failed to send message:", error);
        }
    };

    if (!userId) {
        return (
            <Container>
                <EmptyState>
                    <EmptyStateIcon>
                        <FaUser />
                    </EmptyStateIcon>
                    <EmptyStateTitle>Select a conversation</EmptyStateTitle>
                    <EmptyStateDescription>
                        Choose a friend from the sidebar to start messaging.
                    </EmptyStateDescription>
                </EmptyState>
            </Container>
        );
    }

    if (isLoading) {
        return (
            <Container>
                <LoadingState>Loading messages...</LoadingState>
            </Container>
        );
    }

    return (
        <Container>
            <FriendName>{friend?.username || "Unknown User"}</FriendName>
            <MessagesAndInputContainer>
                <MessagesContainer>
                    {messages.map((message) => {
                        const isOwnMessage =
                            message.senderId === currentUser?.id;
                        return (
                            <MessageContainer key={message.id}>
                                <ProfilePicture>
                                    <FaUser />
                                </ProfilePicture>
                                <Column>
                                    <MessageOwner>
                                        {isOwnMessage
                                            ? "You"
                                            : message.sender.username}
                                    </MessageOwner>
                                    <MessageContent>
                                        {message.content}
                                    </MessageContent>
                                </Column>
                            </MessageContainer>
                        );
                    })}
                    <div ref={messagesEndRef} />
                </MessagesContainer>
                <MessageInput
                    placeholder={`Message ${friend?.username || "user"}`}
                    value={messageInput}
                    onChange={(e) => setMessageInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                />
            </MessagesAndInputContainer>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    background-color: ${({ theme }) => theme.colors.gray1100};
`;

const FriendName = styled.p`
    color: ${({ theme }) => theme.colors.gray100};
    padding: 15px;
    border-bottom: ${({ theme }) => `1px solid ${theme.colors.gray300}`};
`;

const MessagesAndInputContainer = styled.div`
    display: flex;
    flex-direction: column;
    flex: 1;
    padding: 15px;
`;

const MessagesContainer = styled.div`
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    flex: 1;
    margin-bottom: 10px;
    overflow-y: auto;
`;

const MessageContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 10px;
    border-radius: 5px;

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray1200};
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

const MessageInput = styled.input`
    width: 100%;
    border-radius: 8px;
    background-color: ${({ theme }) => theme.colors.gray600};
    border: ${({ theme }) => `1px solid ${theme.colors.gray300}`};
    color: ${({ theme }) => theme.colors.textColor};
    outline: none;
    padding: 20px;
`;

const EmptyState = styled.div`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    padding: 40px;
`;

const EmptyStateIcon = styled.div`
    font-size: 64px;
    color: ${({ theme }) => theme.colors.gray500};
    margin-bottom: 20px;
`;

const EmptyStateTitle = styled.h2`
    color: ${({ theme }) => theme.colors.white};
    font-size: 24px;
    font-weight: 600;
    margin: 0 0 10px 0;
`;

const EmptyStateDescription = styled.p`
    color: ${({ theme }) => theme.colors.gray300};
    font-size: 16px;
    margin: 0;
    line-height: 1.5;
`;

const LoadingState = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: ${({ theme }) => theme.colors.gray300};
    font-size: 18px;
`;

export default DirectMessages;
