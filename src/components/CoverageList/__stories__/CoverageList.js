import React from 'react';
import { storiesOf } from '@storybook/react';
import CoverageList from '../CoverageList';

const coverageList = {
  device: {
    browserClientImage: 'https://km.support.apple.com/kb/securedImage.jsp?configcode=GRY5',
    color: 'c8caca',
    currentDevice: false,
    deviceClass: 'iPhone',
    deviceNotSupported: false,
    eligibleProductId: '100099',
    enclosureColor: 'e5bdb5',
    images: Array(3),
    maskedSerialNumber: '•••••••0GRY5',
    model: 'iPhone8,1',
    modelName: 'iPhone 6s',
    nickName: 'iPhone 6s',
    prettyProductName: 'iPhone 6s',
    prodFamilyClassId: 'PFC3001',
    prodFamilyClassName: 'iPhone',
    prodGroupFamilyId: 'PGF31005',
    prodGroupFamilyName: 'iPhone 6',
    productName: 'IPHONE 6S',
    serialNumberKey: '590a441abb2fe5a082f05625',
    superGroupId: 'SG003',
    superGroupName: 'iPhone'
  },
  coverageData: {
    currentlyFetching: 0,
    isFetching: false,
    didInvalidate: false,
    coverage: ['NONE'],
    data: {
      notificationItem: false,
      coverageInfo: {},
      purchaseDateInfo: {
        purchaseDate: '2016-02-19',
        title: 'Valid Purchase Date',
        description: 'KEYNAME[cc.registered.UNKNOWN_PRODUCT][ContentTBD]',
        status: 'green'
      },
      agreementsEligibility: {},
      supportCoverage: {
        covered: false,
        coveredBy: 'NONE',
        expiryMessage: 'Estimated Expiration Date: {0}',
        title: 'Telephone Technical Support: Expired',
        description: 'KEYNAME[cc.support.SG003.NOPS_PPI][ContentTBD]',
        status: 'yellow',
        redirectUrl: 'https://getsupport-uatb.apple.com?sn=590a441abb2fe5a082f05625&locale=en_US',
        redirectUrlText: 'Contact Apple Support'
      },
      repairCoverage: {
        covered: false,
        coveredBy: 'NONE',
        endDate: '2017-02-18',
        expiryMessage: 'Estimated Expiration Date: {0}',
        title: 'Repairs and Service Coverage: Expired',
        description: 'KEYNAME[cc.repair.SG003.OO][ContentTBD]',
        status: 'yellow',
        redirectUrl: 'https://getsupport-uatb.apple.com?sn=590a441abb2fe5a082f05625&locale=en_US',
        redirectUrlText: 'Set up a repair'
      }
    }
  },
  userData: {
    email: 'test@apple.com',
    firstName: 'Test',
    is2FA: false,
    lastName: 'User'
  }
};

storiesOf('Coverage List', module)
  .add('Coverage List Items', () => (
    <CoverageList
      coverage={coverageList.coverageData}
      userData={coverageList.userData}
      device={coverageList.device}
    />
  ));

