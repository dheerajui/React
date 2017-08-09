import React from 'react';
import { storiesOf } from '@storybook/react';
import ActivityItem from '../ActivityItem';
import ACTIVITY_DATA from '../../../__mock__/activity-list.json';

const activityList = ACTIVITY_DATA.cases;

storiesOf('Activity Item', module)
  .add('With Warning icon', () => (
    <ActivityItem activityData={activityList[0]} />
  ))
  .add('Without any status icon', () => (
    <ActivityItem activityData={activityList[1]} />
  ));
