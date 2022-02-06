import React from 'react';
import { useShallowSelector } from 'lib/utils';

function UserContainer(props) {
  const { user } = useShallowSelector(state => ({
    user: state.user.user,
  }));

  console.log(user);

  return <div>UserContainer</div>;
}

export default UserContainer;
