import Head from "next/head";
import AppLayout from "../components/AppLayout";
import { Form, Input, Checkbox, Button} from "antd";
import { useCallback, useState, useEffect } from "react";
import styled from "styled-components";
import useInput from "../hooks/useInput";
import { LOAD_MY_INFO_REQUEST, SIGN_UP_REQUEST } from "../reducers/user";
import { useDispatch, useSelector } from "react-redux";
import Router from 'next/router';
import wrapper from '../store/configureStore';
import { END } from "redux-saga";
import axios from "axios";

const ErrorMessage = styled.div`
	color: red;

`;

const Signup = () => {
	const dispatch = useDispatch();
	const { signUpLoading, signUpDone, signUpError, me } = useSelector((state) => state.user);

	const [email, onChangeEmail] = useInput('');
	const [password, onChangePassword] = useInput('');
	const [nickname, onChangeNickname] = useInput('');
	const [passwordCheck, setPasswordCheck] = useState('');
	const [passwordError, setPasswordError] = useState(false);
	const [term, setTerm] = useState('');
	const [termError, setTermError] = useState(false);

	useEffect(() => {
		if (me && me.id) {
			Router.replace('/');
		}
	}, [me && me.id]);
	
	useEffect(() => {
		if (signUpDone) {
			Router.replace('/');
		}
	}, [signUpDone]);

	useEffect(() => {
		if (signUpError) {
			alert(signUpError);
		}
	}, [signUpError]);
	
	const onChangeTerm = useCallback((e) => {
		setTerm(e.target.checked);
		setTermError(false);
	}, []);

	const onChangePasswordCheck = useCallback((e) => {
		setPasswordCheck(e.target.value);
		setPasswordError(e.target.value !== password);
	}, [password]);

	const onsubmit = useCallback(() => {
		if (password !== passwordCheck) {
			return setPasswordError(true);
		} 
		if (!term) {
			return setTermError(true);
		}
		dispatch({
			type: SIGN_UP_REQUEST,
			data: { 
				email, password, nickname
			}
		})
	}, [password, passwordCheck, term]);

	return (
		<AppLayout>
			<Head>
				<title>회원가입 | NodeBird</title>
			</Head>
			<Form onFinish={onsubmit}>
				<div>
					<label htmlFor="user-email">이메일</label>
					<br />
					<Input name='user-email' type="email" value={email} required onChange={onChangeEmail} />
				</div>
				<div>
					<label htmlFor="user-nickname">닉네임</label>
					<br />
					<Input name="user-nickname" value={nickname} required onChange={onChangeNickname} />
				</div>
				<div>
					<label htmlFor="user-password">비밀번호</label>
					<br />
					<Input name="user-password" value={password} required onChange={onChangePassword} />
				</div>
				<div>
					<label htmlFor="user-password-check">비밀번호체크</label>
					<br />
					<Input
						name="user-password-check"
						type="password"
						value={passwordCheck}
						required
						onChange={onChangePasswordCheck}
					/ >
						{passwordError && <ErrorMessage>비밀번호가 일치하지 않습니다.</ErrorMessage>}
				</div>
				<div>
					<Checkbox name="user-term" checked={term} onChange={onChangeTerm}>제로초 말을 잘 들을 것을 동의합니다.</Checkbox>
					{termError && <ErrorMessage>약관에 동의하셔야 합니다.</ErrorMessage>}
				</div>
				<div style={{marginTop:10}}>
					<Button type="primary" htmlType="submit" loading={signUpLoading}>가입하기</Button>
				</div>
			</Form>
		</AppLayout>
	)
};

export const getServerSideProps = wrapper.getServerSideProps( async (context) => {
	const cookie = context.req ? context.req.headers.cookie : '';
	axios.defaults.headers.Cookie = '';
	if (context.req && cookie) {
		axios.defaults.headers.Cookie = cookie;
	}
	context.store.dispatch({
      type: LOAD_MY_INFO_REQUEST,
    });
		context.store.dispatch(END);
		await context.store.sagaTask.toPromise();
});

export default Signup;