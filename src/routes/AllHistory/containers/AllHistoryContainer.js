import { connect } from 'react-redux';
import { fetchAllActivities, fetchMoreActivities } from '../../../modules/activities';
import { lookupFormSubmitHandler } from '../../../modules/lookup';

import AllHistory from '../components/AllHistory';

const mapDispatchToProps = dispatch => ({
  onNextPageClick: bookmark => { dispatch(fetchMoreActivities(bookmark)); },
  onActivityListMount: () => { dispatch(fetchAllActivities()); },
  onLookupFormSubmit: values => (dispatch(lookupFormSubmitHandler(values)))
});

const mapStateToProps = state => ({
  activityData: state.activityData
});

export default connect(mapStateToProps, mapDispatchToProps)(AllHistory);
