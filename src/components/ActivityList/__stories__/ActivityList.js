import React from 'react';
import { storiesOf } from '@storybook/react';
import { action } from '@storybook/addon-actions';
import ActivityList from '../ActivityList';
import ACTIVITY_DATA from '../../../__mock__/activity-list.json';

storiesOf('Activity List', module)
  .add('Initial State', () => (
    <ActivityList activities={ACTIVITY_DATA} maxItemsToShow={12} onShowMoreClick={action('Show more clicked')} />
  ))
  .add('More Items Shown', () => (
    <ActivityList
      maxItemsToShow={12}
      onShowMoreClick={action('Show more clicked')}
      activities={Object.assign({}, ACTIVITY_DATA, { showMoreActivities: true })}
    />
  ));
