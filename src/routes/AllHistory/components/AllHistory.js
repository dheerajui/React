import PropTypes from 'prop-types';
import React from 'react';
import { metrics } from '../../../metrics/AnalyticsService';
import Divider from '../../../components/Divider';
import AllActivityList from '../../../components/ActivityList/AllActivityList';
import NeedMoreHelp from '../../../components/NeedMoreHelp';
import PageTitle from '../../../components/PageTitle';
import NavigationLink from '../../../components/NavigationLink';
import RepairLookupSection from '../../../components/RepairLookupSection';
import { allHistory as messages } from '../../../messages/messages';
import './AllHistory.scss';

/**
 * Component that lists all the activities
 * @param  {Object} activityData
 * @param  {Function} onActivityListMount
 * @param  {Function} onNextPageClick
 * @param  {Function} onLookupFormSubmit
 * @return {XML}
 * @class
 */
class AllHistory extends React.Component {

  componentDidMount() {
    metrics.trackPage({
      page: {
        content_subtype: 'History::Main'
      }
    });
  }

  render() {
    const { activityData, onActivityListMount, onNextPageClick, onLookupFormSubmit } = this.props;
    return (
      <div className='all-history-page'>
        <div className='heading content-area'>
          <PageTitle title={{ ...messages.pageTitle, tagName: 'h1' }} />
          <NavigationLink />
        </div>
        <section className='all-activities content-area narrow-content'>
          <AllActivityList
            activityData={activityData}
            onMount={onActivityListMount}
            onNextPageClick={onNextPageClick}
          />
        </section>
        <Divider />
        <section className='lookup content-area'>
          <RepairLookupSection onLookupFormSubmit={onLookupFormSubmit} />
        </section>
        <Divider />
        <section className='content-area'>
          <NeedMoreHelp />
        </section>
      </div>
    );
  }
}

AllHistory.propTypes = {
  activityData: PropTypes.object.isRequired,
  onNextPageClick: PropTypes.func.isRequired,
  onActivityListMount: PropTypes.func.isRequired,
  onLookupFormSubmit: PropTypes.func.isRequired
};

export default AllHistory;
