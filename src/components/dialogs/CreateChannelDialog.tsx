import styled from "styled-components";
import CustomDialog from "./CustomDialog";
import { useState } from "react";
import Input from "../Input";
import { useParams } from "react-router";
import { useBoundStore } from "../../stores/useBoundStore";
import { useCreateChannel } from "../../services/channelService";
import { CreateChannelPayload, ChannelType } from "../../types/channel";
import { useTranslation } from "react-i18next";

const CreateChannelDialog = () => {
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
	const [channelType, setChannelType] = useState<ChannelType>(
		ChannelType.TEXT
	);
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
		setChannelName("");
		setShowCreateChannelDialog(false);
	};

	const title = <Title>{t("dashboard.createChannel")}</Title>;
	const body = (
		<Body>
			<ChannelTypeSelector>
				<ChannelTypeLabel>
					{t("dashboard.channelType")}
				</ChannelTypeLabel>
				<ChannelTypeOptions>
					<ChannelTypeOption
						$isSelected={channelType === ChannelType.TEXT}
						onClick={() => setChannelType(ChannelType.TEXT)}
					>
						<ChannelTypeIcon>#</ChannelTypeIcon>
						<ChannelTypeText>
							{t("dashboard.textChannel")}
						</ChannelTypeText>
					</ChannelTypeOption>
					<ChannelTypeOption
						$isSelected={channelType === ChannelType.VOICE}
						onClick={() => setChannelType(ChannelType.VOICE)}
					>
						<ChannelTypeIcon>🔊</ChannelTypeIcon>
						<ChannelTypeText>
							{t("dashboard.voiceChannel")}
						</ChannelTypeText>
					</ChannelTypeOption>
				</ChannelTypeOptions>
			</ChannelTypeSelector>
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

const ChannelTypeSelector = styled.div`
	margin-bottom: 20px;
`;

const ChannelTypeLabel = styled.label`
	display: block;
	color: ${({ theme }) => theme.colors.gray100};
	font-size: 14px;
	font-weight: 500;
	margin-bottom: 8px;
`;

const ChannelTypeOptions = styled.div`
	display: flex;
	gap: 12px;
`;

const ChannelTypeOption = styled.div<{ $isSelected: boolean }>`
	display: flex;
	align-items: center;
	padding: 12px 16px;
	border-radius: 8px;
	cursor: pointer;
	border: 2px solid
		${({ theme, $isSelected }) =>
			$isSelected ? theme.colors.blue200 : theme.colors.gray600};
	background-color: ${({ theme, $isSelected }) =>
		$isSelected ? theme.colors.blue200 + "20" : theme.colors.gray700};
	transition: all 0.2s ease;

	&:hover {
		border-color: ${({ theme }) => theme.colors.blue200};
		background-color: ${({ theme }) => theme.colors.blue200 + "10"};
	}
`;

const ChannelTypeIcon = styled.span`
	font-size: 18px;
	margin-right: 8px;
	color: ${({ theme }) => theme.colors.gray100};
`;

const ChannelTypeText = styled.span`
	color: ${({ theme }) => theme.colors.gray100};
	font-size: 14px;
	font-weight: 500;
`;

export default CreateChannelDialog;
