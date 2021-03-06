import React, { useCallback, useRef, ChangeEvent } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiArrowLeft, FiUser, FiMail, FiLock, FiCamera } from 'react-icons/fi';
import { FormHandles } from '@unform/core';
import { Form } from '@unform/web';
import * as Yup from 'yup';
import getValidationErrors from '../../utils/getValidationErrors';
import api from '../../services/api';

import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

import Button from '../../components/Button';
import Input from '../../components/Input';

import { Container, Content, Animation, AvatarInput } from './styles';

interface ProfileFormData {
  name: string;
  email: string;
  old_password: string;
  password: string;
  password_confirmation: string;
}

const Profile: React.FC = () => {
  const formRef = useRef<FormHandles>(null);
  const { addToast } = useToast();
  const history = useHistory();

  const { user, updateUser } = useAuth();

  const handleSubmit = useCallback(
    async (data: ProfileFormData) => {
      try {
        formRef.current?.setErrors({});

        const schema = Yup.object().shape({
          name: Yup.string().required('Nome é um campo obrigatório'),
          email: Yup.string()
            .required('E-mail é um campo obrigatório')
            .email('Insira um e-mail válido'),
          old_password: Yup.string(),
          password: Yup.string().when('old_password', {
            is: val => !!val.length,
            then: Yup.string()
              .required('Campo obrigatório')
              .min(6, 'A senha deve conter no mínimo 6 dígitos'),
            otherwise: Yup.string(),
          }),
          password_confirmation: Yup.string().oneOf(
            [Yup.ref('password'), null],
            'Confirmação incorreta',
          ),
        });

        await schema.validate(data, {
          abortEarly: false,
        });

        const formData = {
          name: data.name,
          email: data.email,
          ...(data.old_password
            ? {
                old_password: data.old_password,
                password: data.password,
              }
            : {}),
        };

        await api
          .put('/profile', formData)
          .then(response => {
            updateUser(response.data);
            addToast({
              type: 'success',
              title: 'Perfil atualizado com sucesso!',
            });
            history.push('/dashboard');
          })
          .catch(err => {
            if (err.response.data.status === 'error') {
              addToast({
                type: 'error',
                title: 'Erro na atualização do perfil',
                description: `${err.response.data.message}`,
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
          title: 'Erro na atualização do perfil',
          description:
            'Ocorreu um erro ao atualizar o perfil, por favor confira os dados e tente novamente',
        });
      }
    },
    [addToast, history, updateUser],
  );

  const handleAvatarChange = useCallback(
    (event: ChangeEvent<HTMLInputElement>) => {
      if (event.target.files) {
        const data = new FormData();
        data.append('avatar', event.target.files[0]);

        api.patch('/users/avatar', data).then(response => {
          updateUser(response.data);
          addToast({
            type: 'success',
            title: 'Avatar atualizado com sucesso!',
          });
        });
      }
    },
    [updateUser, addToast],
  );

  return (
    <Container>
      <header>
        <div>
          <Link to="/dashboard">
            <FiArrowLeft />
            Voltar
          </Link>
        </div>
      </header>

      <Content>
        <Animation>
          <Form
            ref={formRef}
            onSubmit={handleSubmit}
            initialData={{
              name: user.name,
              email: user.email,
            }}
          >
            <AvatarInput>
              {user.avatar_url ? (
                <img src={user.avatar_url} alt={user.name} />
              ) : (
                <FiUser size={30} />
              )}
              <label htmlFor="avatar" title="Alterar foto de perfil">
                <FiCamera size={22} />
                <input
                  name="avatar"
                  id="avatar"
                  type="file"
                  onChange={handleAvatarChange}
                />
              </label>
            </AvatarInput>
            <h1>Meu perfil</h1>
            <Input name="name" icon={FiUser} placeholder="Nome" />
            <Input name="email" icon={FiMail} placeholder="E-mail" />
            <Input
              containerStyle={{ marginTop: '24px' }}
              name="old_password"
              icon={FiLock}
              type="password"
              placeholder="Senha atual"
            />
            <Input
              name="password"
              icon={FiLock}
              type="password"
              placeholder="Nova senha"
            />
            <Input
              name="password_confirmation"
              icon={FiLock}
              type="password"
              placeholder="Confirmar senha"
            />
            <Button type="submit">Confirmar mudanças</Button>
          </Form>
        </Animation>
      </Content>
    </Container>
  );
};

export default Profile;
