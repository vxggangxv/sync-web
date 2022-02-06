import React from 'react';
import AboutContainer from 'containers/about/AboutContainer';
import AppTemplate from 'components/base/template/AppTemplate';

function About(props) {
  return (
    <AppTemplate title={'About'}>
      <AboutContainer />
    </AppTemplate>
  );
}

export default About;
