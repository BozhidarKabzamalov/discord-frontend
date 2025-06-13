import styled from "styled-components";
import { Member as MemberType, Server } from "../types/servers";
import {
	FaArrowAltCircleDown,
	FaArrowAltCircleUp,
	FaCrown,
	FaGripfire,
	FaTimes,
	FaUser,
} from "react-icons/fa";
import { useBoundStore } from "../stores/useBoundStore";
import {
	useDemoteAdmin,
	useKickUser,
	usePromoteMember,
} from "../services/membershipService";

type MemberProps = {
	server: Server;
	member: MemberType;
};

const Member = ({ member, server }: MemberProps) => {
	const { mutate: promoteMember } = usePromoteMember();
	const { mutate: demoteAdmin } = useDemoteAdmin();
	const { mutate: kickUser } = useKickUser();
	const { id, username, roleId } = member;
	const isMemberOwner = roleId === 1;
	const isMemberAdmin = roleId === 2;
	const authenticatedUser = useBoundStore((state) => state.authenticatedUser);
	const authenticatedUserMembership = server.members.find((member) => {
		return member.id === authenticatedUser!.id;
	});

	const isAuthenticatedUserOwner = authenticatedUserMembership?.roleId === 1;
	const isAuthenticatedUserAdmin = authenticatedUserMembership?.roleId === 2;

	const isAuthenticatedUserOwnerOrAdmin =
		isAuthenticatedUserOwner || isAuthenticatedUserAdmin;

    const isAuthenticatedUserAndMemberTheSame = authenticatedUser!.id === id;

	return (
		<Container>
			<ProfilePicture>
				<FaUser />
			</ProfilePicture>
			<Username>{username}</Username>
			{isMemberOwner && (
				<AdminOwnerIconContainer>
					<FaCrown color='#faa61a' />
				</AdminOwnerIconContainer>
			)}
			{isMemberAdmin && (
				<AdminOwnerIconContainer>
					<FaGripfire color='#faa61a' />
				</AdminOwnerIconContainer>
			)}
			{isAuthenticatedUserOwnerOrAdmin && (
				<Actions>
					{isAuthenticatedUserOwner && !isMemberOwner && (
						<>
							{!isMemberAdmin ? (
								<PromoteAction
									onClick={() =>
										promoteMember({
											serverId: server.id,
											userId: id,
										})
									}
								>
									<FaArrowAltCircleUp />
								</PromoteAction>
							) : (
								<DemoteAction
									onClick={() =>
										demoteAdmin({
											serverId: server.id,
											userId: id,
										})
									}
								>
									<FaArrowAltCircleDown />
								</DemoteAction>
							)}
						</>
					)}
					{isAuthenticatedUserOwnerOrAdmin &&
						!isMemberOwner &&
						!isAuthenticatedUserAndMemberTheSame && (
							<KickAction
								onClick={() =>
									kickUser({
										serverId: server.id,
										userId: id,
									})
								}
							>
								<FaTimes />
							</KickAction>
						)}
				</Actions>
			)}
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
	color: ${({ theme }) => theme.colors.gray200};

	&:hover {
		color: ${({ theme }) => theme.colors.white};
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

const Actions = styled.div`
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	margin-left: auto;
`;

const KickAction = styled.div`
	cursor: pointer;
`;

const PromoteAction = styled.div`
	margin-right: 5px;
	cursor: pointer;
`;

const DemoteAction = styled.div`
	margin-right: 5px;
	cursor: pointer;
`;

const AdminOwnerIconContainer = styled.div`
	margin-right: 5px;
`;

export default Member;
