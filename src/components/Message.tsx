import styled from "styled-components";
import { Message as MessageType } from "../types/servers";
import { FaTrash, FaUser } from "react-icons/fa";

type MessageProps = {
	message: MessageType;
};

const Message = ({ message }: MessageProps) => {
    const { content, user } = message;

	return (
		<Container>
			<ProfilePicture>
                <FaUser />
            </ProfilePicture>
			<Column>
				<MessageOwner>{user.username}</MessageOwner>
				<MessageContent>{content}</MessageContent>
			</Column>
			<Actions>
				<DeleteAction>
					<FaTrash size="20" />
				</DeleteAction>
			</Actions>
		</Container>
	);
};

const Actions = styled.div`
	opacity: 0;
	margin-left: auto;
`;

const Container = styled.div`
	display: flex;
	align-items: center;
	padding: 10px;
	border-radius: 5px;

	&:hover {
		background-color: ${({ theme }) => theme.colors.gray1200};

		${Actions} {
			opacity: 1;
			visibility: visible;
		}
	}
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
`

const ProfilePicture = styled.div`
	display: flex;
	justify-content: center;
	align-items: center;
	width: 40px;
	height: 40px;
	border-radius: 50%;
	color: ${({ theme }) => theme.colors.white};
	background-color: ${({ theme }) => theme.colors.gray1400};
	margin-right: 15px;
`;

const MessageOwner = styled.p`
	color: ${({theme}) => theme.colors.white};
    margin-bottom: 5px;
`;

const MessageContent = styled.p`
	color: ${({ theme }) => theme.colors.gray100};
`;

const DeleteAction = styled.div`
	color: ${({ theme }) => theme.colors.red100};
`;

export default Message;
