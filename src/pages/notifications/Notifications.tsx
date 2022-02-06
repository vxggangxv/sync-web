import React from 'react';
import NotificationsContainer from 'containers/notifications/NotificationsContainer';
import AppTemplate from 'components/base/template/AppTemplate';
import AppNav from 'components/base/nav/AppNav';

function Notifications() {
  return (
    <AppTemplate
      title={'Notifications'}
      leftSide={<AppNav />}
      mainStyle={{
        padding: '0 50px',
      }}
    >
      <NotificationsContainer />
    </AppTemplate>
  );
}

export default Notifications;
