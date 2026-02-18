import React from "react";
import { useNavigate, useParams } from "react-router";
import styled from "styled-components";
import { FaUser } from "react-icons/fa";
import { useGetFriends } from "../services/friendService";

const DMSidebar: React.FC = () => {
    const navigate = useNavigate();
    const { userId } = useParams();
    const { data: friendsData, isLoading: friendsLoading } = useGetFriends();

    const friends = friendsData?.friends || [];

    const handleFriendsClick = () => {
        navigate("/channels/@me");
    };

    const handleConversationClick = (friendId: number) => {
        navigate(`/channels/@me/${friendId}`);
    };

    return (
        <Container>
            <FriendsButton onClick={handleFriendsClick} $active={!userId}>
                <FriendsText>Friends</FriendsText>
            </FriendsButton>

            {friends.length > 0 && (
                <SectionContainer>
                    <SectionTitle>Direct Messages</SectionTitle>

                    {friendsLoading ? (
                        <LoadingText>Loading friends...</LoadingText>
                    ) : (
                        <FriendsList>
                            {friends.slice(0, 10).map((friend) => (
                                <FriendItem
                                    key={friend.id}
                                    onClick={() =>
                                        handleConversationClick(friend.id)
                                    }
                                >
                                    <FriendAvatar>
                                        <FaUser />
                                    </FriendAvatar>

                                    <FriendName>{friend.username}</FriendName>
                                </FriendItem>
                            ))}
                        </FriendsList>
                    )}
                </SectionContainer>
            )}
        </Container>
    );
};

const Container = styled.div`
    width: 300px;
    display: flex;
    flex-direction: column;
    height: 100vh;
    background-color: ${({ theme }) => theme.colors.gray400};
`;

const SectionContainer = styled.div`
    padding: 16px 8px;
    border-bottom: 1px solid ${({ theme }) => theme.colors.gray700};

    &:last-child {
        border-bottom: none;
        flex: 1;
        overflow-y: auto;
    }
`;

const SectionTitle = styled.h3`
    color: ${({ theme }) => theme.colors.textColor};
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    margin: 0 0 8px 8px;
    letter-spacing: 0.5px;
`;

const FriendsButton = styled.button<{ $active: boolean }>`
    height: 50px;
    width: 100%;
    display: flex;
    align-items: center;
    padding: 15px;
    background-color: ${({ theme, $active }) =>
        $active ? theme.colors.gray700 : "transparent"};
    border: none;
    cursor: pointer;
    border-bottom: ${({ theme }) => `1px solid ${theme.colors.gray300}`};

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray700};
    }
`;

const FriendsText = styled.p`
    color: ${({ theme }) => theme.colors.gray100};
`;

const FriendsList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
`;

const FriendItem = styled.button`
    width: 100%;
    display: flex;
    align-items: center;
    padding: 6px 8px;
    background: none;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.2s;
    text-align: left;

    &:hover {
        background-color: ${({ theme }) => theme.colors.gray1000};
    }
`;

const FriendAvatar = styled.div`
    position: relative;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.colors.memberProfileBackground};
    display: flex;
    align-items: center;
    justify-content: center;
    color: ${({ theme }) => theme.colors.memberProfileIcon};
    font-size: 12px;
    margin-right: 8px;
    flex-shrink: 0;
`;

const FriendName = styled.span`
    color: ${({ theme }) => theme.colors.textColor};
    font-size: 13px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
`;

const LoadingText = styled.div`
    color: ${({ theme }) => theme.colors.gray400};
    font-size: 13px;
    text-align: center;
    padding: 16px 8px;
`;

export default DMSidebar;
