import React from 'react';
import AppTemplate from 'components/base/template/AppTemplate';
import AppNav from 'components/base/nav/AppNav';
import ExcuteNav from 'components/base/nav/ExcuteNav';
import { Route, Redirect, Switch } from 'react-router-dom';
import SupportContainer from 'containers/support/SupportContainer';
import { pageUrl } from 'lib/mapper';
import { useLocation } from 'react-router';

function Support() {
  const { pathname } = useLocation();

  return (
    <AppTemplate
      title={'Support'}
      leftSide={<AppNav />}
      mainStyle={{
        padding: '0 50px',
      }}
    >
      <SupportContainer />
    </AppTemplate>
  );
}

export default Support;
