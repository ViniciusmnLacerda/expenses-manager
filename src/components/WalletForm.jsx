/* eslint-disable comma-dangle */
import PropTypes from 'prop-types';
import React from 'react';
import { IoClose } from 'react-icons/io5';
import { connect } from 'react-redux';
import {
  closeFormEdit, fetchCoins, finishedEdit, getExpense, setAmount
} from '../redux/actions';
import { fetchAskApi } from '../services/fetchAPI';
import '../styles/WalletForm.css';

class WalletForm extends React.Component {
  constructor() {
    super();

    this.state = {
      value: '',
      description: '',
      currency: 'USD',
      method: 'Cash',
      tag: 'Food',
    };
  }

  componentDidMount() {
    const { dispatch } = this.props;
    const { areYouEditing } = this.props;
    if (areYouEditing) {
      const { expenseToRender } = this.props;
      this.setState({
        value: expenseToRender[0].value,
        description: expenseToRender[0].description,
        method: expenseToRender[0].method,
        tag: expenseToRender[0].tag,
        currency: expenseToRender[0].currency,
      });
    }
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

  closeForm = () => {
    const { dispatch, expenses } = this.props;
    dispatch(closeFormEdit());
    dispatch(finishedEdit(expenses));
  };

  onClickAddExpensive = async () => {
    const {
      expenses, dispatch, areYouEditing, whoIsBeingEdited,
    } = this.props;
    const id = expenses.length;
    const exchangeRates = await fetchAskApi();
    const food = 'Food';
    if (areYouEditing) {
      const {
        value, description, currency, method, tag,
      } = this.state;
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
      dispatch(closeFormEdit());
      this.setState({
        value: '',
        description: '',
        method: 'Cash',
        tag: food,
        currency: 'CAD',
      });
    } else {
      dispatch(getExpense({ ...this.state, id, exchangeRates }));
      dispatch(setAmount(this.totalExpense()));
      dispatch(closeFormEdit());
      this.setState({
        value: '',
        description: '',
        method: 'Cash',
        tag: food,
        currency: 'USD',
      });
    }
  };

  render() {
    const { currencies, areYouEditing } = this.props;
    const {
      value, description, currency, method, tag,
    } = this.state;
    return (
      <div className="form-expenses">
        <form>
          <div className="title-form-expenses">
            <h1>{areYouEditing ? 'Edit expense' : 'add expense'}</h1>
            <div
              onClick={this.closeForm}
              className="close-form-expenses"
              role="button"
              tabIndex="0"
              aria-label="close-forme"
              onKeyPress={this.handleKeyPress}
            >
              <IoClose />
            </div>
          </div>
          <div className="body-form-expenses">
            <div className="value-form-expenses">
              <label htmlFor="value">
                <span>Value</span>
                {' '}
                <input
                  autoComplete="off"
                  data-testid="value-input"
                  type="number"
                  name="value"
                  id="value"
                  value={value}
                  onChange={this.handleChange}
                />
              </label>
              <label htmlFor="currency">
                <span>Currency</span>
                {' '}
                <select
                  data-testid="currency-input"
                  name="currency"
                  id="currency"
                  value={currency}
                  onChange={this.handleChange}
                >
                  {currencies.map((coin, index) => (
                    <option
                      // eslint-disable-next-line react/no-array-index-key
                      key={index}
                      value={coin}
                    >
                      {coin}
                    </option>
                  ))}
                </select>
              </label>
              <label htmlFor="method">
                <span>Payment</span>
                {' '}
                <select
                  data-testid="method-input"
                  name="method"
                  id="method"
                  value={method}
                  onChange={this.handleChange}
                >
                  <option value="Cash">Cash</option>
                  <option value="Credit card">Credit card</option>
                  <option value="Debit card">Debit card</option>
                </select>
              </label>
              <label htmlFor="tag">
                <span>Tag</span>
                {' '}
                <select
                  data-testid="tag-input"
                  name="tag"
                  id="tag"
                  value={tag}
                  onChange={this.handleChange}
                >
                  <option value="Food">Food</option>
                  <option value="Laisure">Leisure</option>
                  <option value="Work">Work</option>
                  <option value="Transport">Transport</option>
                  <option value="Health">Health</option>
                </select>
              </label>
            </div>
            <div className="description-form-expenses">
              <label htmlFor="description">
                <span>Description</span>
                {' '}
                <input
                  autoComplete="off"
                  data-testid="description-input"
                  type="text"
                  name="description"
                  id="description"
                  value={description}
                  onChange={this.handleChange}
                />
              </label>
            </div>
          </div>
          <div className="btn-form-expenses">
            <button
              type="button"
              onClick={this.onClickAddExpensive}
            >
              {areYouEditing ? 'Editar despesa' : 'Add Expense'}
            </button>
          </div>
        </form>
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
  expenseToRender: PropTypes.arrayOf(PropTypes.shape()).isRequired,
};

const mapStateToProps = (state) => ({
  email: state.user.email,
  currencies: state.wallet.currencies,
  expenses: state.wallet.expenses,
  areYouEditing: state.wallet.areYouEditing,
  whoIsBeingEdited: state.wallet.whoIsBeingEdited,
  dispatch: PropTypes.func.isRequired,
  expenseToRender: state.wallet.expenseToRender,
});

export default connect(mapStateToProps)(WalletForm);
