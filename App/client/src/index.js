import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import 'antd/dist/antd.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import store from './redux/store';
import axios from 'axios'
import {LOGOUT} from "./redux/auth/auth";
import {Provider} from "react-redux";
import { BrowserRouter } from "react-router-dom";

const requestInterceptor = request => {
  const storeToken = store.getState().auth.user?.token;

  if (storeToken) {
    request.headers.token = `${storeToken}`;
  }

  request.headers['Cache-Control'] = 'no-cache';

  return request;
};

axios.interceptors.request.use(requestInterceptor);

axios.interceptors.response.use(
  response => response,
  err => {
    if (err.response && err.response.status === 401) {
      store.dispatch({
        type: LOGOUT,
      });
    }
    return Promise.reject(err);
  }
);

axios.defaults.baseURL = process.env.REACT_APP_API;



ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}><App /></Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
