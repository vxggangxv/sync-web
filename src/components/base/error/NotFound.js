import React from 'react';
import styled from 'styled-components';
import ErrorForm from './ErrorForm';

function NotFound(props) {
  console.log(props, 'not found props');
  return (
    <Stlyed.NotFound data-component-name="NotFound">
      <ErrorForm code="404" text="Not Found" infoHide={true} />
    </Stlyed.NotFound>
  );
}

const Stlyed = {
  NotFound: styled.div`
    font-size: 18px;
  `,
};

export default NotFound;
