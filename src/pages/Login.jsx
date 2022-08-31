import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { userEmail } from '../redux/actions';

class Login extends React.Component {
  state = {
    email: '',
    password: '',
    isDisabled: true,
  };

  handleChange = ({ target }) => {
    const { name, value } = target;
    this.setState({ [name]: value }, this.validate);
  };

  validate = () => {
    const { email, password } = this.state;
    const magicNumer = 5;
    const emailRegex = /^\w+([-+.']\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/;
    const isLoginValid = [
      emailRegex.test(email),
      password.length > magicNumer,
    ].every(Boolean);
    this.setState({ isDisabled: !isLoginValid });
  };

  onClickButton = () => {
    const { email } = this.state;
    const { dispatch, history } = this.props;
    dispatch(userEmail(email));
    history.push('/carteira');
  };

  render() {
    const { email, password, isDisabled } = this.state;
    return (
      <div>
        <label htmlFor="email">
          Email:
          {' '}
          <input
            data-testid="email-input"
            type="text"
            name="email"
            id="email"
            value={ email }
            onChange={ this.handleChange }
          />
        </label>
        <label htmlFor="password">
          Password:
          {' '}
          <input
            data-testid="password-input"
            type="password"
            name="password"
            id="password"
            value={ password }
            onChange={ this.handleChange }
          />
        </label>
        <button
          type="button"
          disabled={ isDisabled }
          onClick={ this.onClickButton }
        >
          Entrar
        </button>
      </div>
    );
  }
}

Login.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }).isRequired,
};

export default connect()(Login);
