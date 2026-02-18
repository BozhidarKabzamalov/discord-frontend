import styled from "styled-components";

type CustomDialogProps = {
    title: React.ReactNode;
    body: React.ReactNode;
    actions?: React.ReactNode;
    onConfirm?: () => void;
    onCancel?: () => void;
};

const CustomDialog = ({
    title,
    body,
    actions,
    onConfirm,
    onCancel,
}: CustomDialogProps) => {
    return (
        <Container>
            <InnerContainer>
                <TitleContainer>{title}</TitleContainer>
                <BodyContainer>{body}</BodyContainer>
                <ActionsContainer>{actions}</ActionsContainer>
            </InnerContainer>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.7);
    position: absolute;
    top: 0;
    left: 0;
`;

const InnerContainer = styled.div`
    background-color: ${({ theme }) => theme.colors.innerDialog};
    border-radius: 10px;
    width: 500px;
    padding: 20px;
`;

const TitleContainer = styled.div``;

const BodyContainer = styled.div``;

const ActionsContainer = styled.div``;

export default CustomDialog;
