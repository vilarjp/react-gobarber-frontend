import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import SignIn from '../../../pages/SignIn';

const mockedHistoryPush = jest.fn();
const mockSignIn = jest.fn();
const mockAddToast = jest.fn();

jest.mock('react-router-dom', () => {
  return {
    useHistory: () => ({ push: mockedHistoryPush }),
    Link: ({ children }: { children: React.ReactNode }) => children,
  };
});

jest.mock('../../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockSignIn,
    }),
  };
});

jest.mock('../../../hooks/auth', () => {
  return {
    useAuth: () => ({
      signIn: mockSignIn,
    }),
  };
});

jest.mock('../../../hooks/toast', () => {
  return {
    useToast: () => ({
      addToast: mockAddToast,
    }),
  };
});

describe('SignIn', () => {
  beforeEach(() => {
    mockedHistoryPush.mockClear();
  });

  it('should be able to sign in with valid fields', async () => {
    mockSignIn.mockReturnValue({
      status: 200,
    });
    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    fireEvent.input(emailField, { target: { value: 'any_email@test.com' } });

    const passwordField = getByPlaceholderText('Senha');
    fireEvent.input(passwordField, { target: { value: 'any_password' } });

    const buttonElement = getByText('Entrar');
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockedHistoryPush).toHaveBeenCalledWith('/dashboard');
    });
  });

  it('should not be able to sign in with invalid input e-mail', async () => {
    const { getByPlaceholderText, getByText, getAllByText } = render(
      <SignIn />,
    );

    const emailField = getByPlaceholderText('E-mail');
    fireEvent.input(emailField, { target: { value: 'invalid_field' } });

    const passwordField = getByPlaceholderText('Senha');
    fireEvent.input(passwordField, { target: { value: 'any_password' } });

    const buttonElement = getByText('Entrar');
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(getAllByText('Insira um e-mail válido')[0]).toBeTruthy();
    });
  });

  it('should not be able to sign in with invalid credentials', async () => {
    mockSignIn.mockReturnValue({
      status: 401,
    });

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    fireEvent.input(emailField, { target: { value: 'any_email@test.com' } });

    const passwordField = getByPlaceholderText('Senha');
    fireEvent.input(passwordField, { target: { value: 'any_password' } });

    const buttonElement = getByText('Entrar');
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          type: 'error',
        }),
      );
    });
  });

  it('should handle correctly request errors', async () => {
    mockSignIn.mockReturnValue({
      status: 500,
    });

    const { getByPlaceholderText, getByText } = render(<SignIn />);

    const emailField = getByPlaceholderText('E-mail');
    fireEvent.input(emailField, { target: { value: 'any_email@test.com' } });

    const passwordField = getByPlaceholderText('Senha');
    fireEvent.input(passwordField, { target: { value: 'any_password' } });

    const buttonElement = getByText('Entrar');
    fireEvent.click(buttonElement);

    await wait(() => {
      expect(mockAddToast).toHaveBeenCalledWith(
        expect.objectContaining({
          description:
            'Ocorreu um erro ao realizar o login, por favor confira o seu e-mail e senha',
        }),
      );
    });
  });
});
