import React, { Component } from 'react';
import App from 'components/App';
import { BrowserRouter as Router } from 'react-router-dom';
import { Provider } from 'react-redux';
import store from 'store';
// import store, { persistor } from 'store';
// import { PersistGate } from 'redux-persist/integration/react';
// import { hot } from 'react-hot-loader/root';
import 'lang/i18n';
import { ENV_MODE_PROD } from 'lib/setting';
import { AppProvider } from 'contexts/AppContext';

if (ENV_MODE_PROD) console.log = () => {};

function Root() {
  return (
    <Router basename="/">
      <Provider store={store}>
        <AppProvider>
          <App />
        </AppProvider>
      </Provider>
    </Router>
  );
}

// export default hot(Root);
export default Root;

/* <PersistGate loading={null} persistor={persistor}> */
/* </PersistGate> */

/* <Router
  basename="/"
  getUserConfirmation={(message, callback) => {
    // this is the default behavior
    const allowTransition = window.confirm(message);
    callback(allowTransition);
  }}
></Router> */
// <Prompt when={isFormIncomplete} message="Are you sure you want to leave?" />
