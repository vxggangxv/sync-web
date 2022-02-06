import React from 'react';
import { Switch, Route, withRouter, Redirect } from 'react-router-dom';
// import { Logout } from 'components/base/auth';
import SignIn from './SignIn';
import SignOut from './SignOut';
// import SignUp from 'pages/auth/SignUp';
// import ResetPassword from 'pages/auth/ResetPassword';
import { pageUrl } from 'lib/mapper';

function Auth() {
  return (
    <Switch>
      <Redirect exact path={`${pageUrl.auth.index}`} to={`${pageUrl.auth.signIn}`} />
      <Route path={`${pageUrl.auth.signIn}`} component={pageUrl.home} />
      <Route path={`${pageUrl.auth.signOut}`} component={SignOut} />
      {/* <Route path={`${pageUrl.auth.signUp}`} component={SignUp} />
      <Route path={`${pageUrl.auth.resetPassword}`} component={ResetPassword} />
      <Route path={`${pageUrl.auth.logout}`} component={Logout} /> */}
      <Route component={() => <Redirect to={pageUrl.error.notFound} />} />
    </Switch>
  );
}

export default Auth;
