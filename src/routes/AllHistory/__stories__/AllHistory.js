import React from 'react';
import { Provider } from 'react-intl-redux';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import AllHistory from '../components/AllHistory';
import activityData from '../../../__mock__/activity-list.json';
import createStore from '../../../store/createStore';

const store = createStore({});

storiesOf('AllHistory', module)
  .add('Basic Layout', () => (
    <Provider store={store}>
      <AllHistory
        activityData={activityData}
        onActivityListMount={action('Activity List mounted')}
        onNextPageClick={action('Next page clicked')}
        onLookupFormSubmit={action('Lookup form submitted')}
      />
    </Provider>
  ));
