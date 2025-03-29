import { useState } from "react";
import styled from "styled-components";
import registerLoginBackground from "../assets/registerLoginBackground.jpg";
import { registerUser } from "../services/userService";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: "",
        password: "",
    });

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        await registerUser(formData);
        navigate("/login");
    };

    return (
        <Container>
            <FormContainer>
                <Title>Create an account</Title>
                <form onSubmit={handleSubmit}>
                    <InputContainer>
                        <Label htmlFor="username">Username</Label>
                        <Input
                            type="text"
                            id="username"
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                        />
                    </InputContainer>
                    <InputContainer>
                        <Label htmlFor="password">Password</Label>
                        <Input
                            type="password"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </InputContainer>
                    <RegisterButton>Continue</RegisterButton>
                </form>
                <RedirectToLogin onClick={() => navigate("/login")}>
                    Already have an account?
                </RedirectToLogin>
            </FormContainer>
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    flex: 1;
    background-color: #323338;
    min-height: 100vh;
    max-height: 100vh;
    background-image: url(${registerLoginBackground});
    background-size: cover;
    background-position: center center;
`;

const FormContainer = styled.div`
    background-color: #36393f;
    padding: 40px;
    width: 500px;
    border-radius: 5px;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.2);
`;

const Title = styled.h2`
    text-align: center;
    font-weight: 600;
    color: #ffffff;
    font-size: 24px;
    line-height: 30px;
    margin-bottom: 20px;
`;

const Label = styled.label`
    color: #8e9297;
    margin-bottom: 10px;
    font-size: 12px;
    line-height: 16px;
    font-weight: 600;
    text-transform: uppercase;
`;

const Input = styled.input`
    font-size: 16px;
    height: 40px;
    padding: 10px;
    color: #dcddde;
    background-color: rgba(0, 0, 0, 0.1);
    border: 1px solid rgba(0, 0, 0, 0.3);
    border-radius: 3px;

    &:hover {
        border: 1px solid rgba(0, 0, 0, 0.5);
    }

    &:focus {
        outline: 1px solid #7289da;
    }
`;

const RegisterButton = styled.button`
    cursor: pointer;
    font-weight: 500;
    color: #ffffff;
    background-color: #7289da;
    font-size: 16px;
    line-height: 24px;
    width: 100%;
    height: 40px;
    border-radius: 3px;
    outline: none;
    border: none;
    margin-bottom: 20px;

    &:hover {
        background-color: #677bc4;
    }
`;

const RedirectToLogin = styled.div`
    font-size: 14px;
    color: #7289da;
    cursor: pointer;
`;

const InputContainer = styled.div`
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;
`;

export default Register;
