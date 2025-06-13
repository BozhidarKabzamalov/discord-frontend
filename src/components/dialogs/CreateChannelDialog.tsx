import styled from "styled-components";
import CustomDialog from "./CustomDialog";
import { useState } from "react";
import Input from "../Input";
import { useParams } from "react-router";
import { useBoundStore } from "../../stores/useBoundStore";
import { useCreateChannel } from "../../services/channelService";
import { CreateChannelPayload } from "../../types/channel";
import { useTranslation } from "react-i18next";

const CreateServerChannelDialog = () => {
	const { t } = useTranslation();
	const { mutate: createChannel } = useCreateChannel();
	const channelCategoryId = useBoundStore((state) => state.channelCategoryId);
	const showCreateChannelDialog = useBoundStore(
		(state) => state.showCreateChannelDialog
	);
	const setShowCreateChannelDialog = useBoundStore(
		(state) => state.setShowCreateChannelDialog
	);
	const { serverId } = useParams();
	const [channelType, setChannelType] = useState<"text" | "voice">("text");
	const [channelName, setChannelName] = useState<string>("");

	if (!showCreateChannelDialog) return;

	const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setChannelName(e.target.value);
	};

	const onConfirm = async () => {
		const payload: CreateChannelPayload = {
			name: channelName,
			type: channelType,
			serverId: parseInt(serverId!),
			categoryId: channelCategoryId,
		};
		createChannel(payload);
		setShowCreateChannelDialog(false);
        setChannelName("");
	};

	const onCancel = () => {
		setShowCreateChannelDialog(false);
	};

	const title = <Title>{t("dashboard.createChannel")}</Title>;
	const body = (
		<Body>
			<Input
				label='Channel Name'
				id='channelName'
				name='channelName'
				type='text'
				value={channelName}
				onChange={onChangeHandler}
				required
			/>
		</Body>
	);
	const actions = (
		<Actions>
			<CancelButton onClick={onCancel}>{t("common.cancel")}</CancelButton>
			<ConfirmButton onClick={onConfirm}>
				{t("dashboard.createChannel")}
			</ConfirmButton>
		</Actions>
	);

	return (
		<CustomDialog
			title={title}
			body={body}
			actions={actions}
			onConfirm={onConfirm}
			onCancel={onCancel}
		/>
	);
};

const Body = styled.div``;

const Title = styled.p`
	color: ${({ theme }) => theme.colors.gray100};
	font-size: 20px;
	font-weight: 500;
	margin-bottom: 20px;
	text-align: center;
`;

const Actions = styled.div`
	display: flex;
	justify-content: flex-end;
`;

const ConfirmButton = styled.button`
	color: ${({ theme }) => theme.colors.white};
	background-color: ${({ theme }) => theme.colors.blue200};
	border: ${({ theme }) => `1px solid ${theme.colors.blue400}`};
	padding: 10px;
	border-radius: 5px;
	margin-left: 20px;
	font-weight: 500;
	cursor: pointer;

	&:hover {
		background-color: ${({ theme }) => theme.colors.blue400};
	}
`;

const CancelButton = styled.button`
	color: ${({ theme }) => theme.colors.blue100};
	background-color: transparent;
	padding: 10px;
	border-radius: 5px;
	font-weight: 500;
	cursor: pointer;
`;

const ChannelTypeTextOption = styled.div`
	background-color: ${({ theme }) => theme.colors.gray700};
`;

const ChannelTypeVoiceOption = styled.div`
	background-color: ${({ theme }) => theme.colors.gray700};
`;

export default CreateServerChannelDialog;
