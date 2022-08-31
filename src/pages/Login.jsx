import PropTypes from 'prop-types';
import React from 'react';
import { connect } from 'react-redux';
import { userEmail } from '../redux/actions';
import '../styles/Login.css';

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
      <div className="container">
        <div className="login-container">
        <div className="image-container">
          <img className="login-image" src="/login.svg" alt="login ilustration" />
        </div>
        <form className="inputs-container">
          <h1>Login</h1>
          <label htmlFor="email">
            <input
              autoComplete='off'
              placeholder='E-mail'
              className="input-text"
              data-testid="email-input"
              type="text"
              name="email"
              id="email"
              value={ email }
              onChange={ this.handleChange }
            />
          </label>
          <label htmlFor="password">
            <input
              autoComplete='off'
              placeholder='password'
              className="input-text"
              data-testid="password-input"
              type="password"
              name="password"
              id="password"
              value={ password }
              onChange={ this.handleChange }
            />
          </label>
          <button
            className="btn"
            type="button"
            disabled={ isDisabled }
            onClick={ this.onClickButton }
          >
            Sign in
          </button>
        </form>
        </div>
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
