import styled from "styled-components";
import { Outlet } from "react-router";

const Home = () => {
    return (
        <Container>
            <Main>
                <Outlet />
            </Main>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    min-height: 100vh;
    max-height: 100vh;
`;

const Main = styled.div`
    flex: 1;
    background-color: #323338;
    min-height: 100vh;
    max-height: 100vh;
`;

export default Home;
