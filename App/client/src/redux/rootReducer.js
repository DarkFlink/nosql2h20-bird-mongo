import { combineReducers } from 'redux';

import auth from './auth/auth';
import feed from './feed/feed';
import users from './users/users';
import achievements from './achievements/achievements';

export const rootReducer = combineReducers({
  auth,
  feed,
  users,
  achievements
});