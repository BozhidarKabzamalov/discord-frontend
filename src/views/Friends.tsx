import React, { useState } from "react";
import styled from "styled-components";
import { FaCheck, FaTimes, FaTrash, FaUser, FaComments } from "react-icons/fa";
import { useNavigate } from "react-router";
import {
    useGetFriends,
    useGetPendingFriendRequests,
    useGetSentFriendRequests,
    useSendFriendRequest,
    useAcceptFriendRequest,
    useRejectFriendRequest,
    useRemoveFriend,
} from "../services/friendService";

type TabType = "all" | "pending" | "add";

const Friends: React.FC = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState<TabType>("all");
    const [addFriendInput, setAddFriendInput] = useState("");
    const [addFriendError, setAddFriendError] = useState("");
    const [addFriendSuccess, setAddFriendSuccess] = useState("");

    const { data: friendsData, isLoading: friendsLoading } = useGetFriends();
    const { data: pendingData, isLoading: pendingLoading } =
        useGetPendingFriendRequests();
    const { data: sentData, isLoading: sentLoading } =
        useGetSentFriendRequests();

    const sendFriendRequest = useSendFriendRequest();
    const acceptFriendRequest = useAcceptFriendRequest();
    const rejectFriendRequest = useRejectFriendRequest();
    const removeFriend = useRemoveFriend();

    const friends = friendsData?.friends || [];
    const pendingRequests = pendingData?.pendingRequests || [];
    const sentRequests = sentData?.sentRequests || [];

    const handleSendFriendRequest = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!addFriendInput.trim()) return;

        setAddFriendError("");
        setAddFriendSuccess("");

        try {
            await sendFriendRequest.mutateAsync({
                username: addFriendInput.trim(),
            });
            setAddFriendSuccess(`Friend request sent to ${addFriendInput}!`);
            setAddFriendInput("");
        } catch (error: any) {
            setAddFriendError(
                error.response?.data?.error || "Failed to send friend request",
            );
        }
    };

    const handleAcceptRequest = async (requestId: number) => {
        try {
            await acceptFriendRequest.mutateAsync(requestId);
        } catch (error) {
            console.error("Failed to accept friend request:", error);
        }
    };

    const handleRejectRequest = async (requestId: number) => {
        try {
            await rejectFriendRequest.mutateAsync(requestId);
        } catch (error) {
            console.error("Failed to reject friend request:", error);
        }
    };

    const handleRemoveFriend = async (friendId: number) => {
        try {
            await removeFriend.mutateAsync(friendId);
        } catch (error) {
            console.error("Failed to remove friend:", error);
        }
    };

    const handleStartConversation = (friendId: number) => {
        navigate(`/channels/@me/${friendId}`);
    };

    const renderTabContent = () => {
        switch (activeTab) {
            case "all":
                return (
                    <FriendsList>
                        <SectionTitle>
                            All Friends — {friends.length}
                        </SectionTitle>
                        {friends.map((friend) => (
                            <FriendItem key={friend.id}>
                                <FriendAvatar>
                                    <FaUser />
                                </FriendAvatar>
                                <FriendInfo>
                                    <FriendName>{friend.username}</FriendName>
                                </FriendInfo>
                                <FriendActions>
                                    <ActionButton
                                        onClick={() =>
                                            handleStartConversation(friend.id)
                                        }
                                        $success
                                        title="Message"
                                    >
                                        <FaComments />
                                    </ActionButton>
                                    <ActionButton
                                        onClick={() =>
                                            handleRemoveFriend(friend.id)
                                        }
                                        $danger
                                        title="Remove Friend"
                                    >
                                        <FaTrash />
                                    </ActionButton>
                                </FriendActions>
                            </FriendItem>
                        ))}
                        {friends.length === 0 && (
                            <EmptyState>
                                You don't have any friends yet.
                            </EmptyState>
                        )}
                    </FriendsList>
                );

            case "pending":
                return (
                    <FriendsList>
                        <SectionTitle>
                            Pending —{" "}
                            {pendingRequests.length + sentRequests.length}
                        </SectionTitle>

                        {pendingRequests.length > 0 && (
                            <>
                                <SubSectionTitle>
                                    Incoming Requests
                                </SubSectionTitle>
                                {pendingRequests.map((request) => (
                                    <FriendItem key={request.id}>
                                        <FriendAvatar>
                                            <FaUser />
                                        </FriendAvatar>
                                        <FriendInfo>
                                            <FriendName>
                                                {request.sender.username}
                                            </FriendName>
                                            <FriendStatus>
                                                Incoming Friend Request
                                            </FriendStatus>
                                        </FriendInfo>
                                        <FriendActions>
                                            <ActionButton
                                                onClick={() =>
                                                    handleAcceptRequest(
                                                        request.id,
                                                    )
                                                }
                                                $success
                                                title="Accept"
                                            >
                                                <FaCheck />
                                            </ActionButton>
                                            <ActionButton
                                                onClick={() =>
                                                    handleRejectRequest(
                                                        request.id,
                                                    )
                                                }
                                                $danger
                                                title="Decline"
                                            >
                                                <FaTimes />
                                            </ActionButton>
                                        </FriendActions>
                                    </FriendItem>
                                ))}
                            </>
                        )}

                        {sentRequests.length > 0 && (
                            <>
                                <SubSectionTitle>
                                    Outgoing Requests
                                </SubSectionTitle>
                                {sentRequests.map((request) => (
                                    <FriendItem key={request.id}>
                                        <FriendAvatar>
                                            <FaUser />
                                        </FriendAvatar>
                                        <FriendInfo>
                                            <FriendName>
                                                {request.receiver.username}
                                            </FriendName>
                                            <FriendStatus>
                                                Outgoing Friend Request
                                            </FriendStatus>
                                        </FriendInfo>
                                    </FriendItem>
                                ))}
                            </>
                        )}

                        {pendingRequests.length === 0 &&
                            sentRequests.length === 0 && (
                                <EmptyState>
                                    No pending friend requests.
                                </EmptyState>
                            )}
                    </FriendsList>
                );

            case "add":
                return (
                    <AddFriendSection>
                        <SectionTitle>Add Friend</SectionTitle>
                        <AddFriendDescription>
                            You can add friends with their username.
                        </AddFriendDescription>
                        <AddFriendForm onSubmit={handleSendFriendRequest}>
                            <AddFriendInput
                                type="text"
                                placeholder="Enter a username"
                                value={addFriendInput}
                                onChange={(e) =>
                                    setAddFriendInput(e.target.value)
                                }
                            />
                            <AddFriendButton
                                type="submit"
                                disabled={sendFriendRequest.isPending}
                            >
                                {sendFriendRequest.isPending
                                    ? "Sending..."
                                    : "Send Friend Request"}
                            </AddFriendButton>
                        </AddFriendForm>
                        {addFriendError && (
                            <ErrorMessage>{addFriendError}</ErrorMessage>
                        )}
                        {addFriendSuccess && (
                            <SuccessMessage>{addFriendSuccess}</SuccessMessage>
                        )}
                    </AddFriendSection>
                );

            default:
                return null;
        }
    };

    if (friendsLoading || pendingLoading || sentLoading) {
        return (
            <Container>
                <LoadingState>Loading friends...</LoadingState>
            </Container>
        );
    }

    return (
        <Container>
            <TabsContainer>
                <Tab
                    $active={activeTab === "all"}
                    onClick={() => setActiveTab("all")}
                >
                    All
                </Tab>
                {pendingRequests.length > 0 && (
                    <Tab
                        $active={activeTab === "pending"}
                        onClick={() => setActiveTab("pending")}
                    >
                        Pending
                        {pendingRequests.length + sentRequests.length > 0 && (
                            <Badge>
                                {pendingRequests.length + sentRequests.length}
                            </Badge>
                        )}
                    </Tab>
                )}
                <Tab
                    $active={activeTab === "add"}
                    onClick={() => setActiveTab("add")}
                >
                    Add Friend
                </Tab>
            </TabsContainer>

            <Content>{renderTabContent()}</Content>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    flex-direction: column;
    height: 100%;
    background-color: ${({ theme }) => theme.colors.gray800};
`;

const TabsContainer = styled.div`
    display: flex;
    padding: 0 20px;
    height: 50px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray300};
