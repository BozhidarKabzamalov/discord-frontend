import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router";
import styled from "styled-components";
import { FaUser } from "react-icons/fa";
import {
	useGetConversation,
	useSendDirectMessage,
	DirectMessage,
} from "../services/directMessageService";
import { useGetFriends } from "../services/friendService";
import { useBoundStore } from "../stores/useBoundStore";
import { socket } from "../socket";

const DirectMessages: React.FC = () => {
	const { userId } = useParams();
	const currentUser = useBoundStore((state) => state.authenticatedUser);
	const [messageInput, setMessageInput] = useState("");
	const [messages, setMessages] = useState<DirectMessage[]>([]);
	const messagesEndRef = useRef<HTMLDivElement>(null);

	const friendId = parseInt(userId || "0");
	const { data: friendsData } = useGetFriends();
	const { data: conversationData, isLoading } = useGetConversation(friendId);
	const sendMessage = useSendDirectMessage();

	const friend = friendsData?.friends.find((f) => f.id === friendId);

	useEffect(() => {
		if (conversationData?.messages) {
			setMessages(conversationData.messages);
		}
	}, [conversationData]);

	useEffect(() => {
		if (!socket.connected) {
			socket.connect();
		}

		const handleNewMessage = (data: { directMessage: DirectMessage }) => {
			const message = data.directMessage;

			if (
				(message.senderId === friendId &&
					message.receiverId === currentUser?.id) ||
				(message.receiverId === friendId &&
					message.senderId === currentUser?.id)
			) {
				setMessages((prev) => [...prev, message]);
			}
		};

		socket.on("new_direct_message", handleNewMessage);

		return () => {
			socket.off("new_direct_message", handleNewMessage);
		};
	}, [friendId, currentUser?.id]);

	useEffect(() => {
		scrollToBottom();
	}, [messages]);

	const scrollToBottom = () => {
		messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
	};

	const handleSendMessage = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!messageInput.trim() || !friendId || !currentUser) return;

		const messageData = {
			content: messageInput.trim(),
			receiverId: friendId,
		};

		try {
			const response = await sendMessage.mutateAsync(messageData);
			setMessages((prev) => [...prev, response.directMessage]);
			setMessageInput("");
		} catch (error) {
			console.error("Failed to send message:", error);
		}
	};

	const formatMessageTime = (dateString: string) => {
		const date = new Date(dateString);
		const now = new Date();
		const diffInHours = (now.getTime() - date.getTime()) / (1000 * 60 * 60);

		if (diffInHours < 24) {
			return date.toLocaleTimeString([], {
				hour: "2-digit",
				minute: "2-digit",
			});
		} else {
			return date.toLocaleDateString([], {
				month: "short",
				day: "numeric",
			});
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

			<MessagesContainer>
				<MessagesList>
					{messages.map((message, index) => {
						const isOwnMessage =
							message.senderId === currentUser?.id;
						const showAvatar =
							index === 0 ||
							messages[index - 1].senderId !== message.senderId;
						const showTimestamp =
							index === messages.length - 1 ||
							messages[index + 1].senderId !== message.senderId ||
							new Date(messages[index + 1].createdAt).getTime() -
								new Date(message.createdAt).getTime() >
								300000; // 5 minutes

                            console.log(message);

						return (
							<MessageGroup
								key={message.id}
								$isOwn={isOwnMessage}
							>
								{showAvatar && (
									<MessageAvatar $isOwn={isOwnMessage}>
										<FaUser />
									</MessageAvatar>
								)}
								<MessageContent
									$isOwn={isOwnMessage}
									$hasAvatar={showAvatar}
								>
									{showAvatar && (
										<MessageHeader>
											<MessageAuthor
												$isOwn={isOwnMessage}
											>
												{isOwnMessage
													? "You"
													: message.sender.username}
											</MessageAuthor>
											<MessageTime>
												{formatMessageTime(
													message.createdAt
												)}
											</MessageTime>
										</MessageHeader>
									)}
									<MessageText $isOwn={isOwnMessage}>
										{message.content}
									</MessageText>
									{showTimestamp && !showAvatar && (
										<MessageTime>
											{formatMessageTime(
												message.createdAt
											)}
										</MessageTime>
									)}
								</MessageContent>
							</MessageGroup>
						);
					})}
					<div ref={messagesEndRef} />
				</MessagesList>
			</MessagesContainer>

			<MessageInputContainer>
				<MessageInputForm onSubmit={handleSendMessage}>
					<MessageInput
						type='text'
						placeholder={`Message ${friend?.username || "user"}`}
						value={messageInput}
						onChange={(e) => setMessageInput(e.target.value)}
						disabled={sendMessage.isPending}
					/>
				</MessageInputForm>
			</MessageInputContainer>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	height: 100%;
	background-color: ${({ theme }) => theme.colors.gray800};
`;

const FriendName = styled.p`
	color: ${({ theme }) => theme.colors.gray100};
	padding: 15px;
	border-bottom: ${({ theme }) => `1px solid ${theme.colors.gray300}`};
`;

const MessagesContainer = styled.div`
	flex: 1;
	overflow: hidden;
`;

const MessagesList = styled.div`
	height: 100%;
	overflow-y: auto;
	padding: 20px;
	display: flex;
	flex-direction: column;
	gap: 5px;
`;

const MessageGroup = styled.div<{ $isOwn: boolean }>`
	display: flex;
	align-items: flex-start;
	gap: 15px;
	margin-bottom: 5px;
	flex-direction: ${({ $isOwn }) => ($isOwn ? "row-reverse" : "row")};
`;

const MessageAvatar = styled.div<{ $isOwn: boolean }>`
	width: 32px;
	height: 32px;
	border-radius: 50%;
	background-color: ${({ theme, $isOwn }) =>
		$isOwn ? theme.colors.blue200 : theme.colors.gray600};
	display: flex;
	align-items: center;
	justify-content: center;
	color: white;
	font-size: 14px;
	flex-shrink: 0;
	margin-top: 2px;
`;

const MessageContent = styled.div<{ $isOwn: boolean; $hasAvatar: boolean }>`
	max-width: 70%;
	margin-left: ${({ $hasAvatar, $isOwn }) =>
		!$hasAvatar && !$isOwn ? "47px" : "0"};
	margin-right: ${({ $hasAvatar, $isOwn }) =>
		!$hasAvatar && $isOwn ? "47px" : "0"};
`;

const MessageHeader = styled.div`
	display: flex;
	align-items: center;
	gap: 10px;
	margin-bottom: 5px;
`;

const MessageAuthor = styled.span<{ $isOwn: boolean }>`
	color: ${({ theme, $isOwn }) =>
		$isOwn ? theme.colors.blue200 : theme.colors.white};
	font-weight: 600;
	font-size: 14px;
`;

const MessageTime = styled.span`
	color: ${({ theme }) => theme.colors.gray400};
	font-size: 12px;
`;

const MessageText = styled.div<{ $isOwn: boolean }>`
	background-color: ${({ theme, $isOwn }) =>
		$isOwn ? theme.colors.blue200 : theme.colors.gray700};
	color: ${({ theme }) => theme.colors.white};
	padding: 10px 15px;
	border-radius: 18px;
	word-wrap: break-word;
	line-height: 1.4;
	font-size: 15px;
`;

const MessageInputContainer = styled.div`
	padding: 20px;
	background-color: ${({ theme }) => theme.colors.gray800};
	border-top: 1px solid ${({ theme }) => theme.colors.gray700};
`;

const MessageInputForm = styled.form`
	display: flex;
	gap: 10px;
	align-items: center;
`;

const MessageInput = styled.input`
	flex: 1;
	padding: 12px 16px;
	background-color: ${({ theme }) => theme.colors.gray700};
	border: 1px solid ${({ theme }) => theme.colors.gray600};
	border-radius: 25px;
	color: ${({ theme }) => theme.colors.white};
	font-size: 15px;

	&:focus {
		outline: none;
		border-color: ${({ theme }) => theme.colors.blue200};
	}

	&::placeholder {
		color: ${({ theme }) => theme.colors.gray400};
	}
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
