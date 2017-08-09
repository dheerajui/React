/**
 * Redux actions and handlers related to activity and case data
 * @module activities
 */
import fetchService from '../services/fetchService';
import { getNotificationItems } from '../services/notificationService';
import { serverErrorMessage } from '../messages/messages';
import { actions as modalActions } from '../modules/errorsmodal';

/**
 * Constants
 */
export const REQUEST_ACTIVITIES = 'REQUEST_ACTIVITIES';
export const REQUEST_MORE_ACTIVITIES = 'REQUEST_MORE_ACTIVITIES';
export const RECEIVE_ACTIVITIES = 'RECEIVE_ACTIVITIES';
export const SEE_MORE_NOTIFICATIONS = 'SEE_MORE_NOTIFICATIONS';
export const RESET_NOTIFICATIONS = 'RESET_NOTIFICATIONS';
export const SEE_MORE_ACTIVITY = 'SEE_MORE_ACTIVITY';

const ACTIVITY_API_URL = __PROD__
  ? '/api/v1/supportaccount/activity/history'
  : `http://${__JSON_HOST__}:3004/mycases`;

const FETCH_ERROR_DATA = {
  error: true
};
/**
 * Actions
 */

/**
 * action requestActivities
 * @return {Object} action
 */
const requestActivities = () => ({
  type: REQUEST_ACTIVITIES
});

/**
 * action requestMoreActivities
 * @return {Object} action
 */
const requestMoreActivities = () => ({
  type: REQUEST_MORE_ACTIVITIES
});

/**
 * action receiveActivities
 * @param  {Object} payload        Activity data returned from server
 * @param  {Boolean} append
 * @return {Object} action
 */
const receiveActivities = (payload, append) => ({
  type: RECEIVE_ACTIVITIES,
  payload,
  append
});

/**
 * action seeMoreActivityClicked
 * @param  {Boolean} showMore Whether to show more items or not
 * @return {Object} action
 */
const seeMoreActivityClicked = (showMore = true) => ({
  type: SEE_MORE_ACTIVITY,
  showMore
});

/**
 * action seeMoreActivityClicked
 * @param  {Boolean} showMore Whether to show more items or not
 * @return {Object} action
 */
const seeMoreNotificationsClicked = (showMore = true) => ({
  type: SEE_MORE_NOTIFICATIONS,
  showMore
});

/**
 * action resetNotifications
 * @return {Object} action
 */
const resetNotifications = () => ({
  type: RESET_NOTIFICATIONS
});

/**
 * All Actions
 * @type {Object}
 */
export const actions = {
  seeMoreActivityClicked,
  seeMoreNotificationsClicked,
  requestActivities,
  requestMoreActivities,
  receiveActivities,
  resetNotifications
};

/**
 * prepare activity data
 * @param  {Object} data
 * @return {Object} modified data
 */
const _prepareData = data => (
  {
    cases: data.cases,
    notifications: getNotificationItems(data.cases),
    bookmark: data.bookmark,
    moreRecords: data.moreRecords
  }
);

/**
 * Fetch data and dispatch action
 * @return {Function} dispatch
 */
export const fetchAllActivities = (serialNumberKey = '') => dispatch => {
  dispatch(requestActivities());

  const apiUrl = serialNumberKey
      ? (`${ACTIVITY_API_URL}?serialNumberKey=${serialNumberKey}`)
      : ACTIVITY_API_URL;

  return fetchService(apiUrl, {})
    .then(data => {
      dispatch(receiveActivities(_prepareData(data), false));
    })
    .catch(
      ex => {
        console.error('Exception while fetching activities. ', ex);
        dispatch(receiveActivities(FETCH_ERROR_DATA, false));
      }
    );
};

/**
 * Fetch data and dispatch action
 * @return {Function} dispatch
 */
