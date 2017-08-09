import React from 'react';
import CSSTransitionGroup from 'react-transition-group/CSSTransitionGroup';
import AppleCareImage from '../AppleCareImage';
import PageTitle from '../PageTitle';
import NavigationLink from '../NavigationLink';
import { agreementConfirmation as messages } from '../../messages/messages';
import './AgreementConfirmation.scss';

/**
 * Confirmation page for once a user has registered an agreement. It will be displayed on the same route
 * as the registration form itself after submission and validation.
 * @returns {XML}
 * @constructor
 */
const AgreementConfirmation = () => {
  const appleCareImageSize = 90;

  return (
    <CSSTransitionGroup
      transitionName='component-mount'
      transitionAppear
      transitionAppearTimeout={400}
      transitionEnter={false}
      transitionLeave={false}
      component='div'
      className='agreement-confirmation'
    >
      <div className='applecare-container'>
        <AppleCareImage size={appleCareImageSize} />
      </div>
      <div className='page-title-container'>
        <PageTitle title={messages.title} subheading={messages.subhead} />
      </div>
      <div className='go-to-mysupport content-area'>
        <NavigationLink />
      </div>
    </CSSTransitionGroup>
  );
};

export default AgreementConfirmation;
