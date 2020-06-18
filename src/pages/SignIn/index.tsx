import React, { useCallback, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiLogIn, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import Button from '../../components/Button';
import Input from '../../components/Input';

import { useAuth } from '../../hooks/auth';
import { useToast } from '../../hooks/toast';

import { Container, Content, Animation, Background } from './styles';

import logoImg from '../../assets/logo.svg';

interface SignInFormData {
  email: string;
  password: string;
}

const SignIn: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const formRef = useRef<FormHandles>(null);

  const { signIn } = useAuth();
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignInFormData) => {
      try {
        setLoading(true);
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          email: Yup.string()
            .required('E-mail é um campo obrigatório')
            .email('Insira um e-mail válido'),
          password: Yup.string().required('Senha é um campo obrigatório'),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const response = await signIn({
          email: data.email,
          password: data.password,
        });

        if (response.status === 200) history.push('/dashboard');
        else if (response.status === 401) {
          addToast({
            type: 'error',
            title: 'Erro na autenticação',
            description: 'E-mail ou senha inválidos',
          });
        } else throw new Error();
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }
        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description:
            'Ocorreu um erro ao realizar o login, por favor confira o seu e-mail e senha',
        });
      } finally {
        setLoading(false);
      }
    },
    [signIn, addToast, history],
  );

  return (
    <Container>
      <Content>
        <Animation>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Olá, seja bem vindo!</h1>
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />
            <Button type="submit" loading={loading}>
              Entrar
            </Button>
            <Link to="/forgot-password">Esqueci minha senha</Link>
          </Form>
          <Link to="/signup">
            <FiLogIn />
            Criar conta
          </Link>
        </Animation>
      </Content>
      <Background />
    </Container>
  );
};

export default SignIn;
