import AppTemplate from 'components/base/template/AppTemplate';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import queryString from 'query-string';
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { AuthActions } from 'store/actionCreators';
import { isLogInSelector } from 'store/modules/auth';

function SignIn(props) {
  const { isAuthenticated } = useShallowSelector(state => ({
    isAuthenticated: isLogInSelector(state),
  }));
  let history = useHistory();
  let { pathname, search, state } = useLocation();

  const queryParse = queryString.parse(search);
  const { from } = state || { from: { pathname } };
  // NOTE: ErrorContainer 에서 returnPath 넘겨줬을 경우, PrivateRoute에서 from을 넘겨줬을경우
  const returnPath = queryParse.returnPath || from.pathname;

  let login = () => {
    AuthActions.sign_in({ token: 'token', user: 'user' });
  };

  useDidUpdateEffect(() => {
    if (isAuthenticated) return history.replace(returnPath);
  }, [isAuthenticated]);

  return (
    <AppTemplate title={'Auth'} headerHide={true} isDefaultMainContainer={false}>
      <br />
      <br />
      <p>You must log in to view the page at {returnPath}</p>
      <br />
      <button onClick={login}>Log in</button>
      <br />
    </AppTemplate>
  );
}

export default SignIn;
