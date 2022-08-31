import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

class Header extends Component {
  render() {
    const { email, amount } = this.props;
    return (
      <div>
        <p data-testid="email-field">{email}</p>
        <p data-testid="total-field">{amount}</p>
        <p data-testid="header-currency-field">BRL</p>
      </div>
    );
  }
}

Header.propTypes = {
  email: PropTypes.string.isRequired,
  amount: PropTypes.string.isRequired,
};

const mapStateToProps = (state) => ({
  email: state.user.email,
  amount: state.wallet.amount,
});

export default connect(mapStateToProps)(Header);
