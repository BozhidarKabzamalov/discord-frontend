import styled from "styled-components";
import { Member as MemberType } from "../types/servers";
import Member from "./Member";
import { useTranslation } from "react-i18next";

type MemberProps = {
	members: MemberType[];
};

const ServerMembers = ({ members }: MemberProps) => {
	const { t } = useTranslation();
	const serverMembersJsx = members.map((member) => (
		<Member key={member.id} member={member} />
	));

	return (
		<Container>
			<Title>{t("dashboard.members")}</Title>
			<MembersContainer>{serverMembersJsx}</MembersContainer>
		</Container>
	);
};

const Container = styled.div`
	width: 265px;
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

export default ServerMembers;
