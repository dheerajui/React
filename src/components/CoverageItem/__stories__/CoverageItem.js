import React from 'react';
import { storiesOf } from '@storybook/react';
import CoverageItem from '../CoverageItem';

const coverage = [
  {
    description: 'Eligible for an AppleCare product',
    purchaseDate: '2016-02-19',
    status: '',
    title: 'Valid Purchase Date'
  },
  {
    covered: false,
    coveredBy: 'NONE',
    description: 'Telephone Technical Support: Active',
    expiryMessage: 'Estimated Expiration Date: {0}',
    redirectUrl: 'https://getsupport-uatb.apple.com?sn=590a441abb2fe5a082f05625&locale=en_US',
    redirectUrlText: 'Contact Apple Support',
    status: 'yellow',
    title: 'Telephone Technical Support: Expired'
  }
];

storiesOf('Coverage Item', module)
  .add('With Warning icon', () => (
    <CoverageItem coverageData={coverage[1]} />
  ))
  .add('Without any status icon', () => (
    <CoverageItem coverageData={coverage[0]} />
  ));