export const fetchMoreActivities = (bookmark = '', serialNumberKey = '') => {
  const tempUrl = bookmark ? (`${ACTIVITY_API_URL}?bookmark=${bookmark}`) : ACTIVITY_API_URL;
  const apiUrl = serialNumberKey
    ? (`${tempUrl + (bookmark ? '&' : '?')}serialNumberKey=${serialNumberKey}`)
    : tempUrl;

  return dispatch => {
    dispatch(requestMoreActivities());

    return fetchService(apiUrl, {})
    .then(data => {
      dispatch(receiveActivities(_prepareData(data), true));
    })
    .catch(
      ex => {
        console.error('Exception while fetching activities. ', ex);
        dispatch(receiveActivities(Object.assign({}, FETCH_ERROR_DATA, {
          bookmark,
          moreRecords: true
        }), true));
        dispatch(modalActions.showModal(serverErrorMessage));
      }
    );
  };
};

/**
 * Action Handler for fetch request
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object} new state
 */
const requestActivitiesHandler = (state = {}, action) => {
  if (action.type !== REQUEST_ACTIVITIES) {
    return state;
  }

  return Object.assign({}, state, {
    isFetching: true
  });
};

/**
 * Action Handler for fetch request
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object} new state
 */
const requestMoreActivitiesHandler = (state = {}, action) => {
  if (action.type !== REQUEST_MORE_ACTIVITIES) {
    return state;
  }

  return Object.assign({}, state, {
    fetchingMore: true
  });
};

/**
 * Action Handler for fetch response
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object} new state
 */
const receiveActivitiesHandler = (state = {}, action) => {
  if (action.type !== RECEIVE_ACTIVITIES) {
    return state;
  }

  const { error, bookmark, moreRecords } = action.payload;
  const prevNumOfCases = (state.cases || []).length;
  const notifications = action.payload.notifications // eslint-disable-line no-nested-ternary
    ? (action.append
      ? (state.notifications || []).concat(action.payload.notifications)
      : action.payload.notifications)
    : state.notifications;
  const cases = action.payload.cases // eslint-disable-line no-nested-ternary
    ? (action.append
      ? (state.cases || []).concat(action.payload.cases)
      : action.payload.cases)
    : state.cases;

  return Object.assign({}, state, {
    isFetching: false,
    fetchingMore: false,
    fetchComplete: true,
    cases,
    error,
    notifications,
    bookmark,
    moreRecords,
    prevNumOfCases
  });
};

/**
 * Action Handler for resetting notifications
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object} new state
 */
const resetNotificationsHandler = (state = {}, action) => {
  if (action.type !== RESET_NOTIFICATIONS) {
    return state;
  }

  return Object.assign({}, state, {
    notifications: []
  });
};

/**
 * Action handler for 'See More Activity' link
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object} new state
 */
const seeMoreActivityHandler = (state = {}, action) => {
  if (action.type !== SEE_MORE_ACTIVITY) {
    return state;
  }

  const activityData = Object.assign({}, state.activityData, {
    showMoreActivities: action.showMore
  });
  return Object.assign({}, state, activityData);
};

/**
 * Action handler for 'See More Activity' link
 * @param  {Object} state
 * @param  {Object} action
 * @return {Object} new state
 */
const seeMoreNotificationsHandler = (state = {}, action) => {
  if (action.type !== SEE_MORE_NOTIFICATIONS) {
    return state;
  }

  const activityData = Object.assign({}, state.activityData, {
    showMoreNotifications: action.showMore
  });
  return Object.assign({}, state, activityData);
};

/**
 * All Action Handlers
 * @type {Object}
 */
const ACTION_HANDLERS = {
  [REQUEST_ACTIVITIES]: requestActivitiesHandler,
  [REQUEST_MORE_ACTIVITIES]: requestMoreActivitiesHandler,
  [RECEIVE_ACTIVITIES]: receiveActivitiesHandler,
  [SEE_MORE_ACTIVITY]: seeMoreActivityHandler,
  [SEE_MORE_NOTIFICATIONS]: seeMoreNotificationsHandler,
  [RESET_NOTIFICATIONS]: resetNotificationsHandler
};

/**
 * Reducers
 */
export const initialState = {
  fetchComplete: false,
  showMoreActivities: false,
  showMoreNotifications: false,
  cases: [],
  error: false,
  notifications: [],
  bookmark: 0,
  moreRecords: false
};

const reducer = (state = initialState, action) => {
  const handler = ACTION_HANDLERS[action.type];
  return handler ? handler(state, action) : state;
};

export default reducer;
