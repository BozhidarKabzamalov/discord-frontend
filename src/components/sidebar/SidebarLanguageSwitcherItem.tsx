import { useTranslation } from "react-i18next";
import { FaGlobeEurope } from "react-icons/fa";
import styled from "styled-components";

const SidebarLanguageSwitcherItem = () => {
    const { i18n } = useTranslation();

    const handleLanguageChange = () => {
        const nextLang = i18n.language === "en" ? "bg" : "en";

        i18n.changeLanguage(nextLang);
    };

    return (
        <Container onClick={() => handleLanguageChange()}>
            <FaGlobeEurope />
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
    margin-top: auto;
    cursor: pointer;

    &:hover {
        color: ${({ theme }) => theme.colors.white};
        background-color: ${({ theme }) => theme.colors.blue200};
    }
`;

export default SidebarLanguageSwitcherItem;
