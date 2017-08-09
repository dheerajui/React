/**
 * Redux actions and handlers related to shipping label
 * @module proofofcoverage
 */
import { metrics } from '../metrics/AnalyticsService';

/**
 * Constants
 */
export const SHIPPING_LABEL_DATA_LOADED = 'SHIPPING_LABEL_DATA_LOADED';

/**
 * Actions
 */
const shippingLabelDataLoaded = (data = {}) => ({
  type: SHIPPING_LABEL_DATA_LOADED,
  payload: data
});

export const actions = {
  shippingLabelDataLoaded
};

/**
 * Action Handlers
 */
const ACTION_HANDLERS = {
  [SHIPPING_LABEL_DATA_LOADED]: (state = {}, action) => (action.payload ? action.payload : state)
};

/**
 * send a page load omniture event
 */
export const trackPageView = () => {
  metrics.trackPage({
    page: {
      content_subtype: 'AUS_Post_Label_Load'
    }
  });
};

/**
 * Reducers
 */
export const initialState = {
  barcodeData: {},
  dispatchId: '',
  shippingAddress: {},
  returnAddress: {}
};

const reducer = (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};

export default reducer;
