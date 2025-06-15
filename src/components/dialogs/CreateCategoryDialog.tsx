import styled from "styled-components";
import CustomDialog from "./CustomDialog";
import { useState } from "react";
import Input from "../Input";
import { useParams } from "react-router";
import { useBoundStore } from "../../stores/useBoundStore";
import { useCreateCategory } from "../../services/categoryService";
import { CreateCategoryPayload } from "../../types/category";
import { useTranslation } from "react-i18next";

const CreateServerChannelDialog = () => {
	const { t } = useTranslation();
	const showCreateCategoryDialog = useBoundStore(
		(state) => state.showCreateCategoryDialog
	);
	const setShowCreateCategoryDialog = useBoundStore(
		(state) => state.setShowCreateCategoryDialog
	);
	const { serverId } = useParams();
	const [categoryName, setCategoryName] = useState<string>("");
	const { mutate: createCategory } = useCreateCategory();

	if (!showCreateCategoryDialog) return;

	const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCategoryName(e.target.value);
	};

	const onConfirm = async () => {
		const payload: CreateCategoryPayload = {
			name: categoryName,
			serverId: parseInt(serverId!),
		};
		createCategory(payload);
        setCategoryName("");
		setShowCreateCategoryDialog(false);
	};

	const onCancel = () => {
        setCategoryName("");
		setShowCreateCategoryDialog(false);
	};

	const title = <Title>{t("dashboard.createCategory")}</Title>;
	const body = (
		<Body>
			<Input
				label={t("dashboard.categoryName")}
				id='categoryName'
				name='categoryName'
				type='text'
				value={categoryName}
				onChange={onChangeHandler}
				required
			/>
		</Body>
	);
	const actions = (
		<Actions>
			<CancelButton onClick={onCancel}>{t("common.cancel")}</CancelButton>
			<ConfirmButton onClick={onConfirm}>
				{t("dashboard.createCategory")}
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

export default CreateServerChannelDialog;
