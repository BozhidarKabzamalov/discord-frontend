import styled from "styled-components";
import CustomDialog from "./CustomDialog";
import { useState } from "react";
import Input from "../Input";
import { useBoundStore } from "../../stores/useBoundStore";
import { useCreateServer } from "../../services/serverService";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";

const CreateServerDialog = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const showCreateServerDialog = useBoundStore(
		(state) => state.showCreateServerDialog
	);
	const setShowCreateServerDialog = useBoundStore(
		(state) => state.setShowCreateServerDialog
	);
	const { mutate: createServer } = useCreateServer();

	const [serverName, setServerName] = useState<string>("");

	if (!showCreateServerDialog) return;

	const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setServerName(e.target.value);
	};

	const onConfirm = async () => {
		createServer(serverName, {
			onSuccess: (response) => {
				const newServer = response.data.server;
				navigate(
					`/channels/${newServer.id}/${newServer.channels[0].id}`
				);
			},
		});
		setServerName("");
		setShowCreateServerDialog(false);
	};

	const onCancel = () => {
		setServerName("");
		setShowCreateServerDialog(false);
	};

	const title = <Title>{t("dashboard.createServer")}</Title>;
	const body = (
		<Body>
			<Input
				label={t("dashboard.serverName")}
				id='serverName'
				name='serverName'
				type='text'
				value={serverName}
				onChange={onChangeHandler}
				required
			/>
		</Body>
	);
	const actions = (
		<Actions>
			<CancelButton onClick={onCancel}>{t("common.cancel")}</CancelButton>
			<ConfirmButton onClick={onConfirm}>
				{t("dashboard.createServer")}
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

export default CreateServerDialog;
