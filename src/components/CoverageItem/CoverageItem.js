import React from 'react';
import PropTypes from 'prop-types';
import { injectIntl, intlShape } from 'react-intl';
import { formatString } from '../../services/utilities';
import { metrics, EXIT_EVENT } from '../../metrics/AnalyticsService';
import ExtendCoverageButton from '../ExtendCoverageButton';
import { coverageItem as messages } from '../../messages/messages';
import './CoverageItem.scss';

const VIEW_POC_URL = '/agreements/epoc/view/';
const SN_PLACEHOLDER = '?sn={0}';
const TRACK_MORE_PH = 'track_more';
const TRACK_LEARN_PH = 'track_learn';

const STATUS_ICON = {
  green: 'icon icon-checksolid green ',
  yellow: 'icon icon-exclamationsolid yellow',
  blue: 'icon icon-exclamationsolid blue'
};

/**
 * Coverage Section to be displayed on the Product Details page.
 * @param {Object} intl - intl object provided by react-intl injectIntl
 * @param {Object} coverageData - Object containing the data relevant to the current section
 * @param {Function} [onViewPOCClick] - Handler for when user clicks to view their POC
 * @param {Object} userData - Object containing the current user data
 * @param {string} exitEvent
 * @param {Function} [onExtendCoverageClick] - Handler for when user clicks to extend coverage on their device
 * @param {Object} [device] - Object containing data on the current device
 * @param {number} [deviceIndex] - Number representing the index in the device list of the current device
 * @param {string} [agreementsUrl] - Url to deep dive for agreements registration
 * @param {func} [onPurchaseAgreementClick] - Handler for clicking to purchase an agreement
 * @returns {XML}
 * @constructor
 */
const CoverageItem = ({ intl, coverageData, onViewPOCClick, userData, exitEvent,
                      onExtendCoverageClick, device, deviceIndex, agreementsUrl, onPurchaseAgreementClick }) => {
  const {
    // Common among all sections
    title,
    description,
    status,
    // agreementsEligibility
    type,
    extendLabel,
    eligibilityType,
    eligibilityRedirectUrl,
    // coverageSummary
    agreementCode,
    agreementNumber,
    viewPocLabel,
    // supportCoverage and repairCoverage
    endDate,
    redirectUrlText,
    redirectUrl
  } = coverageData;

  const is2FA = userData && userData.is2FA;
  const actionLink = () => {
    // Render view POC
    if (viewPocLabel && agreementCode) {
      if (is2FA) {
        return (
          <div className='coverage-actions'>
            <form action={VIEW_POC_URL} method='post' target='_blank'>
              <input type='hidden' name='agreementCode' value={agreementCode} />
              <input type='hidden' name='serialNumberKey' value={device.serialNumberKey} />
              <button
                type='submit'
                className='icon icon-after icon-chevronright section-button'
                data-metrics-event-name={EXIT_EVENT}
                data-metrics-event-value={'Product_Details::Exit_to_2Fac_Coverage_Modal_View'}
              >
                {viewPocLabel}
              </button>
            </form>
          </div>
        );
      }
      return (
        <div className='coverage-actions'>
          <button
            className='view-poc'
            onClick={e => {
              if (onViewPOCClick) {
                e.preventDefault();
                metrics.trackEvent({
                  page: {
                    content_subtype: 'Product_Details::Coverage_Modal_View'
                  }
                });
                onViewPOCClick(agreementCode);
              }
            }}
          >
            {viewPocLabel}
          </button>
        </div>
      );

    // Render extend coverage button
    } else if (extendLabel) {
      return (
        <div className='coverage-actions'>
          <ExtendCoverageButton
            onOpenModalClick={onExtendCoverageClick}
            deviceInfo={device}
            deviceIndex={deviceIndex}
            eligibility={{ type, extendLabel, eligibilityType, eligibilityRedirectUrl }}
            agreementsUrl={agreementsUrl}
            onPurchaseAgreementClick={onPurchaseAgreementClick}
          />
        </div>
      );
    // Render button specific to the section
    } else if (redirectUrlText) {
      return (
        <div className='coverage-actions'>
          <a
            href={redirectUrl}
            target='_blank'
            data-metrics-event-name={EXIT_EVENT}
            data-metrics-event-value={exitEvent || 'exit to cas'}
            className='icon icon-after icon-chevronright section-button'
          >
            {redirectUrlText}
          </a>
        </div>
      );
    }

    return null;
  };

  // Return any text that would appear above the description. Usually expiration or agreement number
  const detailsText = () => {
    if (agreementNumber) {
      return (
        <div className='coverage-details-text'>
          {intl.formatMessage(messages.agreementNumber)}: {agreementNumber}
        </div>
      );
    }
    return null;
  };

  const dateOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  };

  const descriptionReplaced = () => {
    const updatedDescription = (description &&
      (description.includes(TRACK_MORE_PH) || description.includes(TRACK_LEARN_PH)))
    ? formatString(description, {
      [TRACK_LEARN_PH]: 'Product_Details::Exit_to_Learn_Product_Coverage',
      [TRACK_MORE_PH]: 'Product_Details::Exit_to_More_About_AC'
    })
    : description;

    if (endDate) {
      return formatString(updatedDescription, {
        0: intl.formatDate(new Date(endDate), dateOptions)
      });
    } else if (updatedDescription && updatedDescription.includes(SN_PLACEHOLDER)) {
      return is2FA
      ? formatString(updatedDescription, {
        0: device.maskedSerialNumber
      })
      : updatedDescription.replace(SN_PLACEHOLDER, '');
    }
    return updatedDescription;
  };

  return (
    <div className='coverage-item'>
      <span className={`coverage-icon ${STATUS_ICON[status]}`} />
      <div className='coverage-details'>
        <div className='coverage-subheader'>
          <h3>{title}</h3>
        </div>
        <div className='coverage-details-wrapper'>
          {detailsText()}
          <div className='coverage-description' dangerouslySetInnerHTML={{ __html: descriptionReplaced() }} />
        </div>
        {actionLink()}
      </div>
    </div>
  );
};

CoverageItem.propTypes = {
  intl: intlShape.isRequired,
  coverageData: PropTypes.object.isRequired,
  onViewPOCClick: PropTypes.func,
  onExtendCoverageClick: PropTypes.func,
  userData: PropTypes.object.isRequired,
  device: PropTypes.object,
  deviceIndex: PropTypes.number,
  agreementsUrl: PropTypes.string,
  exitEvent: PropTypes.string,
  onPurchaseAgreementClick: PropTypes.func
};

CoverageItem.defaultProps = {
  onViewPOCClick: undefined,
  onExtendCoverageClick: undefined,
  device: {},
  deviceIndex: 0,
  agreementsUrl: '',
  exitEvent: '',
  onPurchaseAgreementClick: undefined
};

export default injectIntl(CoverageItem);
