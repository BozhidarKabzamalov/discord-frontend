import styled from "styled-components";
import { Member as MemberType } from "../types/servers";

type MemberProps = {
	member: MemberType;
};

const Member = ({ member }: MemberProps) => {
	const { username } = member;

	return <Container>{username}</Container>;
};

const Container = styled.div``;

export default Member;
