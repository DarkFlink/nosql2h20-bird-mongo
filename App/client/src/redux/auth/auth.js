import axios from 'axios';
import { createSelector } from 'reselect';
import update from 'immutability-helper';
import {message} from "antd";

const moduleName = 'auth';
const LOGIN = `${moduleName}/LOGIN`;
export const LOGOUT = `${moduleName}/LOGOUT`;
const SET_USER = `${moduleName}/SET_USER`;
const SET_ERROR = `${moduleName}/SET_ERROR`;
export const UPDATE_USER = `${moduleName}/UPDATE_USER`;

const initialState = {
  user: null,
  errorLogin: '',
  isLoading: true
};

export default (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case LOGIN:
      return update(state, {
        isLoading: { $set: true },
        errorLogin: { $set: '' }
      });
    case LOGOUT:
      return update(state, {
        isLoading: { $set: true },
        errorLogin: { $set: '' },
        user: { $set: null }
      });
    case SET_USER:
      return update(state, {
        user: { $set: payload },
        isLoading: { $set: false }
      });
    case UPDATE_USER:
      return update(state, {
        user: { $set: { ...state.user, ...payload } },
      });
    case SET_ERROR:
      return update(state, {
        errorLogin: { $set: payload },
        isLoading: { $set: false }
      });
    default:
      return state
  }
};

export const stateSelector = state => state[moduleName];
export const userSelector = createSelector(stateSelector, state => state.user);
export const errorLoginSelector = createSelector(stateSelector, state => state.errorLogin);
export const isLoadingUserSelector = createSelector(stateSelector, state => state.isLoading);

export const login = (login, password) => (dispatch) => {
  dispatch({
    type: LOGIN
  });
  axios.post(`/login/`, { login, password }).then(
    response => {
      dispatch({
        type: SET_USER,
        payload: response.data
      });
    },
    error => {
      message.error(error.response.data.error)
      dispatch({
        type: SET_ERROR,
        payload: error.response.data
      });
    }
  )
};

export const register = (login, password) => (dispatch) => {
  axios.post(`/register/`, { login, password }).then(
    response => {
      dispatch({
        type: SET_USER,
        payload: response.data
      });
    },
    error => {
      dispatch({
        type: SET_ERROR,
        payload: error.response.data
      });
    }
  )
};

export const resetError = () => ({
  type: SET_ERROR,
  payload: ''
});

export const logout = () => ({
  type: LOGOUT,
});
