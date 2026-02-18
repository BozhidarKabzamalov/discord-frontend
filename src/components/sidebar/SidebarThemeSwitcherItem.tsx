import styled from "styled-components";
import { useBoundStore } from "../../stores/useBoundStore";
import { FaMoon, FaSun } from "react-icons/fa6";

const SidebarThemeSwitcherItem = () => {
    const { theme, toggleTheme } = useBoundStore();
    const isDarkTheme = theme === "dark";

    return (
        <Container onClick={toggleTheme}>
            {isDarkTheme ? <FaSun /> : <FaMoon />}
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 40px;
    height: 40px;
    border-radius: 10px;
    color: ${({ theme }) => theme.colors.gray100};
    background-color: ${({ theme }) => theme.colors.gray1000};
    margin-top: 15px;
    cursor: pointer;

    &:hover {
        color: ${({ theme }) => theme.colors.white};
        background-color: ${({ theme }) => theme.colors.blue200};
    }
`;

export default SidebarThemeSwitcherItem;
