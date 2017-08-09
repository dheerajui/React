import React from 'react';
import { storiesOf } from '@storybook/react';
import ShippingLabel from '../components/ShippingLabel';
import SHIPPING_DATA from '../../../__mock__/shipping-label.json';

const trackPageView = () => {};
storiesOf('Shipping Labels', module)
  .add('With full data', () => (
    <ShippingLabel {...SHIPPING_DATA} trackPageView={trackPageView} />
  ));
