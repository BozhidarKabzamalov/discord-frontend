import styled from "styled-components";
import CustomDialog from "./CustomDialog";
import { useState } from "react";
import Input from "../Input";
import { useBoundStore } from "../../stores/useBoundStore";
import { useTranslation } from "react-i18next";
import { useEditServer } from "../../services/serverService";

const EditServerDialog = () => {
    const { t } = useTranslation();
    const showEditServerDialog = useBoundStore(
        (state) => state.showEditServerDialog,
    );
    const setShowEditServerDialog = useBoundStore(
        (state) => state.setShowEditServerDialog,
    );
    const serverId = useBoundStore((state) => state.serverId);
    const { mutate: editServer } = useEditServer();

    const [serverName, setServerName] = useState<string>("");

    if (!showEditServerDialog) return;

    const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
        setServerName(e.target.value);
    };

    const onConfirm = async () => {
        editServer({ name: serverName, serverId: serverId! });
        setServerName("");
        setShowEditServerDialog(false);
    };

    const onCancel = () => {
        setServerName("");
        setShowEditServerDialog(false);
    };

    const title = <Title>{t("dashboard.editServer")}</Title>;
    const body = (
        <Body>
            <Input
                label={t("dashboard.serverName")}
                id="serverName"
                name="serverName"
                type="text"
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
                {t("dashboard.editServer")}
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

export default EditServerDialog;
