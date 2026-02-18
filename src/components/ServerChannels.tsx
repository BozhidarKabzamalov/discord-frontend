import styled from "styled-components";
import { Server } from "../types/servers";
import Channel from "./Channel";
import { FaPen, FaPlus, FaSignOutAlt, FaTrash } from "react-icons/fa";
import CreateChannelDialog from "./dialogs/CreateChannelDialog.tsx";
import { useBoundStore } from "../stores/useBoundStore.ts";
import { useDeleteCategory } from "../services/categoryService.ts";
import CreateCategoryDialog from "./dialogs/CreateCategoryDialog.tsx";
import { useDeleteServer } from "../services/serverService.ts";
import { useLeaveServer } from "../services/membershipService.ts";

type MemberProps = {
    server: Server;
};

const ServerMembers = ({ server }: MemberProps) => {
    const { mutate: deleteCategory } = useDeleteCategory();
    const { mutate: deleteServer } = useDeleteServer();
    const { mutate: leaveServer } = useLeaveServer();
    const authenticatedUser = useBoundStore((state) => state.authenticatedUser);
    const authenticatedUserMembership = server.members.find((member) => {
        return member.id === authenticatedUser!.id;
    });

    const isAuthenticatedUserOwner = authenticatedUserMembership?.roleId === 1;
    const isAuthenticatedUserAdmin = authenticatedUserMembership?.roleId === 2;

    const isAuthenticatedUserOwnerOrAdmin =
        isAuthenticatedUserOwner || isAuthenticatedUserAdmin;
    const setShowCreateChannelDialog = useBoundStore(
        (state) => state.setShowCreateChannelDialog,
    );
    const setShowCreateCategoryDialog = useBoundStore(
        (state) => state.setShowCreateCategoryDialog,
    );
    const setChannelCategoryId = useBoundStore(
        (state) => state.setChannelCategoryId,
    );
    const setShowEditServerDialog = useBoundStore(
        (state) => state.setShowEditServerDialog,
    );
    const setServerId = useBoundStore((state) => state.setServerId);
    const setShowEditCategoryDialog = useBoundStore(
        (state) => state.setShowEditCategoryDialog,
    );

    const onDeleteCategory = async (categoryId: number) => {
        deleteCategory({ serverId: server.id, categoryId });
    };

    const onDeleteServer = () => {
        deleteServer(server.id);
    };

    const onLeaveServer = () => {
        leaveServer(server.id);
    };

    const serverCategoriesJsx = server.categories.map((category) => {
        return (
            <ServerChannelsContainer key={category.id}>
                <ChannelTypeTitleContainer>
                    <ChannelTypeTitle key={`title-${category.name}`}>
                        {category.name}
                    </ChannelTypeTitle>
                    {isAuthenticatedUserOwnerOrAdmin && (
                        <Actions>
                            <CreateAction
                                onClick={() => {
                                    setShowCreateChannelDialog(true);
                                    setChannelCategoryId(category.id);
                                }}
                            >
                                <FaPlus />
                            </CreateAction>
                            <UpdateAction
                                onClick={() => {
                                    setShowEditCategoryDialog(true);
                                    setChannelCategoryId(category.id);
                                }}
                            >
                                <FaPen />
                            </UpdateAction>
                            <DeleteAction
                                onClick={() => onDeleteCategory(category.id)}
                            >
                                <FaTrash />
                            </DeleteAction>
                        </Actions>
                    )}
                </ChannelTypeTitleContainer>
                {category.channels.map((channel) => (
                    <Channel
                        key={channel.id}
                        server={server}
                        channel={channel}
                    />
                ))}
            </ServerChannelsContainer>
        );
    });

    return (
        <Container>
            <ServerNameContainer>
                <ServerName>{server.name}</ServerName>
                {isAuthenticatedUserOwnerOrAdmin && (
                    <Actions>
                        <ExitAction onClick={onLeaveServer}>
                            <FaSignOutAlt />
                        </ExitAction>
                        <CreateAction
                            onClick={() => setShowCreateCategoryDialog(true)}
                        >
                            <FaPlus />
                        </CreateAction>
                        <UpdateAction
                            onClick={() => {
                                setShowEditServerDialog(true);
                                setServerId(server.id);
                            }}
                        >
                            <FaPen />
                        </UpdateAction>
                        <DeleteAction onClick={onDeleteServer}>
                            <FaTrash />
                        </DeleteAction>
                    </Actions>
                )}
            </ServerNameContainer>
            {serverCategoriesJsx}
            <CreateCategoryDialog />
            <CreateChannelDialog />
        </Container>
    );
};

const Container = styled.div`
    width: 300px;
    background-color: ${({ theme }) => theme.colors.gray400};
`;

const ServerNameContainer = styled.div`
    display: flex;
    flex-direction: row;
    align-items: center;
    padding: 15px 25px;
    color: ${({ theme }) => theme.colors.textColor};
    border-bottom: ${({ theme }) => `1px solid ${theme.colors.gray300}`};

    &:hover {
        color: ${({ theme }) => theme.colors.textColorHover};
        background-color: ${({ theme }) => theme.colors.gray1000};
    }
`;

const ServerName = styled.p`
    color: ${({ theme }) => theme.colors.gray100};
    margin-right: auto;
`;

const ChannelTypeTitleContainer = styled.div`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
    flex: 1;
    padding: 10px;
    border-radius: 5px;
    color: ${({ theme }) => theme.colors.textColor};

    &:hover {
        color: ${({ theme }) => theme.colors.textColorHover};
        background-color: ${({ theme }) => theme.colors.gray1000};
    }
`;

const ServerChannelsContainer = styled.div`
    padding: 15px;
`;

const ChannelTypeTitle = styled.p`
    font-size: 14px;
    font-weight: 500;
`;

const Actions = styled.div`
    display: flex;
    flex-direction: row;
`;

const CreateAction = styled.div`
    margin-left: 10px;
    cursor: pointer;
`;

const UpdateAction = styled.div`
    margin-left: 10px;
    cursor: pointer;
`;

const DeleteAction = styled.div`
    margin-left: 10px;
    cursor: pointer;
`;

const ExitAction = styled.div`
    cursor: pointer;
`;

export default ServerMembers;
