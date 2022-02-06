import styled, { css } from 'styled-components';

// styledComponent
export const StyledInShadowButtonOuter = styled.div<{
  position?: string;
  disabledTransform?: boolean;
  width: number;
  height: number;
  padding?: number;
  left?: number | string;
  right?: number | string;
  marginLeft?: number | string;
  marginRight?: number | string;
  marginTop?: number | string;
  backgroundColor?: string;
}>`
  position: ${({ position }) => position || 'absolute'};
  bottom: 0;
  left: ${({ left }) => (left && typeof left === 'string' ? left : left && left + 'px')};
  right: ${({ right }) => (right && typeof right === 'string' ? right : right && right + 'px')};
  transform: ${({ disabledTransform }) => (disabledTransform ? '' : 'translateY(50%)')};
  margin: 0 auto;
  margin-left: ${({ marginLeft }) =>
    marginLeft && typeof marginLeft === 'string' ? marginLeft : marginLeft && marginLeft + 'px'};
  margin-right: ${({ marginRight }) =>
    marginRight && typeof marginRight === 'string'
      ? marginRight
      : marginRight && marginRight + 'px'};
  margin-top: ${({ marginTop }) =>
    marginTop && typeof marginTop === 'string' ? marginTop : marginTop && marginTop + 'px'};
  width: ${({ width }) => (width && typeof width === 'string' ? width : width && width + 'px')};
  padding: ${({ padding }) => (padding ? padding : 10)}px;
  &:before {
    content: '';
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    width: 98.5%;
    height: ${({ height }) => height / 2}px;
    background-color: red;
    transform: translate(-50%, 0px);
    background-color: ${({ backgroundColor }) => (backgroundColor ? backgroundColor : 'white')};
  }
  &:after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: ${({ height }) => height}px;
    border-top-left-radius: ${({ height }) => height / 2}px;
    border-top-right-radius: ${({ height }) => height / 2}px;
    box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.16);
    clip: ${({ width, height }) => `rect(0px, ${width}px, ${height / 2 + 6}px, 0px)`};
    background-color: ${({ backgroundColor }) => (backgroundColor ? backgroundColor : 'white')};
  }
  .button {
    z-index: 1;
  }
`;

export const StyledPlainButtonOuter = styled.div<{
  width?: number;
  height: number;
  padding?: number;
  left?: number | string;
  right?: number | string;
  backgroundColor?: string;
}>`
  position: absolute;
  bottom: 0;
  left: ${({ left }) => (left && typeof left === 'string' ? left : left && left + 'px')};
  right: ${({ right }) => (right && typeof right === 'string' ? right : right && right + 'px')};
  background-color: ${({ backgroundColor }) => (backgroundColor ? backgroundColor : 'transparent')};
  /* transform: translateY(50%); */
  transform: translate(-50%, 50%);
  padding: ${({ padding }) => (padding ? padding : 10)}px;
  border-top-left-radius: ${({ height }) => height / 2}px;
  border-top-right-radius: ${({ height }) => height / 2}px;
  .button {
    z-index: 1;
  }
`;

export const StyledNoneShadowButtonOuter = styled.div<{
  width: number;
  height: number;
  padding?: number;
  left?: number | string;
  right?: number | string;
  backgroundColor?: string;
}>`
  position: absolute;
  bottom: 0;
  left: ${({ left }) => (left && typeof left === 'string' ? left : left && left + 'px')};
  right: ${({ right }) => (right && typeof right === 'string' ? right : right && right + 'px')};
  /* transform: translateY(50%); */
  transform: translate(-50%, 50%);
  padding: ${({ padding }) => (padding ? padding : 10)}px;
  &:before {
    content: '';
    display: block;
    position: absolute;
    top: 50%;
    left: 50%;
    /* width: 98.5%; */
    width: 100%;
    height: ${({ height }) => height / 2}px;
    background-color: red;
    transform: translate(-50%, 0px);
    background-color: ${({ backgroundColor }) => (backgroundColor ? backgroundColor : 'white')};
  }
  &:after {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: ${({ height, padding }) => (padding ? height + padding * 2 : height + 20)}px;
    border-top-left-radius: ${({ height, padding }) =>
      (padding ? height + padding * 2 : height + 20) / 2}px;
    border-top-right-radius: ${({ height, padding }) =>
      (padding ? height + padding * 2 : height + 20) / 2}px;
    border-top: 1px solid #e7e8f2;
    border-left: 1px solid #e7e8f2;
    border-right: 1px solid #e7e8f2;
    /* box-shadow: inset 0 0 1px rgba(0, 0, 0, 1); */
    clip: ${({ width, height }) => `rect(0px, ${width}px, ${height / 2 + 10}px, 0px)`};
    background-color: ${({ backgroundColor }) => (backgroundColor ? backgroundColor : 'white')};
  }
  .button {
    z-index: 1;
  }
`;
