import React from 'react';
import PropTypes from 'prop-types';
import { FormattedMessage, FormattedHTMLMessage } from 'react-intl';
import { isEmpty } from 'lodash';
import CoverageItem from '../CoverageItem';
import { coverageList as messages } from '../../messages/messages';
import './CoverageList.scss';

/**
 * Renders all coverage items for a given product. Used in product details page
 * @param {Object} coverage - Object with data on coverage specific to the given product
 * @param {Function} [onMount] - Function to be run on initial mount
 * @param {Function} onViewPOCClick - Handler for when user clicks on button to view their POC
 * @param {Object} userData - Redux object containing current user data
 * @param {Object} device - Contains data for the current device
 * @param {number} deviceIndex - Index of the current device in the product list
 * @param {string} agreementsUrl - Url to deep dive to agreement sales
 * @returns {XML}
 * @class
 */
class CoverageList extends React.Component {
  componentDidMount() {
    const { onMount } = this.props;
    if (onMount) {
      onMount();
    }
  }

  render() {
    const { coverage, onViewPOCClick, userData, device, deviceIndex,
      onExtendCoverageClick, agreementsUrl, onPurchaseAgreementClick } = this.props;
    const { isFetching, data } = coverage;

    if (isFetching || typeof isFetching === 'undefined') {
      return <div className='loading' />;
    } else if (data && data.error) {
      return (
        <div className='coverage-list'>
          <div className='no-coverage'>
            {data.error}
          </div>
        </div>
      );
    } else if (data && !isEmpty(data)) {
      const { agreementsEligibility, coverageSummary, purchaseDateInfo, supportCoverage, repairCoverage } = data;
      const coverageSection = () => {
        if (agreementsEligibility && !isEmpty(agreementsEligibility)) {
          return (
            <CoverageItem
              coverageData={agreementsEligibility}
              userData={userData}
              onViewPOCClick={onViewPOCClick}
              device={device}
              deviceIndex={deviceIndex}
              onExtendCoverageClick={onExtendCoverageClick}
              agreementsUrl={agreementsUrl}
              onPurchaseAgreementClick={onPurchaseAgreementClick}
            />
          );
        } else if (coverageSummary && coverageSummary.type !== 'NONE' && coverageSummary.type !== 'UNKNOWN') {
          return (
            <CoverageItem
              coverageData={coverageSummary}
              userData={userData}
              onViewPOCClick={onViewPOCClick}
              device={device}
              deviceIndex={deviceIndex}
              onExtendCoverageClick={onExtendCoverageClick}
            />
          );
        }
        return null;
      };

      return (
        <div className='coverage-list'>
          {coverageSection()}
          {purchaseDateInfo &&
            <CoverageItem coverageData={purchaseDateInfo} userData={userData} />
          }
          {supportCoverage &&
            <CoverageItem
              coverageData={supportCoverage}
              userData={userData}
              exitEvent='Product_Details::Exit_to_CAS'
            />
          }
          {repairCoverage &&
            <CoverageItem
              coverageData={repairCoverage}
              userData={userData}
              exitEvent='Product_Details::Exit_to_Set_Up_Repair'
            />
          }
          <div className='coverage-disclaimer'>
            <FormattedHTMLMessage {...messages.disclaimerText} />
          </div>
        </div>
      );
    }
    return (
      <div className='coverage-list'>
        <div className='no-coverage'>
          <FormattedMessage {...messages.noData} />
        </div>
      </div>
    );
  }
}

CoverageList.propTypes = {
  coverage: PropTypes.object.isRequired,
  onMount: PropTypes.func,
  onViewPOCClick: PropTypes.func.isRequired,
  onExtendCoverageClick: PropTypes.func.isRequired,
  userData: PropTypes.object.isRequired,
  device: PropTypes.object.isRequired,
  deviceIndex: PropTypes.number.isRequired,
  agreementsUrl: PropTypes.string.isRequired,
  onPurchaseAgreementClick: PropTypes.func
};

CoverageList.defaultProps = {
  onMount: undefined,
  onPurchaseAgreementClick: undefined
};

export default CoverageList;
