import styled from "styled-components";
import { Member as MemberType, Server } from "../types/servers";
import Member from "./Member";
import { useTranslation } from "react-i18next";

type MemberProps = {
    server: Server;
};

const ServerMembers = ({ server }: MemberProps) => {
    const { members } = server;
    const { t } = useTranslation();
    const owners = members.filter((member) => member.roleId === 1);
    const admins = members.filter((member) => member.roleId === 2);
    const regularMembers = members.filter(
        (member) => member.roleId !== 1 && member.roleId !== 2,
    );

    const sortByName = (a: MemberType, b: MemberType) =>
        a.username.localeCompare(b.username);

    owners.sort(sortByName);
    admins.sort(sortByName);
    regularMembers.sort(sortByName);

    const renderMembers = (memberList: MemberType[]) => {
        return memberList.map((member) => (
            <Member key={member.id} server={server} member={member} />
        ));
    };

    return (
        <Container>
            <Title>{t("dashboard.members")}</Title>
            <MembersContainer>
                {owners.length > 0 && (
                    <RoleGroup>
                        <GroupTitle>Owner — {owners.length}</GroupTitle>
                        {renderMembers(owners)}
                    </RoleGroup>
                )}
                {admins.length > 0 && (
                    <RoleGroup>
                        <GroupTitle>Admins — {admins.length}</GroupTitle>
                        {renderMembers(admins)}
                    </RoleGroup>
                )}
                {regularMembers.length > 0 && (
                    <RoleGroup>
                        <GroupTitle>
                            Members — {regularMembers.length}
                        </GroupTitle>
                        {renderMembers(regularMembers)}
                    </RoleGroup>
                )}
            </MembersContainer>
        </Container>
    );
};

const Container = styled.div`
    width: 300px;
    background-color: ${({ theme }) => theme.colors.gray1100};
    border-left: ${({ theme }) => `1px solid ${theme.colors.gray300}`};
`;

const Title = styled.p`
    color: ${({ theme }) => theme.colors.gray100};
    padding: 15px;
    border-bottom: ${({ theme }) => `1px solid ${theme.colors.gray300}`};
`;

const MembersContainer = styled.div`
    padding: 15px;
`;

const RoleGroup = styled.div`
    margin-bottom: 20px;
`;

const GroupTitle = styled.h4`
    color: ${({ theme }) => theme.colors.gray200};
    font-size: 0.8rem;
    font-weight: 700;
    text-transform: uppercase;
    margin-bottom: 10px;
`;

export default ServerMembers;
