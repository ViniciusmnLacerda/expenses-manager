import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { openFormEdit, renderExpense } from '../redux/actions';
import '../styles/Sidebar.css';

class Sidebar extends React.Component {
  openForm = () => {
    const { dispatch } = this.props;
    dispatch(openFormEdit());
  };

  selectExpense = (id) => {
    const { dispatch } = this.props;
    dispatch(renderExpense(id));
  };

  render() {
    const { expenses } = this.props;
    return (
      <div className="side-bar">
        <header>
          <h1>My Expenses</h1>
          <i
            onClick={this.openForm}
            role="button"
            tabIndex="0"
            aria-label="open-form"
            onKeyPress={this.handleKeyPress}
            className="add"
          />
        </header>
        <div className="side-bar-content">
          {expenses.map((expense) => {
            const {
              tag, method, value, currency, id,
            } = expense;
            return (
              <div
                key={id}
                className="expense-sidebar"
                onClick={() => this.selectExpense(id)}
                role="button"
                tabIndex="0"
                aria-label="open form"
                onKeyPress={this.handleKeyPress}
              >
                <p className="value-sidebar">{`${value} ${currency}`}</p>
                <p className="tag-sidebar">{tag}</p>
                <p className="method-sidebar">{method}</p>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}

Sidebar.propTypes = {
  expenses: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  expenses: state.wallet.expenses,
  areYouEditing: state.wallet.areYouEditing,
});

export default connect(mapStateToProps)(Sidebar);
