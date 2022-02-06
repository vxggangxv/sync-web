import React from 'react';
import UserContainer from 'containers/user/UserContainer';
import AppTemplate from 'components/base/template/AppTemplate';

function User(props) {
  return (
    <AppTemplate title={'User'}>
      <UserContainer />
    </AppTemplate>
  );
}

export default User;
