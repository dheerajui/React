import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage } from 'react-intl';
import Address from '../../../components/Address';
import { shippingLabel as messages } from '../../../messages/messages';
import HEADING_IMAGE from './images/eParcel_header.jpg';
import './ShippingLabel.scss';

/**
* creates barcode image
*/
const getBarcodeImage = imageData => {
  if (imageData) {
    return (<img src={`data:image/gif;base64,${imageData}`} alt='' className='barcode' />);
  }
  return (<span className='barcode'>barcode loading ...</span>);
};
/**
 * Component defining the route for displaying shipping Label
 * @param {Object} barcodeData
 * @param {Object} shippingAddress
 * @param {Object} returnAddress
 * @param {String} dispatchId
 * @param {func} trackPageView
 * @returns {XML}
 * @constructor
 */
const ShippingLabel = props => {
  // send omniture page load event
  props.trackPageView();

  return (
    <div className='shipping-label-wrapper'>
      <div className='shipping-label-instructions'>
        <FormattedHTMLMessage {...messages.instructions} />
      </div>
      <div className='shipping-label'>
        <div className='header'>
          <img alt='' src={HEADING_IMAGE} />
          <h1 className='header-main'>eParcel POST RETURNS</h1>
          <h2 className='header-sub'>For Post Office Use: Scan Barcode. No Payment Required.</h2>
        </div>
        <div className='post-to-address'>
          <div className='header-send-to'>DELIVERY TO</div>
          <Address {...props.shippingAddress} />
        </div>
        <div className='delivery-instuction-head text-5'>DELIVERY INSTRUCTIONS</div>
        <div className='delivery-instuction-body text-6'>
          DELIVER THE PACKAGE TO THE RECEIVING DOCK, PLEASE RING THE BELL FOR ATTENDANCE.
          DO NOT LEAVE THE PACKAGE UNATTENDED
        </div>
        <div className='signature-block'>
          <div className=''>SIGNATURE ON DELIVERY REQUIRED&emsp;&emsp;PARCEL 1 OF 1</div>
        </div>
        <div className='barcode-wrapper'>
          <div className='articleId'>AP Article Id: {props.barcodeData.articleId}</div>
          <div className='barcode-image'>{getBarcodeImage(props.barcodeData.barcodeImage)}</div>
          <div className='articleId'>AP Article Id: {props.barcodeData.articleId}</div>
        </div>
        <div className='post-from-address'>
          <div className='text-5'>SENDER</div>
          <div className='dispatchId'>{props.dispatchId}</div>
          <Address {...props.returnAddress} />
        </div>
      </div>
      <div className='shipping-label-notes'>
        <FormattedHTMLMessage {...messages.notes} />
      </div>
    </div>
  );
};

ShippingLabel.propTypes = {
  barcodeData: PropTypes.object.isRequired,
  dispatchId: PropTypes.string.isRequired,
  shippingAddress: PropTypes.object.isRequired,
  returnAddress: PropTypes.object,
  trackPageView: PropTypes.func.isRequired
};

export default ShippingLabel;
