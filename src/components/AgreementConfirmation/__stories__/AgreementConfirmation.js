import React from 'react';
import { storiesOf } from '@storybook/react';
import { withKnobs, object, text } from '@storybook/addon-knobs';
import AgreementConfirmation from '../AgreementConfirmation';

const stories = storiesOf('AgreementConfirmation', module);
stories.addDecorator(withKnobs);
stories
  .add('Agreement confirmation - translations', () => {
    const defaultDevice = {
      browserClientImage: 'https://km.support.apple.com/kb/securedImage.jsp?configcode=FF9R',
      nickName: 'Apple\'s iPhone',
      productName: 'iPhone 6s',
      serialNumber: '*******1GRYF',
      deviceIndex: 0
    };
    const device = object('Device', defaultDevice);
    const agreementNumber = text('Agreement Number', '2717A03C4531');
    return (
      <AgreementConfirmation device={device} agreementNumber={agreementNumber} />
    );
  });
