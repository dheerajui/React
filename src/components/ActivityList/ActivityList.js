import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage } from 'react-intl';
import { metrics } from '../../metrics/AnalyticsService';
import ActivityItem from '../ActivityItem';
import { focusElement } from '../../services/utilities';
import { activityList as messages } from '../../messages/messages';
import './ActivityList.scss';

/**
 * Initial items to show on render
 * @type {number}
 * @constant
 * @memberOf ActivityList
 */
const MIN_ITEMS = 3;
/**
 * Id prefix for selecting for accessibility
 * @type {string}
 * @constant
 * @memberOf ActivityList
 */
const ITEM_ID_PREFIX = 'activity-item-';

/**
 * Shows a list of activities with options to expand if total number is fewer than maxItemsToShow
 * @param {Object} activities - Object containing activity data from redux store
 * @param {Function} onShowMoreClick - Handler for clicking the button to expand the list
 * @param {number} maxItemsToShow - Maximum items to show at a time
 * @returns {XML}
 * @constructor
 */
const ActivityList = ({ activities, onShowMoreClick, maxItemsToShow }) => {
  if (activities.isFetching) {
    return <div className='loading' />;
  }
  if (activities.error) {
    return (<div className='activity-error'><FormattedMessage {...messages.fetchError} /></div>);
  }

  const showMore = activities.showMoreActivities;
  const activityList = activities.cases;
  const hasMoreRecords = activities.moreRecords;
  const itemCount = activityList.length;

  // Button text to show more or show less devices
  const showMoreElement = () => {
    if (showMore) {
      return <FormattedMessage {...messages.seeLess} />;
    } else if (hasMoreRecords || (itemCount > maxItemsToShow)) {
      return <FormattedMessage {...messages.seeAll} />;
    }
    return <FormattedMessage {...messages.showAll} />;
  };

  const manageFocus = () => {
    // a11y: programmatically move the focus to the first of newly loaded activity
    // use timeout of 100ms for VO to correctly get the focus and
    // also allow time for activities to load
    window.setTimeout(() => {
      const newItem = document.querySelector(`#${ITEM_ID_PREFIX}${MIN_ITEMS} h3`);
      focusElement(newItem);
    }, 100);
  };

  const showMoreLink = () => {
    const linkIconClass = showMore ? 'icon-resetcircle' : 'icon-pluscircle';

    if (activityList.length <= MIN_ITEMS && !hasMoreRecords) {
      return <div className='empty-area' />;
    } else if (hasMoreRecords || itemCount > maxItemsToShow) {
      return (
        <div className='see-more-link'>
          <a href='/activity' className='icon icon-after icon-chevronright'>
            {showMoreElement(itemCount, showMore)}
          </a>
        </div>
      );
    }
    return (
      <div className='see-more-link'>
        <button
          aria-expanded={showMore}
          className={`icon icon-after ${linkIconClass}`}
          onClick={e => {
            metrics.trackEvent({
              page: {
                content_subtype: 'Expand::History Landing Page'
              }
            });
            e.preventDefault();
            onShowMoreClick(!showMore);
            if (!showMore) {
              manageFocus();
            }
          }}
        >
          {showMoreElement()}
        </button>
      </div>
    );
  };

  if (activityList && activityList.length) {
    const visibleItems = activityList.slice(0, showMore ? maxItemsToShow : MIN_ITEMS);

    return (
      <div className='activity-wrapper'>
        <div className='activity-list'>
          {visibleItems.map((activityData, i) => (
            <ActivityItem
              activityData={activityData}
              key={activityData.caseId}
              id={ITEM_ID_PREFIX + i}
              className={(!showMore && i >= MIN_ITEMS) ? 'hide' : ''}
            />
          ))}
        </div>
        {showMoreLink()}
      </div>
    );
  }
  return (<div className='no-history'><FormattedMessage {...messages.noData} /></div>);
};

ActivityList.propTypes = {
  activities: PropTypes.object.isRequired,
  onShowMoreClick: PropTypes.func,
  maxItemsToShow: PropTypes.number.isRequired
};

ActivityList.defaultProps = {
  onShowMoreClick: undefined
};

export default ActivityList;
