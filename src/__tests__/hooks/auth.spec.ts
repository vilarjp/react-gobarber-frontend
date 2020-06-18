import { renderHook } from '@testing-library/react-hooks';
import MockAdapter from 'axios-mock-adapter';
import TestRenderer from 'react-test-renderer';
import { useAuth, AuthProvider } from '../../hooks/auth';
import api from '../../services/api';

const { act } = TestRenderer;

const apiMock = new MockAdapter(api);
const setItemSpy = jest.spyOn(Storage.prototype, 'setItem');
const removeItemSpy = jest.spyOn(Storage.prototype, 'removeItem');

describe('Auth', () => {
  beforeEach(() => {
    setItemSpy.mockClear();
    removeItemSpy.mockClear();
  });
  it('should be able to sign in', async () => {
    apiMock.onPost('/sessions').replyOnce(200, {
      user: {
        id: 'any_id',
        name: 'any_name',
        email: 'any_email@test.com',
      },
      token: 'any_token',
    });

    const { result, waitForNextUpdate } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'any_email@test.com',
      password: 'any_password',
    });

    await waitForNextUpdate();

    expect(result.current.user.email).toBe('any_email@test.com');
  });

  it('should throw error if api request fails', () => {
    apiMock.onPost('/sessions').replyOnce(500);

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    result.current.signIn({
      email: 'any_email@test.com',
      password: 'any_password',
    });

    expect(setItemSpy).not.toHaveBeenCalled();
  });

  it('should restore user and token from localstorage', () => {
    jest.spyOn(Storage.prototype, 'getItem').mockImplementation(key => {
      switch (key) {
        case '@GoBarber:token':
          return 'any_token';
        case '@GoBarber:user':
          return JSON.stringify({
            id: 'any_id',
            name: 'any_name',
            email: 'any_email@test.com',
          });
        default:
          return null;
      }
    });

    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    expect(result.current.user.email).toBe('any_email@test.com');
  });

  it('should be able to sign out', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    act(() => {
      result.current.signOut();
    });

    expect(removeItemSpy).toHaveBeenCalledTimes(2);
    expect(result.current.user).toBe(undefined);
  });

  it('should be able to update user', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@test.com',
      avatar_url: 'any_url',
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledTimes(1);
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );
    expect(result.current.user).toEqual(user);
  });

  it('should be able to update user', async () => {
    const { result } = renderHook(() => useAuth(), {
      wrapper: AuthProvider,
    });

    const user = {
      id: 'any_id',
      name: 'any_name',
      email: 'any_email@test.com',
      avatar_url: 'any_url',
    };

    act(() => {
      result.current.updateUser(user);
    });

    expect(setItemSpy).toHaveBeenCalledTimes(1);
    expect(setItemSpy).toHaveBeenCalledWith(
      '@GoBarber:user',
      JSON.stringify(user),
    );
    expect(result.current.user).toEqual(user);
  });
});
