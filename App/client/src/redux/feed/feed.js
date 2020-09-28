import axios from 'axios';
import { createSelector } from 'reselect';
import update from 'immutability-helper';
import {loadAchievements} from "../achievements/achievements";

const moduleName = 'feed';
const LOAD_FEED = `${moduleName}/LOAD_FEED`;
const SET_FEED = `${moduleName}/SET_FEED`;
const SET_ERROR = `${moduleName}/SET_ERROR`;
const UPDATE_POST = `${moduleName}/UPDATE_POST`;

const initialState = {
  feed: [],
  error: '',
  isLoading: true
};

export default (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case LOAD_FEED:
      return update(state, {
        isLoading: { $set: true },
      });
    case SET_FEED:
      return update(state, {
        feed: { $set: payload },
        isLoading: { $set: false }
      });
    case SET_ERROR:
      return update(state, {
        error: { $set: payload },
        isLoading: { $set: false }
      });
    case UPDATE_POST:
      return update(state, {
        feed: {
          [state.feed.indexOf(state.feed.find(item => item._id === payload._id))]: {
            $set: payload
          }
        }
      });
    default:
      return state
  }
};

export const stateSelector = state => state[moduleName];
export const feedSelector = createSelector(stateSelector, state => state.feed);
export const errorFeedSelector = createSelector(stateSelector, state => state.error);
export const isLoadingFeedSelector = createSelector(stateSelector, state => state.isLoading);

export const loadFeed = (() => {
  let lastFilters = null;
  return (load = true, filters = lastFilters) => (dispatch) => {
    if (load) {
      dispatch({
        type: LOAD_FEED
      });
    }
    if (filters) {
      lastFilters = filters
    }
    axios.get(`/posts/`, { params: filters }).then(
      response => {
        dispatch({
          type: SET_FEED,
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
  }
})();
export const deletePost = id => (dispatch) => {
  axios.delete(`/posts/${id}/`).then(
    response => {
      dispatch(loadFeed(false))
    },
    error => {
      dispatch({
        type: SET_ERROR,
        payload: error.response.data
      });
    }
  )
};
export const createPost = (form, callback) => (dispatch, getState) => {
  axios.post(`/posts/`, form).then(
    response => {
      dispatch(loadFeed(false));
      dispatch(loadAchievements(getState().users.profile._id, false));
      callback()
    },
    error => {
      dispatch({
        type: SET_ERROR,
        payload: error.response.data
      });
    }
  );
};
export const editPost = (id, form, callback) => (dispatch) => {
  axios.put(`/posts/${id}/`, form).then(
    response => {
      dispatch({
        type: UPDATE_POST,
        payload: response.data
      });
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