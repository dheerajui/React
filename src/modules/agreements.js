/**
 * Redux actions and handlers related to agreement registration
 * @module agreements
 */
import { SubmissionError, change } from 'redux-form';
import fetchService from '../services/fetchService';
import { TOGGLE_ERROR_MODAL_SHOW, actions as errorActions } from '../modules/errorsmodal';
import { serverErrorMessage } from '../messages/messages';

/**
 * Constants
 */
export const TOGGLE_AGREEMENT_MODAL_SHOW = 'TOGGLE_AGREEMENT_MODAL_SHOW';
export const TOGGLE_AGREEMENT_MODAL_HIDE = 'TOGGLE_AGREEMENT_MODAL_HIDE';
export const ADD_AGREEMENT_SUBMISSION_INFO = 'ADD_AGREEMENT_SUBMISSION_INFO';
export const REQUEST_TERMS_CONDITIONS = 'REQUEST_TERMS_CONDITIONS';
export const RECEIVE_TERMS_CONDITIONS = 'RECEIVE_TERMS_CONDITIONS';
export const REQUEST_ADDRESS_FORM_FIELDS = 'REQUEST_ADDRESS_FORM_FIELDS';
export const RECEIVE_ADDRESS_FORM_FIELDS = 'RECEIVE_ADDRESS_FORM_FIELDS';
export const AGREEMENT_REGISTRATION_API = __PROD__
  ? '/api/v1/supportaccount/agreements/enroll'
  : `http://${__JSON_HOST__}:3004/agreementregistration`;
export const TNC_API = __PROD__
  ? '/api/v1/supportaccount/cds/termsAndConditions'
  : `http://${__JSON_HOST__}:3004/tnc`;
/**
 * Endpoint for validating the agreement number with the backend
 * @type {string}
 */
export const AGREEMENT_NUMBER_VALIDATION_API = __PROD__
  ? '/api/v1/supportaccount/agreements/enroll/validate'
  : `http://${__JSON_HOST__}:3004/validateagreement`;

/**
 * Endpoint for fetching adress form fields
 * @type {string}
 */
export const ADDRESS_FORM_FIELDS_API = __PROD__
  ? '/api/v1/supportaccount/addressForm'
  : `http://${__JSON_HOST__}:3004/addressFormFields`;
/**
 * Actions
 */
/**
 * action showModal
 * @param  {Object} device - Object containing the device data that was clicked
 * @return {Object} action
 */
const showModal = (device = {}) => ({
  type: TOGGLE_AGREEMENT_MODAL_SHOW,
  device
});

/**
 * action hideModal
 * @return {Object} action
 */
const hideModal = () => ({
  type: TOGGLE_AGREEMENT_MODAL_HIDE
});

/**
 * action addSubmissionInfo
 * @param {string} agreementNumber
 */
const addSubmissionInfo = agreementNumber => ({
  type: ADD_AGREEMENT_SUBMISSION_INFO,
  agreementNumber
});

/**
 * action requestTermsConditions
 */
const requestTermsConditions = () => ({
  type: REQUEST_TERMS_CONDITIONS
});

/**
 * action receiveTermsConditions
 */
const receiveTermsConditions = (terms = {}) => ({
  type: RECEIVE_TERMS_CONDITIONS,
  terms
});

/**
 * action receiveAddressFormFields
 */
const receiveAddressFormFields = (addressFormFields = []) => ({
  type: RECEIVE_ADDRESS_FORM_FIELDS,
  addressFormFields
});

/**
 * action requestAddressFormFields
 */
const requestAddressFormFields = () => ({
  type: REQUEST_ADDRESS_FORM_FIELDS
});

/**
 * All Actions
 * @type {Object}
 */
export const actions = {
  showModal,
  hideModal,
  addSubmissionInfo,
  requestTermsConditions,
  receiveTermsConditions,
  requestAddressFormFields,
  receiveAddressFormFields
};

/**
 * Field names for the registration form
 * @type {Array}
 */
const fieldNames = ['address1', 'address2', 'address3', 'address4', 'city', 'state', 'postal'];

/**
 * Post the registration form data and either show errors or redirect to the confirmation page
 * @param agreementNumber
 * @param serialNumberKey
 * @param emailAddress
 * @param templateID
 * @param address1
 * @param address2
 * @param address3
 * @param address4
 * @param city
 * @param state
 * @param postal
 * @returns {Function}
 */
export const fetchAgreementRegistrationSubmission = ({ agreementNumber, serialNumberKey,
                                                    emailAddress, templateID, address1, address2, address3, address4,
                                                    city, state, postal }) => {
  const address = {
    address1,
    address2,
    address3,
    address4,
    city,
    state,
    postal
  };
  const body = JSON.stringify({
    agreementNumber,
    serialNumberKey,
    emailAddress,
    templateID,
    address
  });

  return (dispatch, getState) => {
    const options = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'X-Apple-CSRF-Token': getState().api.csrfToken
      }),
      body
    };
    return fetchService(AGREEMENT_REGISTRATION_API, options, dispatch)
      .then(response => {
        if (response.agreementCode) {
          dispatch(addSubmissionInfo(agreementNumber));
        } else {
          throw (errorActions.showModal(serverErrorMessage));
        }
      })
      .catch(ex => {
        if (ex.type === TOGGLE_ERROR_MODAL_SHOW || !fieldNames.includes(ex.errorToken)) {
          dispatch(errorActions.showModal(serverErrorMessage));
        } else {
          // Known submission errors will be displayed inline on the field that is affected
          // Only one error will come from the backend.
          // ex.errorToken will have the field name, and ex.errorMessage will be the error message
          throw new SubmissionError({ [ex.errorToken]: ex.errorMessage });
        }
      });
  };
};

