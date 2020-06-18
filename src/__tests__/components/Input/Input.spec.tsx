import React from 'react';
import { render, fireEvent, wait } from '@testing-library/react';
import Input from '../../../components/Input';

jest.mock('@unform/core', () => {
  return {
    useField() {
      return {
        fieldName: 'any_input',
        defaultValue: '',
        error: '',
        registerField: jest.fn(),
      };
    },
  };
});

describe('Input', () => {
  it('should be able to render an input', () => {
    const { getByPlaceholderText } = render(
      <Input name="any_input" placeholder="Any Input" />,
    );

    expect(getByPlaceholderText('Any Input')).toBeTruthy();
  });

  it('should render highlight on input focus', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="any_input" placeholder="Any Input" />,
    );

    const inputElement = getByPlaceholderText('Any Input');
    fireEvent.focus(inputElement);

    const inputContainer = getByTestId('input-container');

    await wait(() => {
      expect(inputContainer).toHaveStyle('border-color: #ff9000');
      expect(inputContainer).toHaveStyle('color: #ff9000');
    });
  });

  it('should keep input icon colorized if there is a input value', async () => {
    const { getByPlaceholderText, getByTestId } = render(
      <Input name="any_input" placeholder="Any Input" />,
    );

    const inputElement = getByPlaceholderText('Any Input');
    fireEvent.input(inputElement, { target: { value: 'any-text' } });
    fireEvent.blur(inputElement);

    const inputContainer = getByTestId('input-container');

    await wait(() => {
      expect(inputContainer).toHaveStyle('color: #ff9000');
      expect(inputContainer).toHaveStyle('border-color: #232129');
    });
  });
});
