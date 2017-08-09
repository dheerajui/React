import PropTypes from 'prop-types';
import React from 'react';
import GlobalFooter from '../../../components/GlobalFooter';
import './BasicLayout.scss';

/**
 * Layout that only renders the provided content and Global Footer. Mainly used for error pages
 * @param children
 * @constructor
 */
const BasicLayout = ({ children }) => (
  <div className='container text-center'>
    <div className='basic-layout__viewport'>
      {children}
    </div>
    <GlobalFooter returnUrl={location.pathname} />
  </div>
);

BasicLayout.propTypes = {
  children: PropTypes.element.isRequired
};

export default BasicLayout;

