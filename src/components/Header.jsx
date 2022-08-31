import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import '../styles/Header.css';

class Header extends Component {
  render() {
    const { email, amount } = this.props;
    return (
      <div className="header">
        <div className="header-badge">
          <p data-testid="total-field">{`Total spend: ${amount} R$`}</p>
        </div>
        <div className="header-badge">
          <p data-testid="email-field">{email}</p>
        </div>
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
