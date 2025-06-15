import { useTranslation } from "react-i18next";
import styled from "styled-components";

const NoSelectedServer = () => {
	const { t } = useTranslation();

	return (
		<Container>
			<Title>{t("dashboard.noServerSelected")}</Title>
		</Container>
	);
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	justify-content: center;
	align-items: center;
	flex: 1;
	background-color: ${({ theme }) => theme.colors.gray1100};
`;

const Title = styled.h2`
	text-align: center;
	font-weight: 600;
	color: ${({ theme }) => theme.colors.gray200};
	font-size: 24px;
	line-height: 30px;
	text-transform: uppercase;
`;

export default NoSelectedServer;
