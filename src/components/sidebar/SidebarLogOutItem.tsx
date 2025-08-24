import { FaSignOutAlt } from "react-icons/fa";
import styled from "styled-components";
import useAuth from "../../hooks/useAuth";

const SidebarLogOutItem = () => {
	const { logout } = useAuth();

	return (
		<LogoutItem onClick={logout}>
			<FaSignOutAlt />
		</LogoutItem>
	);
};

const LogoutItem = styled.div`
	display: flex;
	align-items: center;
	justify-content: center;
	width: 40px;
	height: 40px;
	border-radius: 10px;
	color: ${({ theme }) => theme.colors.gray100};
	background-color: ${({ theme }) => theme.colors.gray1000};
	cursor: pointer;
	margin-top: 15px;

	&:hover {
		color: ${({ theme }) => theme.colors.white};
		background-color: ${({ theme }) => theme.colors.blue200};
	}
`;

export default SidebarLogOutItem;
