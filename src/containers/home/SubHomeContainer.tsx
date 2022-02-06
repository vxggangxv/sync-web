import React from 'react';
import styled from 'styled-components';

export default function SubHomeContainer() {
  return <SubHome />;
}

interface SubHomeProps {}

const SubHome = () => {
  return <StyledSubHome data-component-name="SubHome"></StyledSubHome>;
};

const StyledSubHome = styled.div``;
