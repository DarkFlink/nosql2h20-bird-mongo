import axios from 'axios';
import { createSelector } from 'reselect';
import update from 'immutability-helper';
import {UPDATE_USER} from "../auth/auth";
import {loadAchievements} from "../achievements/achievements";

const moduleName = 'users';
const LOAD_PROFILE = `${moduleName}/LOAD_PROFILE`;
const SET_PROFILE = `${moduleName}/SET_PROFILE`;
const SET_ERROR = `${moduleName}/SET_ERROR`;

const initialState = {
  profile: {},
  error: '',
  isLoading: true
};

export default (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case LOAD_PROFILE:
      return update(state, {
        isLoading: { $set: true },
      });
    case SET_PROFILE:
      return update(state, {
        profile: { $set: payload },
        isLoading: { $set: false }
      });
    case SET_ERROR:
      return update(state, {
        error: { $set: payload },
        isLoading: { $set: false }
      });
    default:
      return state
  }
};

export const stateSelector = state => state[moduleName];
export const profileSelector = createSelector(stateSelector, state => state.profile);
export const errorFeedSelector = createSelector(stateSelector, state => state.error);
export const isLoadingProfileSelector = createSelector(stateSelector, state => state.isLoading);

export const loadProfile = (id, load = true) => (dispatch) => {
  load &&
  dispatch({
    type: LOAD_PROFILE
  });
  axios.get(`/users/${id}/`).then(
    response => {
      dispatch({
        type: SET_PROFILE,
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

export const editProfile = (id, form, callback) => (dispatch, getState) => {
  axios.put(`/profile/`, form).then(
    response => {
      dispatch(loadProfile(id, false));
      dispatch({
        type: UPDATE_USER,
        payload: response.data
      });
      dispatch(loadAchievements(getState().users.profile._id, false))
      callback();
    },
    error => {
      dispatch({
        type: SET_ERROR,
        payload: error.response.data
      });
    }
  );
};