/**
 * Fetch the terms and conditions to display in the agreement registration form
 */
export const fetchTermsConditions = locale => dispatch => {
  dispatch(requestTermsConditions());

  return fetchService(`${TNC_API}?uiLocale=${locale}`, {})
      .then(response => {
        dispatch(receiveTermsConditions(response));
      })
      .catch(() => {
        dispatch(receiveTermsConditions());
        dispatch(errorActions.showModal(serverErrorMessage));
      });
};

/**
 * fetchAddressFormsFields
 * @param locale
 */
export const fetchAddressFormsFields = locale => dispatch => {
  dispatch(requestAddressFormFields());

  return fetchService(`${ADDRESS_FORM_FIELDS_API}?uiLocale=${locale}`, {})
      .then(response => {
        dispatch(receiveAddressFormFields(response.addressFormFields));
      })
      .catch(() => {
        dispatch(receiveAddressFormFields());
        dispatch(errorActions.showModal(serverErrorMessage));
      });
};
/**
 * agreementNumberAsyncValidate - Check with backend to see if the agreement number entered is valid
 * @param agreementNumber
 * @param serialNumberKey
 * @returns {Promise} contains the localized error message to display in the form, or a templateID for the plan
 */
export const agreementNumberAsyncValidate = ({ agreementNumber, serialNumberKey }) => {
  const body = JSON.stringify({
    agreementNumber,
    serialNumberKey
  });

  return (dispatch, getState) => {
    const options = {
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
        'X-Apple-CSRF-Token': getState().api.csrfToken
      }),
      body
    };
    return fetchService(AGREEMENT_NUMBER_VALIDATION_API, options, dispatch)
      .then(response => {
        dispatch(change('agreement-registration', 'templateID', response.templateID));
      })
      .catch(ex => {
        if (ex.type === TOGGLE_ERROR_MODAL_SHOW) {
          dispatch(errorActions.showModal(serverErrorMessage));
          throw { agreementNumber: serverErrorMessage }; // eslint-disable-line no-throw-literal
        } else {
          throw { agreementNumber: ex.errorMessage }; // eslint-disable-line no-throw-literal
        }
      });
  };
};

/**
 * Action handler for opening the modal
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object} new state
 */
const showModalHandler = (state = {}, action) => {
  if (action.type !== TOGGLE_AGREEMENT_MODAL_SHOW) {
    return state;
  }

  return Object.assign({}, state, { isOpen: true, device: action.device });
};

/**
 * Action handler for closing the modal
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object} new state
 */
const hideModalHandler = (state = {}, action) => {
  if (action.type !== TOGGLE_AGREEMENT_MODAL_HIDE) {
    return state;
  }

  return Object.assign({}, state, { isOpen: false, device: {} });
};

/**
 * Action handler for adding the agreement number to the state and setting the isSubmitted flag
 * @param state
 * @param action
 * @returns {*}
 */
const addSubmissionInfoHandler = (state = {}, action) => {
  if (action.type !== ADD_AGREEMENT_SUBMISSION_INFO) {
    return state;
  }

  return Object.assign({}, state, { agreementNumber: action.agreementNumber, isSubmitted: true });
};

/**
 * Action handler for requesting to fetch the terms and conditions
 * @param state
 * @param action
 * @returns {*}
 */
const requestTermsConditionsHandler = (state = {}, action) => {
  if (action.type !== REQUEST_TERMS_CONDITIONS) {
    return state;
  }

  return Object.assign({}, state, {
    terms: {
      isFetching: true
    }
  });
};

/**
 * Action handler for receiving the terms and conditions
 * @param state
 * @param action
 * @returns {*}
 */
const receiveTermsConditionsHandler = (state = {}, action) => {
  if (action.type !== RECEIVE_TERMS_CONDITIONS) {
    return state;
  }

  return Object.assign({}, state, {
    terms: {
      isFetching: false,
      content: action.terms
    }
  });
};

/**
 * Action handler for requesting to fetch the address form fields
 * @param state
 * @param action
 * @returns {*}
 */
const requestAddressFormFieldsHandler = (state = {}, action) => {
  if (action.type !== REQUEST_ADDRESS_FORM_FIELDS) {
    return state;
  }

  return Object.assign({}, state, {
    fetchingAddress: true
  });
};

/**
 * Action handler for receiving the address form fields
 * @param state
 * @param action
 * @returns {*}
 */
const receiveAddressFormFieldsHandler = (state = {}, action) => {
  if (action.type !== RECEIVE_ADDRESS_FORM_FIELDS) {
    return state;
  }

  return Object.assign({}, state, {
    fetchingAddress: false,
    addressFormFields: action.addressFormFields
  });
};

/**
 * All Action Handlers
 * @type {Object}
 */
const ACTION_HANDLERS = {
  [TOGGLE_AGREEMENT_MODAL_SHOW]: showModalHandler,
  [TOGGLE_AGREEMENT_MODAL_HIDE]: hideModalHandler,
  [ADD_AGREEMENT_SUBMISSION_INFO]: addSubmissionInfoHandler,
  [REQUEST_TERMS_CONDITIONS]: requestTermsConditionsHandler,
  [RECEIVE_TERMS_CONDITIONS]: receiveTermsConditionsHandler,
  [RECEIVE_ADDRESS_FORM_FIELDS]: receiveAddressFormFieldsHandler,
  [REQUEST_ADDRESS_FORM_FIELDS]: requestAddressFormFieldsHandler
};

/**
 * Reducers
 */
export const initialState = {
  isOpen: false,
  device: {},
  terms: {
    isFetching: false
  },
  isSubmitted: false,
  fetchingAddress: false,
  addressFormFields: []
};

const reducer = (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};

export default reducer;
