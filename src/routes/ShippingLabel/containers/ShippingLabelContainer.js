import { connect } from 'react-redux';
import { shippingLabelDataLoaded, trackPageView } from '../../../modules/shippinglabel';

import ShippingLabel from '../components/ShippingLabel';

const mapDispatchToProps = dispatch => ({
  onDataLoaded: data => { dispatch(shippingLabelDataLoaded(data)); },
  trackPageView: () => { trackPageView(); }
});

const mapStateToProps = state => ({
  barcodeData: state.shippingLabelData.barcodeData,
  dispatchId: state.shippingLabelData.dispatchId,
  shippingAddress: state.shippingLabelData.shippingAddress,
  returnAddress: state.shippingLabelData.returnAddress
});

export default connect(mapStateToProps, mapDispatchToProps)(ShippingLabel);