`;

const Tab = styled.button<{ $active: boolean }>`
    background: none;
    border: none;
    color: ${({ theme, $active }) =>
        $active ? theme.colors.textColorHover : theme.colors.textColor};
    padding: 15px 20px;
    font-size: 16px;
    font-weight: 500;
    cursor: pointer;
    border-bottom: 2px solid
        ${({ theme, $active }) =>
            $active ? theme.colors.blue200 : "transparent"};
    transition: all 0.2s;
    display: flex;
    align-items: center;
    gap: 8px;

    &:hover {
        color: ${({ theme }) => theme.colors.textColorHover};
    }
`;

const Badge = styled.span`
    background-color: ${({ theme }) => theme.colors.red};
    color: white;
    border-radius: 10px;
    padding: 2px 6px;
    font-size: 12px;
    font-weight: 600;
    min-width: 18px;
    text-align: center;
`;

const Content = styled.div`
    flex: 1;
    padding: 20px;
    overflow-y: auto;
`;

const LoadingState = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    color: ${({ theme }) => theme.colors.gray300};
    font-size: 18px;
`;

const FriendsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const SectionTitle = styled.h2`
    color: ${({ theme }) => theme.colors.textColor};
    font-size: 14px;
    font-weight: 600;
    text-transform: uppercase;
    margin: 0 0 15px 0;
    letter-spacing: 0.5px;
`;

