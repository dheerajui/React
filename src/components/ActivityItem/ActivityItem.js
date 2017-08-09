import React from 'react';
import PropTypes from 'prop-types';
import FormattedText from '../FormattedText';
import { itemDescription, isNotificationItem } from '../../services/notificationService';
import { EXIT_EVENT, EXIT_EVENT_VALUES } from '../../metrics/AnalyticsService';
import { activityItem as messages } from '../../messages/messages';
import './ActivityItem.scss';

/**
 * Display a single activity item
 * @param {Object} activityData - Data related to the current activity
 * @param {string} [className=''] - Additional class names to use for the activity item
 * @param {string} [id=''] - Id to use for the activity item
 * @param {boolean} [allActivities=false] - If the current page is All Activity or not
 * @returns {XML}
 * @constructor
 */
const ActivityItem = ({ activityData, className, id, allActivities }) => {
  const prodName = activityData.product && activityData.product.productName;

  const caseTitle = prodName
    ? (`${prodName}: ${activityData.caseTitle}`)
    : activityData.caseTitle;

  const activityTitle = allActivities
    ? (<h2 className='activity-header'>
      {caseTitle}
    </h2>)
    : (<h3 className='activity-header'>
      {caseTitle}
    </h3>);

  return (
    <div id={id} className={`activity-item ${className}`}>
      <div className='activity-header-row'>
        {activityTitle}
      </div>
      {activityData.solutions.map((solution, i) => {
        const solutionId = solution.solutionId;
        const linkId = `al-${solutionId}-${i}`;
        const a11yId = `aa-${solutionId}-${i}`;

        const iconClass = isNotificationItem(solution) // eslint-disable-line no-nested-ternary
          ? (solution.hasAlert
            ? `has-alert ${solution.solutionSubType}`
            : solution.solutionSubType)
          : '';

        const seeDetailsLink = (solution.solutionSubType === 'OtherRepair')
          ? (<a
            className='notification-link icon icon-after icon-chevronright'
            href={`/repairs/details/${solution.repairId}`}
          >
            <span
              role='text' // eslint-disable-line jsx-a11y/aria-role
            >
              <FormattedText {...messages.seeDetails} />
              <span className='a11y'>{caseTitle}</span>
            </span>
          </a>)
          : (<a
            target='_blank'
            aria-labelledby={`${linkId} ${a11yId} new-window`}
            className='notification-link icon icon-after icon-chevronright'
            data-metrics-event-name={EXIT_EVENT}
            data-metrics-event-value={EXIT_EVENT_VALUES.cas}
            href={solution.redirectUrl}
          >
            <span
              role='text' // eslint-disable-line jsx-a11y/aria-role
            >
              <FormattedText htmlId={linkId} {...messages.seeDetails} />
              <span id={a11yId} className='a11y'>{caseTitle}</span>
            </span>
          </a>);

        return (
          <div key={solutionId} className='activity-item-row'>
            <div className='activity-details'>
              <div className='left-col'>
                <span className={`icon ${iconClass}`} />
                <div className='activity-subheader'>
                  {solution.solutionTitle}
                </div>
                {itemDescription(solution, 'activity')}
              </div>
              <div className='right-col activity-link-wrapper'>
                {seeDetailsLink}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

ActivityItem.propTypes = {
  activityData: PropTypes.object.isRequired,
  className: PropTypes.string,
  id: PropTypes.string,
  allActivities: PropTypes.bool
};

ActivityItem.defaultProps = {
  className: '',
  id: '',
  allActivities: false
};

export default ActivityItem;
