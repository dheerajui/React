import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { browserHistory, Router } from 'react-router';
import { Provider } from 'react-intl-redux'; // Wraps the IntlProvider of react-intl with the Provider for react-redux

/**
 * Main container wrapping all routes and components
 * @param {Object} routes
 * @param {Object} store
 * @returns {XML}
 * @class
 */
class AppContainer extends Component {
  static propTypes = {
    routes: PropTypes.object.isRequired,
    store: PropTypes.object.isRequired
  };

  shouldComponentUpdate() {
    return false;
  }

  render() {
    const { routes, store } = this.props;

    return (
      <Provider store={store}>
        <div className='app-root'>
          <Router onUpdate={() => window.scrollTo(0, 0)} history={browserHistory} >
            {routes}
          </Router>
        </div>
      </Provider>
    );
  }
}

export default AppContainer;
