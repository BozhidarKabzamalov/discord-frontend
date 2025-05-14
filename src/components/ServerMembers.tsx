import styled from "styled-components";
import { Member as MemberType } from "../types/servers";
import Member from "./Member";

type MemberProps = {
	members: MemberType[];
};

const ServerMembers = ({ members }: MemberProps) => {
	const serverMembersJsx = members.map((member) => (
		<Member key={member.id} member={member} />
	));

	return (
		<Container>
			<Title>Members</Title>
			<MembersContainer>{serverMembersJsx}</MembersContainer>
		</Container>
	);
};

const Container = styled.div`
	width: 265px;
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

export default ServerMembers;
