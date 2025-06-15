import styled from "styled-components";
import CustomDialog from "./CustomDialog";
import { useState } from "react";
import Input from "../Input";
import { useParams } from "react-router";
import { useBoundStore } from "../../stores/useBoundStore";
import { useUpdateChannel } from "../../services/channelService";
import { useTranslation } from "react-i18next";

const EditChannelDialog = () => {
	const { t } = useTranslation();
	const { mutate: updateChannel } = useUpdateChannel();
	const showEditChannelDialog = useBoundStore(
		(state) => state.showEditChannelDialog
	);
	const setShowEditChannelDialog = useBoundStore(
		(state) => state.setShowEditChannelDialog
	);
	const channelId = useBoundStore((state) => state.channelId);
	const { serverId } = useParams();
	const [channelName, setChannelName] = useState<string>("");

	if (!showEditChannelDialog) return;

	const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setChannelName(e.target.value);
	};

	const onConfirm = async () => {
		const payload = {
			name: channelName,
			serverId: parseInt(serverId!),
			channelId: channelId!,
		};

		updateChannel(payload);
		setShowEditChannelDialog(false);
		setChannelName("");
	};

	const onCancel = () => {
		setChannelName("");
		setShowEditChannelDialog(false);
	};

	const title = <Title>{t("dashboard.editChannel")}</Title>;
	const body = (
		<Body>
			<Input
				label={t("dashboard.channelName")}
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
				{t("dashboard.editChannel")}
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

export default EditChannelDialog;
