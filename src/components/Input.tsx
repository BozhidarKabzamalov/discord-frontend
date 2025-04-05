import React from "react";
import styled from "styled-components";

interface InputProps {
	label?: string;
	type?: string;
	id: string;
	name: string;
	placeholder?: string;
	value: string;
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
	onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
	error?: string;
	autoComplete?: string;
    required?: boolean;
}

const Input: React.FC<InputProps> = ({
	label,
	type = "text",
	id,
	name,
	placeholder,
	value,
	onChange,
	onBlur,
	error,
	autoComplete,
    required = false,
}) => {
	return (
		<InputContainer>
			{label && <Label htmlFor={id}>{label}</Label>}
			<StyledInput
				id={id}
				type={type}
				name={name}
				placeholder={placeholder}
				value={value}
				onChange={onChange}
				onBlur={onBlur}
				autoComplete={autoComplete}
				required={required}
			/>
			{error && <Error>{error}</Error>}
		</InputContainer>
	);
};

const InputContainer = styled.div`
	display: flex;
	flex-direction: column;
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

const StyledInput = styled.input`
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

const Error = styled.div``

export default Input;
