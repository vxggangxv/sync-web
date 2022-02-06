import React from 'react';
import AppTemplate from 'components/base/template/AppTemplate';
import AppNav from 'components/base/nav/AppNav';
import ExcuteNav from 'components/base/nav/ExcuteNav';
import { Route, Redirect, Switch } from 'react-router-dom';
import PartnerContainer from 'containers/partner/PartnerContainer';
import { pageUrl } from 'lib/mapper';
import { useLocation } from 'react-router';

function Partner() {
  const { pathname } = useLocation();

  return (
    <AppTemplate
      title={'Partner'}
      leftSide={<AppNav />}
      mainStyle={{
        padding: '0 50px',
      }}
    >
      <PartnerContainer />
    </AppTemplate>
  );
}

export default Partner;
