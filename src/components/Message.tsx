import styled from "styled-components";
import { Message as MessageType } from "../types/servers";

type MessageProps = {
	message: MessageType;
};

const Message = ({ message }: MessageProps) => {
    const { content, user } = message;

	return (
		<Container>
			<ProfilePicture />
			<Column>
				<MessageOwner>{user.username}</MessageOwner>
				<MessageContent>{content}</MessageContent>
			</Column>
		</Container>
	);
};

const Container = styled.div`
    display: flex;
    align-items: center;
    margin-bottom: 20px;
`;

const Column = styled.div`
    display: flex;
    flex-direction: column;
`

const ProfilePicture = styled.div`
	width: 40px;
	height: 40px;
	border-radius: 50%;
	background-color: ${({ theme }) => theme.colors.gray400};
	margin-right: 15px;
`;

const MessageOwner = styled.p`
	color: ${({theme}) => theme.colors.white};
    margin-bottom: 5px;
`;

const MessageContent = styled.p`
	color: ${({ theme }) => theme.colors.gray100};
`;

export default Message;
