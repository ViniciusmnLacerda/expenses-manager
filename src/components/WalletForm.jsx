import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { fetchCoins, finishedEdit, getExpense, setAmount } from '../redux/actions';
import { fetchAskApi } from '../services/fetchAPI';

class WalletForm extends React.Component {
  state = {
    value: '',
    description: '',
    currency: 'USD',
    method: 'Dinheiro',
    tag: 'Alimentação',
  };

  componentDidMount() {
    const { dispatch } = this.props;
    dispatch(fetchCoins());
  }

  handleChange = ({ target: { name, value } }) => {
    this.setState({ [name]: value });
  };

  totalExpense = () => {
    const { expenses } = this.props;
    let amount = 0;
    if (expenses.length > 0) {
      expenses.forEach((expense) => {
        amount += expense.value * expense.exchangeRates[expense.currency].ask;
      });
    }
    return Number(amount).toFixed(2);
  };

  onClickAddExpensive = async () => {
    const { expenses, dispatch, areYouEditing, whoIsBeingEdited } = this.props;
    const id = expenses.length;
    const exchangeRates = await fetchAskApi();
    const food = 'alimentação';
    if (areYouEditing) {
      const { value, description, currency, method, tag } = this.state;
      const exchangeRatesEdit = await fetchAskApi();
      const expense = expenses.find((element) => element.id === whoIsBeingEdited);
      expense.value = value;
      expense.description = description;
      expense.currency = currency;
      expense.method = method;
      expense.tag = tag;
      expense.exchangeRates = exchangeRatesEdit;
      dispatch(setAmount(this.totalExpense()));
      dispatch(finishedEdit(expenses));
      this.setState({
        value: '',
        description: '',
        method: 'Dinheiro',
        tag: food,
        currency: 'USD',
      });
    } else {
      dispatch(getExpense({ ...this.state, id, exchangeRates }));
      dispatch(setAmount(this.totalExpense()));
      this.setState({
        value: '',
        description: '',
        method: 'Dinheiro',
        tag: food,
        currency: 'USD',
      });
    }
  };

  render() {
    const { currencies, areYouEditing } = this.props;
    const { value, description, currency, method, tag } = this.state;
    return (
      <div>
        <form>
          <label htmlFor="value">
            Valor:
            {' '}
            <input
              data-testid="value-input"
              type="number"
              name="value"
              id="value"
              value={ value }
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="description">
            Descrição
            {' '}
            <input
              data-testid="description-input"
              type="text"
              name="description"
              id="description"
              value={ description }
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="currency">
            Moeda:
            {' '}
            <select
              data-testid="currency-input"
              name="currency"
              id="currency"
              value={ currency }
              onChange={ this.handleChange }
            >
              {currencies.map((coin, index) => (
                <option
                  key={ index }
                  value={ coin }
                >
                  {coin}
                </option>
              ))}
            </select>
          </label>
          <label htmlFor="method">
            Método de Pagamento:
            {' '}
            <select
              data-testid="method-input"
              name="method"
              id="method"
              value={ method }
              onChange={ this.handleChange }
            >
              <option value="Dinheiro">Dinheiro</option>
              <option value="Cartão de crédito">Cartão de crédito</option>
              <option value="Cartão de débito">Cartão de débito</option>
            </select>
          </label>
          <label htmlFor="tag">
            Categoria
            {' '}
            <select
              data-testid="tag-input"
              name="tag"
              id="tag"
              value={ tag }
              onChange={ this.handleChange }
            >
              <option value="Alimentação">Alimentação</option>
              <option value="Lazer">Lazer</option>
              <option value="Trabalho">Trabalho</option>
              <option value="Transporte">Transporte</option>
              <option value="Saúde">Saúde</option>
            </select>
          </label>
        </form>
        <button
          type="button"
          onClick={ this.onClickAddExpensive }
        >
          {areYouEditing ? 'Editar despesa' : 'Adicionar despesa'}
        </button>
      </div>
    );
  }
}

WalletForm.propTypes = {
  currencies: PropTypes.arrayOf(
    PropTypes.string,
  ).isRequired,
  dispatch: PropTypes.func.isRequired,
  expenses: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  areYouEditing: PropTypes.bool.isRequired,
  whoIsBeingEdited: PropTypes.number.isRequired,
};

const mapStateToProps = (state) => ({
  email: state.user.email,
  currencies: state.wallet.currencies,
  expenses: state.wallet.expenses,
  areYouEditing: state.wallet.areYouEditing,
  whoIsBeingEdited: state.wallet.whoIsBeingEdited,
});

export default connect(mapStateToProps)(WalletForm);