const SubSectionTitle = styled.h3`
    color: ${({ theme }) => theme.colors.textColor};
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    margin: 20px 0 10px 0;
    letter-spacing: 0.5px;
`;

const FriendItem = styled.div`
    display: flex;
    align-items: center;
    padding: 15px;
    background-color: ${({ theme }) => theme.colors.gray700};
    border-radius: 8px;
    transition: background-color 0.2s;

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray600};
    }
`;

const FriendAvatar = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.memberProfileBackground};
    color: ${({ theme }) => theme.colors.memberProfileIcon};
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 18px;
    margin-right: 15px;
`;

const FriendInfo = styled.div`
    flex: 1;
`;

const FriendName = styled.div`
    color: ${({ theme }) => theme.colors.textColor};
    font-weight: 600;
    font-size: 16px;
    margin-bottom: 2px;
`;

const FriendStatus = styled.div`
    color: ${({ theme }) => theme.colors.textColor};
    font-size: 14px;
`;

const FriendActions = styled.div`
    display: flex;
    gap: 10px;
`;

const ActionButton = styled.button<{ $success?: boolean; $danger?: boolean }>`
    width: 36px;
    height: 36px;
    border-radius: 50%;
    border: none;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;

    background-color: ${({ theme, $success, $danger }) => {
        if ($success) return theme.colors.green;
        if ($danger) return theme.colors.red;
        return theme.colors.gray600;
    }};

    color: white;

    &:hover {
        opacity: 0.8;
        transform: scale(1.05);
    }
`;

const EmptyState = styled.div`
    text-align: center;
    color: ${({ theme }) => theme.colors.textColor};
    font-size: 16px;
    padding: 40px 20px;
`;

const AddFriendSection = styled.div`
    max-width: 600px;
`;

const AddFriendDescription = styled.p`
    color: ${({ theme }) => theme.colors.textColor};
    font-size: 16px;
    margin-bottom: 20px;
    line-height: 1.5;
`;

const AddFriendForm = styled.form`
    display: flex;
    gap: 15px;
    margin-bottom: 20px;
`;

const AddFriendInput = styled.input`
    flex: 1;
    padding: 12px 16px;
    background-color: ${({ theme }) => theme.colors.gray600};
    border: ${({ theme }) => `1px solid ${theme.colors.gray300}`};
    color: ${({ theme }) => theme.colors.textColor};
    border-radius: 6px;
    font-size: 16px;
    outline: none;
`;

const AddFriendButton = styled.button`
    background-color: ${({ theme }) => theme.colors.blue200};
    color: white;
    border: none;
    padding: 12px 24px;
    border-radius: 6px;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    transition: background-color 0.2s;

    &:hover:not(:disabled) {
        background-color: ${({ theme }) => theme.colors.blue400};
    }

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

const ErrorMessage = styled.div`
    color: ${({ theme }) => theme.colors.red};
    font-size: 14px;
    padding: 10px;
    background-color: ${({ theme }) => theme.colors.red}20;
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme.colors.red}40;
`;

const SuccessMessage = styled.div`
    color: ${({ theme }) => theme.colors.green};
    font-size: 14px;
    padding: 10px;
    background-color: ${({ theme }) => theme.colors.green}20;
    border-radius: 6px;
    border: 1px solid ${({ theme }) => theme.colors.green}40;
`;

export default Friends;
