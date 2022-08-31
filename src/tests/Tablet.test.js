import { cleanup, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import Wallet from '../pages/Wallet';
import mockData from './helpers/mockData';
import renderWithRouterAndRedux from './helpers/renderWith';

describe('Teste the Table - Table.jsx', () => {
  beforeEach(cleanup);
  const pathWallet = '/carteira';
  const email = 'vinicius@email.com';
  const currencies = ['USD', 'CAD', 'GBP', 'ARS', 'BTC', 'LTC', 'EUR', 'JPY', 'CHF', 'AUD', 'CNY', 'ILS', 'ETH', 'XRP', 'DOGE'];
  const value = '100';
  const description = 'Ingresso final da copa do mundo';
  const currency = 'DOGE';
  const method = 'Cartão de crédito';
  const tag = 'Lazer';
  const newValue = '200';
  const newDescription = 'Uma nova descrição';
  const newCurrency = 'AUD';
  const newMethod = 'Cartão de débito';
  const newTag = 'Saúde';
  const editedExpensive = [newDescription, newTag, newMethod, newValue, 'Dólar Australiano/Real Brasileiro', '3,49', '697,96', 'Real'];
  const initialState = {
    user: {
      email,
    },
    wallet: {
      currencies,
      expenses: [{
        value,
        description,
        currency,
        method,
        tag,
        id: 0,
        exchangeRates: mockData,
      }],
      editor: false,
      idToEdit: 0,
      error: null,
      areYouEditing: false,
      whoIsBeingEdited: 0,
      amount: '697,96',
    },
  };
  const getHeadTable = () => {
    const headDescription = screen.getByTestId('head-description');
    const headTag = screen.getByTestId('head-tag');
    const headMethod = screen.getByTestId('head-method');
    const headValue = screen.getByTestId('head-value');
    const headCurrency = screen.getByTestId('head-currency');
    const headExchange = screen.getByTestId('head-exchange');
    const headAmount = screen.getByTestId('head-amount');
    const headBrl = screen.getByTestId('head-brl');
    const headButton = screen.getByTestId('head-button');
    const headTable = [headDescription,
      headTag,
      headMethod,
      headValue,
      headCurrency,
      headExchange,
      headAmount,
      headBrl,
      headButton];
    return headTable;
  };
  const getBodyTable = () => {
    const bodyDescription = screen.getAllByTestId('body-description');
    const bodyTag = screen.getAllByTestId('body-tag');
    const bodyMethod = screen.getAllByTestId('body-method');
    const bodyValue = screen.getAllByTestId('body-value');
    const bodyCurrency = screen.getAllByTestId('body-currency');
    const bodyExchange = screen.getAllByTestId('body-exchange');
    const bodyAmount = screen.getAllByTestId('body-amount');
    const bodyBrl = screen.getAllByTestId('body-brl');
    const bodyTable = [bodyDescription,
      bodyTag,
      bodyMethod,
      bodyValue,
      bodyCurrency,
      bodyExchange,
      bodyAmount,
      bodyBrl];
    return bodyTable;
  };
  it('Test rendering and initial values', async () => {
    renderWithRouterAndRedux(
      <Wallet />,
      { initialEntries: [pathWallet], initialState },
    );
    const headTable = getHeadTable();
    const bodyTable = getBodyTable();
    const btnEdit = screen.getByTestId('edit-btn');
    const btnDelete = screen.getByTestId('delete-btn');
    headTable.forEach((th) => {
      expect(th).toBeInTheDocument();
    });
    bodyTable.forEach((td) => {
      expect(td).toHaveLength(1);
    });

    userEvent.click(btnEdit);

    expect(btnEdit).toBeDisabled();
    expect(screen.getByText(/editar despesa/i)).toBeInTheDocument();
    expect(btnDelete).toBeDisabled();
  });
  it('Test edit button', async () => {
    initialState.wallet.amount = 0;
    const { store } = renderWithRouterAndRedux(
      <Wallet />,
      { initialEntries: [pathWallet], initialState },
    );
    const btnEdit = screen.getByTestId('edit-btn');
    const valueInput = screen.getByTestId('value-input');
    const descriptionInput = screen.getByTestId('description-input');
    const currencyInput = screen.getByTestId('currency-input');
    const methodInput = screen.getByTestId('method-input');
    const tagInput = screen.getByTestId('tag-input');
    const totalField = screen.getByTestId('total-field');
    const { wallet } = store.getState();
    userEvent.click(btnEdit);

    userEvent.type(valueInput, '200');
    userEvent.type(descriptionInput, 'Uma nova descrição');
    userEvent.selectOptions(currencyInput, 'AUD');
    userEvent.selectOptions(methodInput, 'Cartão de débito');
    userEvent.selectOptions(tagInput, 'Saúde');

    expect(totalField).toHaveTextContent('0');
    expect(valueInput).toHaveValue(200);
    expect(descriptionInput).toHaveValue(newDescription);
    expect(currencyInput).toHaveValue(newCurrency);
    expect(methodInput).toHaveValue(newMethod);
    expect(tagInput).toHaveValue(newTag);

    userEvent.click(screen.getByText(/editar despesa/i));

    const bodyTable = getBodyTable();
    await waitFor(() => {
      expect(wallet.amount).toEqual(0);
      expect(wallet.areYouEditing).toEqual(false);
      bodyTable.forEach((td, index) => {
        expect(td).toHaveTextContent(editedExpensive[index]);
      });

      expect(wallet).toEqual({
        currencies,
        expenses: [{
          value: newValue,
          description: newDescription,
          currency: newCurrency,
          method: newMethod,
          tag: newTag,
          id: 0,
          exchangeRates: mockData,
        }],
        editor: false,
        idToEdit: 0,
        error: null,
        areYouEditing: false,
        whoIsBeingEdited: 0,
        amount: '697.96',
      });
    });
  });
  it('Test delete button', async () => {
    const { store } = renderWithRouterAndRedux(
      <Wallet />,
      { initialEntries: [pathWallet], initialState },
    );
    const btnDelete = screen.getByTestId('delete-btn');
    userEvent.click(btnDelete);
    await waitFor(() => {
      const { wallet } = store.getState();
      expect(wallet.expenses).toHaveLength(0);
      expect(wallet.amount).toHaveValue(0);
    });
  });
});
