import React, { Suspense, useMemo, useEffect } from 'react';
import Core from 'containers/base/Core';
import { Route, Switch, Redirect } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import GlobalAppStyle from 'styles/base';
import {
  Error,
  Home,
  Auth,
  About,
  Test,
  Jun,
  User,
  Dashboard,
  Project,
  Store,
  Account,
  Partner,
  Support,
  Invoice,
  Notifications,
} from 'pages';
// import FullScreenLoading from 'components/base/loading/FullScreenLoading';
import AppErrorBoundary from 'components/base/error/AppErrorBoundary';
import LRoute from 'components/base/route/LRoute';
import PrivateRoute from 'components/base/route/PrivateRoute';
import './App.scss';
import { pageUrl } from 'lib/mapper';
import { useContext } from 'react';
import { AppContext } from 'contexts/AppContext';

function App() {
  const { theme } = useContext(AppContext);

  return (
    <ThemeProvider theme={theme}>
      <GlobalAppStyle />
      <AppErrorBoundary>
        <Switch>
          <Redirect exact path={pageUrl.index} to={pageUrl.dashboard.index} />
          {/* <Redirect exact path={pageUrl.index} to={pageUrl.home} /> */}
          <Route path={pageUrl.home} component={Home} />
          {/* <Redirect path={pageUrl.home} to={pageUrl.dashboard.index} /> */}
          <LRoute path={pageUrl.auth.index} component={Auth} />
          <Route path="/error" component={Error} />
          <PrivateRoute path="/jun" component={Jun} />
          <PrivateRoute path="/user" component={User} />
          <PrivateRoute path={pageUrl.dashboard.index} component={Dashboard} />
          <PrivateRoute path={pageUrl.project.index} component={Project} />
          <PrivateRoute path={pageUrl.store.index} component={Store} />
          <PrivateRoute path={pageUrl.account.index} component={Account} />
          <PrivateRoute path={pageUrl.partner.index} component={Partner} />
          <PrivateRoute path={pageUrl.support.index} component={Support} />
          <PrivateRoute path={pageUrl.invoice.index} component={Invoice} />
          <PrivateRoute path={pageUrl.notifications.index} component={Notifications} />
          {/* <PrivateRoute path="/about" component={About} /> */}
          {/* <Route path="/about" component={About} /> */}
          {/* <Route path="/test" component={Test} /> */}
          <Route component={() => <Redirect to="/error/404" />} />
        </Switch>

        <Core />
      </AppErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
