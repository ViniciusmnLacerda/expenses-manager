import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { beingEdited, isEditing, removeExpense, setAmount } from '../redux/actions';

class Table extends Component {
  editClick = (id) => {
    const { dispatch } = this.props;
    dispatch(beingEdited(id));
    dispatch(isEditing());
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
    const { expenses, areYouEditing } = this.props;
    return (
      <div>
        <table>
          <thead>
            <tr>
              <th data-testid="head-description">Descrição</th>
              <th data-testid="head-tag">Tag</th>
              <th data-testid="head-method">Método de pagamento</th>
              <th data-testid="head-value">Valor</th>
              <th data-testid="head-currency">Moeda</th>
              <th data-testid="head-exchange">Câmbio utilizado</th>
              <th data-testid="head-amount">Valor convertido</th>
              <th data-testid="head-brl">Moeda de conversão</th>
              <th data-testid="head-button">Editar/Excluir</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense) => {
              const { description, tag, method, id, value } = expense;
              const exchange = expense.exchangeRates[expense.currency].ask;
              return (
                <tr key={ id }>
                  <td data-testid="body-description">{description}</td>
                  <td data-testid="body-tag">{tag}</td>
                  <td data-testid="body-method">{method}</td>
                  <td data-testid="body-value">{Number(expense.value).toFixed(2)}</td>
                  <td
                    data-testid="body-currency"
                  >
                    {expense.exchangeRates[expense.currency].name}
                  </td>
                  <td data-testid="body-exchange">{Number(exchange).toFixed(2)}</td>
                  <td data-testid="body-amount">
                    {((Number(exchange)) * value).toFixed(2)}
                  </td>
                  <td data-testid="body-brl">Real</td>
                  <td>
                    <button
                      data-testid="edit-btn"
                      type="button"
                      disabled={ areYouEditing }
                      onClick={ () => this.editClick(id) }
                    >
                      Editar
                    </button>
                    <button
                      data-testid="delete-btn"
                      type="button"
                      disabled={ areYouEditing }
                      onClick={ () => this.removeClick(id) }
                    >
                      Excluir
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

Table.propTypes = {
  expenses: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  dispatch: PropTypes.func.isRequired,
  areYouEditing: PropTypes.bool.isRequired,
};

const mapStateToProps = (state) => ({
  expenses: state.wallet.expenses,
  areYouEditing: state.wallet.areYouEditing,
});

export default connect(mapStateToProps)(Table);
