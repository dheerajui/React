/* eslint-disable global-require */
import { injectReducer } from 'store/reducers';

export default store => ({
  path: '/repairs/shippingLabel/dispatchId/:dispatchId',
  /*  Async getComponent is only invoked when route matches   */
  getComponent(nextState, callback) {
    /*
     * Webpack - use import() to create a split point and embed
     * an async module loader (jsonp) when bundling
     */
    return import(/* webpackChunkName: "shipping-label" */ './containers/ShippingLabelContainer')
      .then(ShippingLabel => {
        const shippingLabelReducer = require('../../modules/shippinglabel').default;
        /*  Add the reducer to the store on key 'shippingLabelData'  */
        injectReducer(store, {
          key: 'shippingLabelData',
          reducer: shippingLabelReducer
        });

        return callback(null, ShippingLabel.default);
      })
      .catch(err => {
        console.error('Dynamic page loading of shipping label failed. ', err);
      });
  }
});
