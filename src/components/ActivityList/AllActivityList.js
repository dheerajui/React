import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { metrics } from '../../metrics/AnalyticsService';
import ActivityItem from '../ActivityItem';
import { focusElement } from '../../services/utilities';
import { allActivityList as messages } from '../../messages/messages';
import './ActivityList.scss';

/**
 * Id prefix for selecting for accessibility
 * @type {string}
 * @constant
 * @memberOf ActivityList
 */
const ITEM_ID_PREFIX = 'activity-item-';

/**
 * Handles rendering of all the user's available activity. Includes pagination.
 * @param {Object} activityData - Object containing activity data from redux store
 * @param {Function} onNextPageClick - Handler for loading more activity
 * @param {Function} onMount - Function to be called when the component is first mounted
 * @class
 */
class AllActivityList extends React.Component {

  componentDidMount() {
    this.props.onMount();
  }

  componentDidUpdate() {
    if (this.props.activityData.fetchingMore) return;

    const newItem = document.querySelector(`#${ITEM_ID_PREFIX}${this.props.activityData.prevNumOfCases} h2`);
    if (!newItem) return;

    window.setTimeout(() => {
      focusElement(newItem);
    }, 100);
  }

  getShowMoreButton(moreRecords, onNextPageClick, fetchingMore) {
    if (fetchingMore) {
      // show a spinner
      return <div className='fetching-more loading' />;
    } else if (moreRecords) {
      // Show more button
      return this.seeMoreElement(onNextPageClick, messages.seeMore);
    }
      // Don't show a button at all
    return <div className='empty-area' />;
  }

  getActivityListContent() {
    const { activityData, onNextPageClick } = this.props;
    const isFetching = activityData.isFetching;
    const fetchingMore = activityData.fetchingMore;
    const activityList = activityData.cases;

    if (isFetching) {
      return <div className='loading' />;
    }

    if (activityList && activityList.length) {
      const bookmark = activityData.bookmark;
      const moreRecords = activityData.moreRecords;
      return (
        <div className='activity-list'>
          {this.allActivityList(activityList)}
          {this.getShowMoreButton(moreRecords, () => { onNextPageClick(bookmark); }, fetchingMore)}
        </div>
      );
    }
    return (
      <div className='activity-list'>
        <div className='no-history'><FormattedMessage {...messages.noData} /></div>
      </div>
    );
  }

  allActivityList(activityList) {
    return (
      <div className='activity-wrapper'>
        {activityList.map((activityData, i) => (
          <ActivityItem
            activityData={activityData}
            key={activityData.caseId}
            id={ITEM_ID_PREFIX + i}
            allActivities
          />
        ))}
      </div>
    );
  }

  seeMoreElement(handler, message) {
    return (
      <div className='see-more-link'>
        <button
          aria-expanded='false'
          aria-controls='activity-list'
          onClick={() => {
            metrics.trackEvent({
              page: {
                content_subtype: 'Expand::History History Page'
              }
            });
            handler();
          }}
        >
          <FormattedMessage {...message} />
        </button>
      </div>
    );
  }

  render() {
    return this.getActivityListContent();
  }
}

AllActivityList.propTypes = {
  activityData: PropTypes.object.isRequired,
  onNextPageClick: PropTypes.func.isRequired,
  onMount: PropTypes.func.isRequired
};

export default AllActivityList;
