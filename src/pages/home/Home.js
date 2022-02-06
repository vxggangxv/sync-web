import React from 'react';
import MainHomeContainer from 'containers/home/MainHomeContainer';
import AppTemplate from 'components/base/template/AppTemplate';

function Home(props) {
  return (
    <AppTemplate title={'Home'}>
      <MainHomeContainer />
    </AppTemplate>
  );
}

export default Home;
