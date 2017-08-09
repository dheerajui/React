import React from 'react';
import PropTypes from 'prop-types';
import './Address.scss';

/**
 * Renders the user's address based on all available information
 * @param {string} [firstName]
 * @param {string} [lastName]
 * @param {string} [orgName]
 * @param {string} [address1]
 * @param {string} [address2]
 * @param {string} [city]
 * @param {string} [state]
 * @param {string} [postal]
 * @param {string} [country]
 * @returns {XML}
 * @constructor
 */
const Address = ({ firstName, lastName, orgName, address1, address2, city, state, postal, country }) => {
  const getAddressField = (field, props) => (field ? <div {...props}>{field}</div> : '');
  return (
    <div className='address'>
      { getAddressField(firstName, { className: 'first-name' }) }
      { getAddressField(lastName, { className: 'last-name' }) }
      { getAddressField(orgName, { className: 'org-name' }) }
      { getAddressField(address1, { className: 'street-address' }) }
      { getAddressField(address2, { className: 'street-address' }) }
      { getAddressField(city, { className: 'city' }) }
      { getAddressField(state, { className: 'state' }) }
      { getAddressField(postal, { className: 'postal-code' }) }
      { getAddressField(country, { className: 'country' }) }
    </div>
  );
};

Address.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  orgName: PropTypes.string,
  address1: PropTypes.string,
  address2: PropTypes.string,
  city: PropTypes.string,
  state: PropTypes.string,
  postal: PropTypes.string,
  country: PropTypes.string
};

Address.defaultProps = {
  firstName: '',
  lastName: '',
  orgName: '',
  address1: '',
  address2: '',
  city: '',
  state: '',
  postal: '',
  country: ''
};

export default Address;
