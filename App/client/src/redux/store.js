import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import persistState from 'redux-localstorage';
import { rootReducer } from './rootReducer';

const configureStore = initialState => {
  const enhancer = compose(applyMiddleware(thunk), persistState(['auth']));

  return createStore(rootReducer, initialState, enhancer);
};

const store = configureStore();

export default store;