import React from 'react';
import AppTemplate from 'components/base/template/AppTemplate';
import AppNav from 'components/base/nav/AppNav';
import StoreContainer from 'containers/store/StoreContainer';

export default function Store() {
  return (
    <AppTemplate
      title={'Store'}
      leftSide={<AppNav />}
      mainStyle={{
        padding: '0 50px',
      }}
    >
      <StoreContainer />
    </AppTemplate>
  );
}
