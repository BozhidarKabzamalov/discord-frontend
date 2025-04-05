import styled from "styled-components";
import registerLoginBackground from "../assets/registerLoginBackground.jpg";
import { useState } from "react";

import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Input from "../components/Input";
import useAuth from "../hooks/useAuth";

const Login = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const [formData, setFormData] = useState({ email: "", password: "" });
	const { login } = useAuth();

	const onChange = (e) => {
		setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
	};

	const onSubmit = async (e) => {
		e.preventDefault();
		await login(formData);
		navigate("/");
	};

	return (
		<Container>
			<Form onSubmit={onSubmit}>
				<Title>{t("login.welcomeBack")}</Title>
				<Input
					label='Email'
					id='email'
					name='email'
					type='text'
					value={formData.email}
					onChange={onChange}
					required
				/>
				<Input
					label='Password'
					id='password'
					name='password'
					type='password'
					value={formData.password}
					onChange={onChange}
					required
				/>
				<RegisterButton type='submit'>
					{t("common.continue")}
				</RegisterButton>
				<RedirectToLogin onClick={() => navigate("/register")}>
					{t("login.needAnAccount")}
				</RedirectToLogin>
			</Form>
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

const Form = styled.form`
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

export default Login;
