import React, { useCallback, useRef, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiMail, FiLock } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

import { useToast } from '../../hooks/toast';

import Button from '../../components/Button';
import Input from '../../components/Input';

import { Container, Content, Animation, Background } from './styles';

import logoImg from '../../assets/logo.svg';

interface SignUpFormData {
  name: string;
  email: string;
  password: string;
}

const SignUp: React.FC = () => {
  const [loading, setLoading] = useState(false);

  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const handleSubmit = useCallback(
    async (data: SignUpFormData) => {
      try {
        setLoading(true);

        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome é um campo obrigatório'),
          email: Yup.string()
            .required('E-mail é um campo obrigatório')
            .email('Insira um e-mail válido'),
          password: Yup.string().min(
            6,
            'A senha deve conter no mínimo 6 dígitos',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        await api
          .post('/users', data)
          .then(() => {
            addToast({
              type: 'success',
              title: 'Cadastro realizado com sucesso',
            });
            history.push('/');
          })
          .catch(err => {
            if (err.response.status === 400) {
              addToast({
                type: 'error',
                title: 'Erro ao realizar cadastro',
                description: 'Esse e-mail já está sendo utilizado',
              });
            } else {
              throw new Error();
            }
          });
      } catch (err) {
        if (err instanceof Yup.ValidationError) {
          const errors = getValidationErrors(err);
          formRef.current?.setErrors(errors);
          return;
        }

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description:
            'Ocorreu um erro ao realizar o cadastro, por favor confira os dados e tente novamente',
        });
      } finally {
        setLoading(false);
      }
    },
    [addToast, history],
  );

  return (
    <Container>
      <Background />
      <Content>
        <Animation>
          <img src={logoImg} alt="GoBarber" />
          <Form ref={formRef} onSubmit={handleSubmit}>
            <h1>Faça seu cadastro</h1>
            <Input name="name" icon={FiUser} placeholder="Nome" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Senha"
            />
            <Button type="submit" loading={loading}>
              {' '}
              {loading ? 'Carregando...' : 'Cadastrar'}
            </Button>
          </Form>
          <Link to="/">
            <FiArrowLeft />
            Voltar para login
          </Link>
        </Animation>
      </Content>
    </Container>
  );
};

export default SignUp;
