import { applyMiddleware, compose, createStore } from 'redux';
import thunk from 'redux-thunk';
import { browserHistory } from 'react-router';
import metricsMiddleware from '../metrics/MetricsMiddleware';
import makeRootReducer from './reducers';
import { updateLocation } from './location';
import { fetchCsrfToken } from './csrf';

export default (initialState = {}) => {
  // ======================================================
  // Middleware Configuration
  // ======================================================
  const middleware = [thunk, metricsMiddleware];

  // ======================================================
  // Store Enhancers
  // ======================================================
  const enhancers = [];
  if (__DEV__) {
    const devToolsExtension = window.devToolsExtension;
    if (typeof devToolsExtension === 'function') {
      enhancers.push(devToolsExtension());
    }
  }

  // ======================================================
  // Store Instantiation and HMR Setup
  // ======================================================
  const store = createStore(
    makeRootReducer(),
    initialState,
    compose(
      applyMiddleware(...middleware),
      ...enhancers
    )
  );

  store.asyncReducers = {};

  // To unsubscribe, invoke `store.unsubscribeHistory()` anytime
  store.unsubscribeHistory = browserHistory.listen(nextLocation => {
    updateLocation(store)(nextLocation);
    fetchCsrfToken()(store.dispatch);
  });

  if (module.hot) {
    module.hot.accept('./reducers', () => {
      const reducers = require('./reducers').default; // eslint-disable-line global-require
      store.replaceReducer(reducers(store.asyncReducers));
    });
  }

  return store;
};
