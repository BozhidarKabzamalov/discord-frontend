import { useState } from "react";
import styled from "styled-components";
import registerLoginBackground from "../assets/registerLoginBackground.jpg";
import { registerUser } from "../services/userService";
import { useNavigate } from "react-router";
import { RegisterPayload } from "../types/auth";
import Input from "../components/Input";

const Register = () => {
	const navigate = useNavigate();
	const [formData, setFormData] = useState<RegisterPayload>({
		username: "",
        email: "",
		password: "",
	});

	const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
		setFormData({
			...formData,
			[e.target.name]: e.target.value,
		});
	};

	const onSubmitHandler = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		await registerUser(formData);
		navigate("/login");
	};

	return (
		<Container>
			<Form onSubmit={onSubmitHandler}>
				<Title>Create an account</Title>
				<Input
					label='Username'
					id='username'
					name='username'
					type='text'
					value={formData.username}
					onChange={onChangeHandler}
					required
				/>
				<Input
					label='Email'
					id='email'
					name='email'
					type='text'
					value={formData.email}
					onChange={onChangeHandler}
					required
				/>
				<Input
					label='Password'
					id='password'
					name='password'
					type='password'
					value={formData.email}
					onChange={onChangeHandler}
					required
				/>
				<RegisterButton>Continue</RegisterButton>
				<RedirectToLogin onClick={() => navigate("/login")}>
					Already have an account?
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
	background-color: ${({ theme }) => theme.colors.gray800};
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

export default Register;
