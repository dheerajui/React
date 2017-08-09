/* eslint-disable global-require */
import { injectReducer } from 'store/reducers';

export default store => ({
  path: 'activity',
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, callback) {
    /*
     * Webpack - use import() to create a split point and embed
     * an async module loader (jsonp) when bundling
     */
    return import(/* webpackChunkName: "all-activity" */ './containers/AllHistoryContainer')
      .then(AllHistory => {
        const activitiesReducer = require('../../modules/activities').default;
        /*  Add the reducer to the store on key 'activityData'  */
        injectReducer(store, {
          key: 'activityData',
          reducer: activitiesReducer
        });

        return callback(null, AllHistory.default);
      })
      .catch(err => {
        console.error('Dynamic page loading of history failed. ', err);
      });
  }
});
