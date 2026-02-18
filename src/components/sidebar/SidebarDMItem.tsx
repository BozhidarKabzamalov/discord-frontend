import styled from "styled-components";
import { useNavigate } from "react-router";
import { FaUser } from "react-icons/fa";

const SidebarDMItem = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate("/channels/@me");
    };

    return (
        <Container onClick={handleClick}>
            <FaUser />
        </Container>
    );
};

const Container = styled.div`
    width: 40px;
    height: 40px;
    border-radius: 10px;
    background-color: ${({ theme }) => theme.colors.gray1000};
    color: ${({ theme }) => theme.colors.gray100};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    margin-bottom: 8px;
    position: relative;

    &:hover {
        color: ${({ theme }) => theme.colors.white};
        background-color: ${({ theme }) => theme.colors.blue200};
    }
`;

export default SidebarDMItem;
