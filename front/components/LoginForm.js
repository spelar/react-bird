import React, { useCallback, useEffect } from "react";
import { Form, Input, Button } from "antd";
import Link from "next/link";
import { loginRequestAction } from '../reducers/user';
import useInput from "../hooks/useInput";
import styled from 'styled-components';
import { useDispatch, useSelector } from 'react-redux';

const ButtonWrapper = styled.div`
  margin-top: 10px;
`;

const FormWrapper = styled(Form)`
  padding: 10px;
`;

const LoginForm = () => {
  const [email, onChangeEmail] = useInput('');
  const [password, onChangePassword] = useInput('');
  const dispatch = useDispatch();
	const { logInLoading, logInError } = useSelector((state) => state.user);

	useEffect(() => {
		if (logInError) {
			alert(logInError);
		}
	}, [logInError]);

  const onSubmitForm = useCallback(() => {
    dispatch(loginRequestAction({
      email,
      password,
    }));
  }, [email, password]);

	  return (
    <FormWrapper onFinish={onSubmitForm}>
      <div>
        <label htmlFor="user-email">이메일</label>
        <br />
        <Input name="user-email" type="email" value={email} onChange={onChangeEmail} required />
      </div>
      <div>
        <label htmlFor="user-password">비밀번호</label>
        <br />
        <Input name="user-password" value={password} onChange={onChangePassword} type="password" required />
      </div>
      <ButtonWrapper>
        <Button type="primary" htmlType="submit" loading={logInLoading}>로그인</Button>
        <Link href="/signup"><a><Button>회원가입</Button></a></Link>
      </ButtonWrapper>
    </FormWrapper>
  );
};


export default LoginForm;