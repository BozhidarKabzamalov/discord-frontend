import styled from "styled-components";
import { Member as MemberType } from "../types/servers";
import { FaCrown } from "react-icons/fa";

type MemberProps = {
	member: MemberType;
};

const Member = ({ member }: MemberProps) => {
	const { username, roleId } = member;
    const isOwner = roleId === 1;

	return (
		<Container>
			<ProfilePicture />
			<Username>{username}</Username>
			{isOwner && <FaCrown size='20' color='#faa61a' />}
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 20px;
`;

const ProfilePicture = styled.div`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background-color: ${({ theme }) => theme.colors.gray400};
	margin-right: 15px;
`;

const Username = styled.p`
	color: ${({ theme }) => theme.colors.gray200};
    margin-right: 15px;
`;

export default Member;
