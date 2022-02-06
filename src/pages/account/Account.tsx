import React from 'react';
import AppTemplate from 'components/base/template/AppTemplate';
import AppNav from 'components/base/nav/AppNav';
import ExcuteNav from 'components/base/nav/ExcuteNav';
import { Route, Redirect, Switch } from 'react-router-dom';
import AccountContainer from 'containers/account/AccountContainer';
import { pageUrl } from 'lib/mapper';
import { useLocation } from 'react-router';

function Account() {
  const { pathname } = useLocation();

  return (
    <AppTemplate
      title={'Account'}
      leftSide={<AppNav />}
      mainStyle={{
        padding: '0 50px',
      }}
    >
      <AccountContainer />
    </AppTemplate>
  );
}

export default Account;
