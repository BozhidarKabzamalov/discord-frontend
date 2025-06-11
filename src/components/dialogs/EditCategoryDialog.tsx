import styled from "styled-components";
import CustomDialog from "./CustomDialog";
import { useState } from "react";
import Input from "../Input";
import { useParams } from "react-router";
import { useBoundStore } from "../../stores/useBoundStore";
import { useCreateCategory } from "../../services/categoryService";
import { UpdateCategoryPayload } from "../../types/category";
import { useTranslation } from "react-i18next";

const EditCategoryDialog = () => {
	const { t } = useTranslation();
	const showCreateCategoryDialog = useBoundStore(
		(state) => state.showCreateCategoryDialog
	);
	const setShowCreateCategoryDialog = useBoundStore(
		(state) => state.setShowCreateCategoryDialog
	);
	const { serverId, channelId } = useParams();
	const [categoryName, setCategoryName] = useState<string>("");
	const { mutate: updateCategory } = useCreateCategory();

	if (!showCreateCategoryDialog) return;

	const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setCategoryName(e.target.value);
	};

	const onConfirm = async () => {
		const payload: UpdateCategoryPayload = {
			name: categoryName,
			serverId: parseInt(serverId!),
			categoryId: parseInt(channelId!),
		};
		updateCategory(payload);
		setShowCreateCategoryDialog(false);
	};

	const onCancel = () => {
		setShowCreateCategoryDialog(false);
	};

	const title = <Title>{t("dashboard.editCategory")}</Title>;
	const body = (
		<Body>
			<Input
				label='Category Name'
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
				{t("dashboard.editCategory")}
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

export default EditCategoryDialog;
