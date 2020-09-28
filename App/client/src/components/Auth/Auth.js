import React from 'react';
import { withRouter } from 'react-router';
import styles from './Auth.module.scss';
import { Form, Button } from 'react-bootstrap'
import { connect } from 'react-redux';
import { errorLoginSelector, isLoadingUserSelector, login, register, userSelector } from "../../redux/auth/auth";
import { message } from 'antd';

class Auth extends React.PureComponent {

  onSubmitLogin = event => {
    const { login } = this.props;
    event.preventDefault();
    event.stopPropagation();
    if (this.login.value && this.password.value) {
      login(this.login.value, this.password.value);
    } else {
      message.error('Enter login and password');
    }

  }

  onSubmitRegister = event => {
    const { register } = this.props;
    event.preventDefault();
    event.stopPropagation();
    if (this.login.value && this.password.value) {
      if (this.password.value !== this.repeatPassword.value) {
        return message.error('Passwords do not match');
      }
      register(this.login.value, this.password.value);
    } else {
      message.error('Enter login and password');
    }
  }

  render() {
    const { type, history } = this.props;
    return (
      <div className={styles.container}>
        {
          type === 'login' ?
            <div className={styles.form}>
              <Form onSubmit={this.onSubmitLogin}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Login</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter login"
                    ref={(ref) => { this.login = ref }}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    ref={(ref) => { this.password = ref }}
                  />
                </Form.Group>
                <Button
                  style={{ paddingLeft: '0', paddingTop: '0' }}
                  className="float-left"
                  variant="link"
                  type="submit"
                  onClick={() => history.push('/register')}
                >
                  Create an account
                </Button>
                <Button className="float-right" variant="primary" type="submit">
                  Sign in
                </Button>
              </Form>
            </div>
            :
            <div className={styles.form}>
              <Form onSubmit={this.onSubmitRegister}>
                <Form.Group controlId="formBasicEmail">
                  <Form.Label>Login</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter login"
                    ref={(ref) => { this.login = ref }}
                  />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Enter password"
                    ref={(ref) => { this.password = ref }}
                  />
                </Form.Group>
                <Form.Group controlId="formBasicPassword">
                  <Form.Label>Repeat password</Form.Label>
                  <Form.Control
                    type="password"
                    placeholder="Repeat password"
                    ref={(ref) => { this.repeatPassword = ref }}
                  />
                </Form.Group>
                <Button
                  style={{ paddingLeft: '0', paddingTop: '0' }}
                  className="float-left"
                  variant="link"
                  type="submit"
                  onClick={() => history.push('/login')}
                >
                  Log in
                </Button>
                <Button className="float-right" variant="primary" type="submit">
                  Sign up
                </Button>
              </Form>
            </div>
        }
      </div>
    )
  };
}

export default withRouter(connect(state => ({
  user: userSelector(state),
  isLoading: isLoadingUserSelector(state),
  error: errorLoginSelector(state)
}), {
  login,
  register
})(Auth));