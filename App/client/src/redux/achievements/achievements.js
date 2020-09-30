import axios from 'axios';
import { createSelector } from 'reselect';
import update from 'immutability-helper';
import {UPDATE_USER} from "../auth/auth";

const moduleName = 'achievements';
const LOAD_ACHIEVEMENTS = `${moduleName}/LOAD_ACHIEVEMENTS`;
const SET_ACHIEVEMENTS = `${moduleName}/SET_ACHIEVEMENTS`;
const SET_ERROR = `${moduleName}/SET_ERROR`;

const initialState = {
  achievements: [],
  statistics: {},
  error: '',
  isLoading: true
};

export default (state = initialState, action) => {
  const {type, payload} = action;
  switch (type) {
    case LOAD_ACHIEVEMENTS:
      return update(state, {
        isLoading: { $set: true },
      });
    case SET_ACHIEVEMENTS:
      return update(state, {
        achievements: { $set: payload.achievements },
        statistics: { $set: payload.statistics },
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
export const achievementsSelector = createSelector(stateSelector, state => state.achievements);
export const statisticsSelector = createSelector(stateSelector, state => state.statistics);
export const errorFeedSelector = createSelector(stateSelector, state => state.error);
export const isLoadingAchievementsSelector = createSelector(stateSelector, state => state.isLoading);

export const loadAchievements = (id, load = true) => (dispatch) => {
  if (id) {
    load &&
    dispatch({
      type: LOAD_ACHIEVEMENTS
    });
    axios.get(`/users/${id}/achievements/`).then(
      achievementsResponse =>
	axios.get(`/statistics/`).then(
	      statisticsResponse => {
		dispatch({
		  type: SET_ACHIEVEMENTS,
		  payload: {
		    achievements: achievementsResponse.data,
		    statistics: statisticsResponse.data,
		  }
		});
	      },
	      error => {
		dispatch({
		  type: SET_ERROR,
		  payload: error.response.data
		});
	      }
	    )
    )
  }
};
