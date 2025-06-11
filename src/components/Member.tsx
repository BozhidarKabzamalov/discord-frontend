import styled from "styled-components";
import { Member as MemberType } from "../types/servers";
import { FaCrown, FaUser } from "react-icons/fa";

type MemberProps = {
	member: MemberType;
};

const Member = ({ member }: MemberProps) => {
	const { username, roleId } = member;
	const isOwner = roleId === 1;

	return (
		<Container>
			<ProfilePicture>
				<FaUser />
			</ProfilePicture>
			<Username>{username}</Username>
			{isOwner && <FaCrown size='20' color='#faa61a' />}
		</Container>
	);
};

const ProfilePicture = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	color: ${({ theme }) => theme.colors.gray1300};
	background-color: ${({ theme }) => theme.colors.gray1400};
	margin-right: 15px;
`;

const Username = styled.p`
	color: ${({ theme }) => theme.colors.gray200};
	margin-right: 15px;
`;

const Container = styled.div`
	display: flex;
	align-items: center;
	margin-bottom: 10px;
    padding: 5px;
    border-radius: 5px;

	&:hover {
		background-color: ${({ theme }) => theme.colors.gray1200};

		${ProfilePicture} {
			color: ${({ theme }) => theme.colors.white};
			background-color: ${({ theme }) => theme.colors.gray500};
		}

		${Username} {
			color: ${({ theme }) => theme.colors.white};
		}
	}
`;

export default Member;
