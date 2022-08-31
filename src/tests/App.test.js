import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import App from '../App';
import renderWithRouterAndRedux from './helpers/renderWith';

describe('Testes TrybeWallet', () => {
  const pathLogin = '/';
  const pathWallet = '/carteira';
  const email = 'vinicius@email.com';
  const currencies = ['USD', 'CAD', 'GBP', 'ARS', 'BTC', 'LTC', 'EUR', 'JPY', 'CHF', 'AUD', 'CNY', 'ILS', 'ETH', 'XRP', 'DOGE'];
  const value = '100';
  const description = 'Ingresso final da copa do mundo';
  const currency = 'DOGE';
  const method = 'Cartão de crédito';
  const tag = 'Lazer';
  const initialState = {
    user: {
      email,
    },
    wallet: {
      currencies,
      expenses: [],
      editor: false,
      idToEdit: 0,
      error: null,
      areYouEditing: false,
      whoIsBeingEdited: 0,
      amount: '0',
    },
  };
  const getHeaderInputs = () => {
    const valueInput = screen.getByTestId('value-input');
    const descriptionInput = screen.getByTestId('description-input');
    const currencyInput = screen.getByTestId('currency-input');
    const methodInput = screen.getByTestId('method-input');
    const tagInput = screen.getByTestId('tag-input');
    return {
      valueInput, descriptionInput, currencyInput, methodInput, tagInput,
    };
  };
  describe('Test the Login - Login.jsx', () => {
    beforeEach(cleanup);
    it('Teste rendering and initial values', () => {
      renderWithRouterAndRedux(<App />, { initialEntries: [pathLogin] });
      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByTestId('password-input');
      const btnSubmit = screen.getByRole('button', { name: /entrar/i });

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(btnSubmit).toBeInTheDocument();
      expect(emailInput).toHaveValue('');
      expect(passwordInput).toHaveValue('');
      expect(btnSubmit).toBeDisabled();
    });

    it('Test submit values', () => {
      const {
        store,
      } = renderWithRouterAndRedux(<App />, { initialEntries: [pathLogin] });
      const emailInput = screen.getByRole('textbox', { name: /email/i });
      const passwordInput = screen.getByTestId('password-input');
      const btnSubmit = screen.getByRole('button', { name: /entrar/i });
      const password = '123456789';
      const invalidPassword = '123';

      userEvent.type(emailInput, email);
      userEvent.type(passwordInput, invalidPassword);

      expect(emailInput).toHaveValue(email);
      expect(passwordInput).toHaveValue(invalidPassword);
      expect(btnSubmit).toBeDisabled();

      userEvent.type(passwordInput, password);
      expect(btnSubmit).not.toBeDisabled();

      userEvent.click(btnSubmit);
      const { user } = store.getState();

      expect(user).toEqual({ email });
    });
  });
  describe('Teste the Wallet - Wallet.jsx', () => {
    beforeEach(cleanup);
    it('Test rendering and initial values - Header.jsx', () => {
      const initialStateForHeader = { user: { email } };
      renderWithRouterAndRedux(
        <App />,
        { initialEntries: [pathWallet], initialState: initialStateForHeader },
      );
      const emailField = screen.getByTestId('email-field');
      const totalField = screen.getByTestId('total-field');
      const headerCurrencyField = screen.getByTestId('header-currency-field');

      expect(emailField).toBeInTheDocument();
      expect(emailField).toHaveTextContent(email);
      expect(totalField).toBeInTheDocument();
      expect(totalField).toHaveTextContent('0');
      expect(headerCurrencyField).toBeInTheDocument();
      expect(headerCurrencyField).toHaveTextContent('BRL');
    });
    it('Test rendering and initial values - WalletForm.jsx', () => {
      renderWithRouterAndRedux(
        <App />,
        { initialEntries: [pathWallet], initialState },
      );
      const {
        valueInput, descriptionInput, currencyInput, methodInput, tagInput,
      } = getHeaderInputs();
      const btnAdd = screen.getByRole('button', { name: /adicionar despesa/i });

      expect(valueInput).toBeInTheDocument();
      expect(descriptionInput).toBeInTheDocument();
      expect(currencyInput).toBeInTheDocument();
      expect(currencyInput).toHaveTextContent(/usd/i);
      expect(methodInput).toBeInTheDocument();
      expect(methodInput).toHaveTextContent(/dinheiro/i);
      expect(tagInput).toBeInTheDocument();
      expect(tagInput).toHaveTextContent(/alimentação/i);
      expect(btnAdd).toBeInTheDocument();
    });
    it('Test submit values - Header.jsx and Tablet.jsx', async () => {
      renderWithRouterAndRedux(
        <App />,
        { initialEntries: [pathWallet], initialState },
      );
      const {
        valueInput, descriptionInput, currencyInput, methodInput, tagInput,
      } = getHeaderInputs();
      const btnAdd = screen.getByRole('button', { name: /adicionar despesa/i });
      userEvent.type(valueInput, value);
      userEvent.type(descriptionInput, description);
      userEvent.selectOptions(currencyInput, currency);
      userEvent.selectOptions(methodInput, method);
      userEvent.selectOptions(tagInput, tag);

      expect(valueInput).toHaveValue(100);
      expect(descriptionInput).toHaveValue(description);
      expect(currencyInput).toHaveValue(currency);
      expect(methodInput).toHaveValue(method);
      expect(tagInput).toHaveValue(tag);

      userEvent.click(btnAdd);
      await waitFor(() => {
        expect(valueInput).toHaveValue(null);
        expect(descriptionInput).toHaveValue('');
        expect(currencyInput).toHaveValue('USD');
        expect(methodInput).toHaveValue('Dinheiro');
        expect(tagInput).toHaveValue('Alimentação');
      });
    });
  });
});
