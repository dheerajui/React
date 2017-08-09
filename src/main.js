/* eslint-disable global-require, import/no-dynamic-require */
import React from 'react';
import ReactDOM from 'react-dom';
import { addLocaleData } from 'react-intl';
import { getValue } from './services/object';
import createStore from './store/createStore';
import AppContainer from './containers/AppContainer';
import updateMessages, { fetchingTranslations } from './store/intl';
import { fetchOmnitureProps } from './metrics/AnalyticsService';
import config from './services/intlConfig';
import 'babel-polyfill'; // eslint-disable-line import/first, Must be loaded after React and ReactDOM for use with IE

require('es6-promise').polyfill();

// ========================================================
// Initial state construction
// ========================================================
// Get the locale information from initial state, and update it as necessary
const windowState = getValue('___INITIAL_STATE__', window, {});
const language = getValue('page.locale.languageCode', windowState, 'en');
const countryCode = getValue('page.locale.countryCode', windowState, 'US');
const mappedLanguage = config.unsupportedLocales[`${language}-${countryCode}`];
const languageToLoad = mappedLanguage || language;
const initialState = Object.assign({}, windowState,
  {
    intl: Object.assign({}, windowState.intl, { locale: `${languageToLoad}-${countryCode}` })
  }
);

// ========================================================
// Store Instantiation
// ========================================================
const store = createStore(initialState);

const locale = getValue('intl.locale', initialState, 'en-US');
const backendLocale = `${language}_${countryCode}`;

// request translations
const deviceWidth = window.innerWidth;

// Split localization data into its own package, with individual files for each language. Load locale data and then
// make API call for translations
store.dispatch(fetchingTranslations(true));
import(/* webpackChunkName: "i18n/[request]" */ `react-intl/locale-data/${languageToLoad}`)
  .then(localeData => {
    addLocaleData([...localeData]);
    store.dispatch(updateMessages({
      serviceEndpoint: config.intl.endpoint,
      pageName: getValue('page.name', initialState),
      locale,
      backendLocale,
      deviceType: deviceWidth <= 735 ? 'mobile' : 'desktop'
    }));
  })
  .catch(() => {
    console.error('Unable to load language data. Defaulting to English.');
    store.dispatch(updateMessages({
      serviceEndpoint: config.intl.endpoint,
      pageName: getValue('page.name', initialState),
      locale: 'en', // Default locale to 'en' if the locale data loading failed
      backendLocale,
      deviceType: deviceWidth <= 735 ? 'mobile' : 'desktop'
    }));
  });
// Load omniture properties
fetchOmnitureProps(backendLocale);

// ========================================================
// Render Setup
// ========================================================
const MOUNT_NODE = document.getElementById('root');

const renderApp = () => {
  const routes = require('./routes/index').default(store);

  ReactDOM.render(
    <AppContainer routes={routes} store={store} />,
    MOUNT_NODE
  );
};

const render = () => {
  if (__DEV__) {
    if (module.hot) {
      const renderError = error => {
        const RedBox = require('redbox-react').default;

        ReactDOM.render(<RedBox error={error} />, MOUNT_NODE);
      };

      // Wrap render in try/catch
      try {
        renderApp();
      } catch (error) {
        renderError(error);
      }
    }
  } else {
    renderApp();
  }
};

// ========================================================
// Developer Tools Setup
// ========================================================
// This code is excluded from production bundle
if (__DEV__) {
  if (module.hot) {
    // Setup hot module replacement
    module.hot.accept('./routes/index', () =>
      setImmediate(() => {
        ReactDOM.unmountComponentAtNode(MOUNT_NODE);
        render();
      })
    );
  }
}

/*eslint-disable*/
if (!__PROD__) {
  const originalConsoleError = console.error;
  if (console.error === originalConsoleError) {
    console.error = (...args) => {
      if (args[0].indexOf('[React Intl] Missing message:') === 0) {
        return;
      }
      originalConsoleError.call(console, ...args);
    }
  }
}
/*eslint-enable*/
// ========================================================
// Go!
// ========================================================
// But first make sure that we polyfill Intl if needed
if (!global.Intl) {
  require.ensure([
    'intl'
  ], require => {
    require('intl');
    render();
  }, 'intl-polyfill');
} else {
  render();
}
