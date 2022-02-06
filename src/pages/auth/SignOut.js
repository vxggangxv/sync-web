import AppTemplate from 'components/base/template/AppTemplate';
import { pageUrl } from 'lib/mapper';
import storage, { deleteCookie, keys } from 'lib/storage';
import React, { useEffect } from 'react';
import { useHistory, Redirect } from 'react-router-dom';
import { AuthActions, UserActions } from 'store/actionCreators';
import { signOut } from 'store/modules/auth';

function AuthSignOut(props) {
  let history = useHistory();
  // let location = useLocation();

  useEffect(() => {
    signOut();

    // AppActions.remove_popups();
    // AppActions.remove_toasts();
    // history.push(mapper.pageUrl.auth.signIn);
  }, []);

  return <Redirect to={pageUrl.home} />;
}

export default AuthSignOut;
