import { combineReducers } from 'redux';
import { intlReducer } from 'react-intl-redux';
import { reducer as formReducer } from 'redux-form';
import locationReducer from './location';
import { reducer as translationReducer } from './intl';
import myDevicesReducer from '../modules/activities';
import productReducer from '../modules/product';
import proofCoverageReducer from '../modules/proofofcoverage';
import shippingLabelReducer from '../modules/shippinglabel';
import localNavReducer from '../modules/localnav';
import localePickerReducer from '../modules/locale';
import deviceListReducer from '../modules/devices';
import repairDetailsReducer from '../modules/repair';
import agreementModalReducer from '../modules/agreements';
import preSignReducer from '../modules/presign';
import errorModalReducer from '../modules/errorsmodal';
import sessionModalReducer from '../modules/sessionmodal';
import coverageReducer from '../modules/coverage';
import apiReducer from '../modules/api';
import errorReducer from '../modules/error';

/**
 * Default reducer. Return the state as is.
 * @param  {Object} state
 * @return {Object} state
 */
const defaultReducer = (state = {}) => state;

const makeRootReducer = asyncReducers => combineReducers({
  location: locationReducer,
  intl: intlReducer,
  translations: translationReducer,
  shippingLabelData: shippingLabelReducer,
  activityData: myDevicesReducer,
  localNavData: localNavReducer,
  regionData: localePickerReducer,
  devicesData: deviceListReducer,
  caseData: repairDetailsReducer,
  agreementModalData: agreementModalReducer,
  form: formReducer,
  presignData: preSignReducer,
  errorModalData: errorModalReducer,
  sessionModalData: sessionModalReducer,
  productData: productReducer,
  proofCoverageModalData: proofCoverageReducer,
  coverageData: coverageReducer,
  api: apiReducer,
  error: errorReducer,
  page: defaultReducer,
  ...asyncReducers
});

export const injectReducer = (store, { key, reducer }) => {
  store.asyncReducers[key] = reducer; // eslint-disable-line no-param-reassign
  store.replaceReducer(makeRootReducer(store.asyncReducers));
};

export default makeRootReducer;
