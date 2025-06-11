import styled from "styled-components";

const NoSelectedChannel = () => {
	return <Container></Container>;
};

const Container = styled.div`
	display: flex;
	flex-direction: column;
	flex: 1;
	background-color: ${({ theme }) => theme.colors.gray1100};
`;

export default NoSelectedChannel;
