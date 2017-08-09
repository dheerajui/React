import React from 'react';
import { storiesOf } from '@storybook/react';
import Address from '../Address';
import ADDRESS_DATA from '../../../__mock__/shipping-label.json';

storiesOf('Address', module)
  .add('With full address data', () => (
    <Address {...ADDRESS_DATA.shippingAddress} />
  ))
  .add('With no country field', () => (
    <Address {...{
      address1: '30 Pearson St',
      address2: 'APT#301',
      city: 'Charlestown',
      state: 'NSW',
      postalCode: '2290'
    }}
    />
  ))
  .add('With emptry street2 field', () => (
    <Address {...{
      streetAddress: '30 Pearson St',
      streetAddress2: '',
      city: 'Charlestown',
      state: 'NSW',
      postalCode: '2290',
      country: 'Australia'
    }}
    />
  ))
  .add('With no address data', () => (
    <Address />
  ));
