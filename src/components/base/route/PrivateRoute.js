import React, { useEffect } from 'react';
import { Route, Redirect, useLocation, useHistory } from 'react-router-dom';
import { pageUrl } from 'lib/mapper';
import { isLogInSelector } from 'store/modules/auth';
import { useShallowSelector } from 'lib/utils';
import PropTypes from 'prop-types';
import { AppActions } from 'store/actionCreators';

// 사용법: <PrivateRoute path="/project" component={Project} to="/auth/signup"/>
function PrivateRoute({ component: Component, ...rest }) {
  const { isLogIn, responseStatus } = useShallowSelector(state => ({
    isLogIn: isLogInSelector(state),
    responseStatus: state.base.responseStatus,
  }));
  // const history = useHistory();
  // isLogIn이 되고 redirect에 보내고 싶은 경로 입력, 없을 경우 signIn으로
  // 사용X, 나중에 테스트
  // const redirect = rest.redirect;
  const location = useLocation();
  // console.log(location, 'location');

  useEffect(() => {
    if (!isLogIn) {
      AppActions.show_toast({
        type: 'error',
        message: `Access resricted.`,
      });
    }
  }, [isLogIn]);

  return (
    <Route
      {...rest}
      render={props => {
        if (!isLogIn) {
          return (
            <Redirect
              to={{
                // pathname: pageUrl.auth.signIn,
                pathname: pageUrl.home,
                state: { from: location },
              }}
            />
          );
        } else {
          return <Component {...props} />;
        }
      }}
    />
  );
}

// NOTE: propTypes 는 필요시 적용
PrivateRoute.propTypes = {
  component: PropTypes.elementType,
};

export default PrivateRoute;

// } else if (redirect) {
//   return <Redirect to={redirect} />;
// } else {
