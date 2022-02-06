import React from 'react';
import DashboardContainer from 'containers/dashboard/DashboardContainer';
import AppTemplate from 'components/base/template/AppTemplate';
import AppNav from 'components/base/nav/AppNav';

function Dashboard() {
  return (
    <AppTemplate
      title={'Dashboard'}
      leftSide={<AppNav />}
      mainStyle={{
        padding: '0 50px',
      }}
    >
      <DashboardContainer />
    </AppTemplate>
  );
}

export default Dashboard;

/*
<DashboardTemplate
  nav={<NavContainer type="dashboard" />}
  rightSpace={<NavContainer type="executor" />}
  childrenStyleConf={{
    padding: '0',
    backgroundColor: 'transparent',
    boxShadow: 'none',
    overflow: 'unset',
  }}
>
  <DashboardContainer />
</DashboardTemplate>
*/
