import React from 'react';
import styled from 'styled-components';
import CircularLoading from 'components/base/loading/CircularLoading';
import PropTypes from 'prop-types';

FullScreenLoading.propTypes = {
  visible: PropTypes.bool,
  size: PropTypes.number,
};

function FullScreenLoading({ visible, size, type }) {
  if (visible === false) return null;
  return (
    <Styled.FullScreenLoading data-component-name="FullScreenLoading">
      <CircularLoading size={size} />
    </Styled.FullScreenLoading>
  );
}

const Styled = {
  FullScreenLoading: styled.div`
    z-index: 100;
    background: transparent;
    position: fixed;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
};

export default FullScreenLoading;
