import React from 'react';
import { _color } from 'styles/_variables';
import styled from 'styled-components';
import { CircularProgress } from '@material-ui/core';

function CircularLoading({ size = 30, color = _color.blue }) {
  return (
    <Styled.CircularLoading data-component-name="CircularLoading" color={color}>
      <CircularProgress size={size} />
    </Styled.CircularLoading>
  );
}

export default CircularLoading;

const Styled = {
  CircularLoading: styled.div`
    .MuiCircularProgress-colorPrimary {
      color: ${({ color }) => color};
    }
  `,
};
