import { useState } from "react";
import styled from "styled-components";
import { createChannelMessage } from "../services/messageService";
import { useParams } from "react-router";

const ServerMessageInput = () => {
	const [content, setContent] = useState("");
	const { channelId } = useParams();

	const handleKeyDown = (event) => {
		if (event.key === "Enter") {
			event.preventDefault();
			onSubmit();
		}
	};

	const onSubmit = async () => {
		if (content.trim() === "") return;

		createChannelMessage({ channelId, content });

		setContent("");
	};

	return (
		<StyledMessageInput
			value={content}
			onChange={(event) => setContent(event.target.value)}
			onKeyDown={handleKeyDown}
		/>
	);
};

const StyledMessageInput = styled.input`
	width: 100%;
	border-radius: 8px;
	background-color: ${({ theme }) => theme.colors.gray600};
	border: ${({ theme }) => `1px solid ${theme.colors.gray300}`};
	color: ${({ theme }) => theme.colors.textColor};
	outline: none;
	padding: 20px;
`;

export default ServerMessageInput;
