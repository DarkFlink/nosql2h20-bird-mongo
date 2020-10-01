import React from "react";
import {
  Switch,
  Route,
} from "react-router-dom";
import styles from './App.module.scss';
import { connect } from 'react-redux';
import {logout, userSelector} from "./redux/auth/auth";
import Main from "./components/Main/Main";
import AuthRouter from "./components/Auth/AuthRouter";
import {Button, Dropdown, DropdownButton} from 'react-bootstrap';
import logo from './images/logo.png';
import { withRouter } from 'react-router';
import axios from 'axios';
import {message} from "antd";

class App extends React.PureComponent{

  toProfile = () => {
    const { history, user: { _id }, } = this.props;
    history.push(`/users/${_id}`);
  };

  importJson = e => {
    const { logout } = this.props;
    const form = new FormData();
    form.set('file', e.target.files[0]);
    axios.post(`/import/`, form).then(response => {
      message.success('Import successful');
      logout();
    }, err => {
      message.error('Error while importing file');
    });
  };

  exportJson = () => {
    axios.get(`/export/`, { responseType: 'blob', })
      .then(({ data }) => {
        const downloadUrl = window.URL.createObjectURL(new Blob([data]));
        const link = document.createElement('a');
        link.href = downloadUrl;
        link.setAttribute('download', 'birdwatching-db.json'); //any other extension
        document.body.appendChild(link);
        link.click();
        link.remove();
      }, err => {
        message.error('Error while exporting file');
      });
  };

  toStatistics = () => {
    const { history } = this.props;
    history.push(`/statistics`);
  };

  render() {
    const { user, logout, history } = this.props;
    return (
      <div className={styles.container}>
        <header className={styles.header}>
          <div onClick={() => history.push('/')} className={styles.logo}>
            <img alt={'logo'} src={logo}/>
            Birdwatching
          </div>
          {
            user &&
            <div style={{ display: 'flex' }}>
              {
                user.isAdmin &&
                  <>
                    <input
                      accept="application/JSON" style={{ display: 'none' }}
                      type="file"
                      id={'importJsonDb'}
                      onChange={this.importJson}
                    />
                    <Button>
                      <label
                        style={{ marginBottom: '0', cursor: 'pointer' }}
                        htmlFor={'importJsonDb'}
                      >
                        Import
                      </label>
                    </Button>
                    <Button
                      onClick={this.exportJson}
                      style={{ marginLeft: '1rem', marginRight: '1rem' }}
                    >
                      Export
                    </Button>
                    <Button
                      onClick={this.toStatistics}
                      style={{ marginLeft: '1rem', marginRight: '1rem' }}
                    >
                      Statistics
                    </Button>
                  </>
              }
              <DropdownButton id="dropdown-basic-button" title={user.login}>
                <Dropdown.Item onClick={this.toProfile} >My profile</Dropdown.Item>
                <Dropdown.Item onClick={ logout }>Sign out</Dropdown.Item>
              </DropdownButton>
            </div>
          }
        </header>
        <div className={styles.scrollContainer}>
          <Switch>
            <Route path="/" >
              {
                user ?
                  <Main/>
                  :
                  <AuthRouter/>
              }
            </Route>
          </Switch>
        </div>
      </div>
    );
  }
}

export default withRouter(connect(state => ({
  user: userSelector(state)
}), {
  logout
})(App));