/* eslint-disable comma-dangle */
import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import {
  beingEdited, isEditing, openFormEdit, removeExpense, setAmount
} from '../redux/actions';
import '../styles/Table.css';

class Table extends Component {
  editClick = (id) => {
    const { dispatch } = this.props;
    dispatch(beingEdited(id));
    dispatch(isEditing());
    dispatch(openFormEdit());
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

  removeClick = async (id) => {
    const { dispatch } = this.props;
    await dispatch(removeExpense(id));
    dispatch(setAmount(this.totalExpense()));
  };

  render() {
    const { areYouEditing, amount, expenseToRender } = this.props;
    return (
      <div className="table">
        <div className="header-table">
          <h1>
            Balance
            {' '}
            <span>{`R$ ${amount}`}</span>
          </h1>
        </div>
        {expenseToRender.length > 0 && (
          expenseToRender.map((element) => {
            const {
              description, tag, method, id, value, currency,
            } = element;
            const exchange = element.exchangeRates[element.currency].ask;
            const currencyName = element.exchangeRates[element.currency].name;
            return (
              <div key={id} className="expense-table">
                <div className="text-table">
                  <h2>Value</h2>
                  <p>{`${Number(expenseToRender[0].value).toFixed(2)} ${currency}`}</p>
                </div>
                <div className="text-table">
                  <h2>Currency</h2>
                  <p>{currencyName.split('/')[0]}</p>
                </div>
                <div className="text-table">
                  <h2>Exchange rate</h2>
                  <p>{Number(exchange).toFixed(2)}</p>
                </div>
                <div className="text-table">
                  <h2>Converted value</h2>
                  <p>
                    {`R$ ${((Number(exchange)) * value).toFixed(2)}`}
                  </p>
                </div>
                <div className="text-table">
                  <h2>Tag</h2>
                  <p>{tag}</p>
                </div>
                <div className="text-table">
                  <h2>Payment</h2>
                  <p>{method}</p>
                </div>
                <div className="text-table">
                  <h2>Description</h2>
                  <p>{description}</p>
                </div>
                <div className="buttons-table">
                  <button
                    className="edit-btn"
                    data-testid="edit-btn"
                    type="button"
                    disabled={areYouEditing}
                    onClick={() => this.editClick(id)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete-btn"
                    data-testid="delete-btn"
                    type="button"
                    disabled={areYouEditing}
                    onClick={() => this.removeClick(id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    );
  }
}

Table.propTypes = {
  expenses: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  expenseToRender: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  dispatch: PropTypes.func.isRequired,
  areYouEditing: PropTypes.bool.isRequired,
  amount: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  expenses: state.wallet.expenses,
  areYouEditing: state.wallet.areYouEditing,
  amount: state.wallet.amount,
  expenseToRender: state.wallet.expenseToRender,
  idToRender: state.wallet.idToRender,
});

export default connect(mapStateToProps)(Table);
