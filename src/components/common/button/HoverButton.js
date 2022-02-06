import React from 'react';
import styled from 'styled-components';
import Color from 'color';
import { color } from 'styles/utils';
import { ButtonBase } from '@material-ui/core';

// interface HoverButtonProps {
//   children: Reqct.ReactNode
//   className: string;
//   color: string;
// }
/**
 * Useage
 * 
  <HoverButton
    className=""
    variant="outlined"
    primaryColor={active && color.blue : ''} // activeColor, borderColor의 inActive 컬러가 기본값일 경우 하나로, 기본값이 아닐경우 분리해서 사용, primary 사용시 outlined, contained 함꼐 사용
    // activeColor={active ? color.blue : 'white'}
    // borderColor={active ? color.blue : '#b5b7c1'}
    width={width}
    marginRight={marginRight}
    onClick={onClick}
  >Button</HoverButton>
 */

const HoverButton = props => {
  let {
    children = null,
    className = '',
    variant = 'default', // outlined, contained
    primaryColor = '',
    bgColor = '',
    activeColor = '', // background color when hover
    borderColor = '',
    fontColor = '',
    onClick = () => {},
  } = props;

  // 색상이 공통일 경우 primaryColor prop 하나로 설정
  bgColor = bgColor || primaryColor;
  activeColor = activeColor || primaryColor || 'white';
  borderColor = borderColor || primaryColor;

  // activeColor 설정이 없을 경우 하얀색 배경의 active로 간주
  if (variant === 'outlined') {
    if (['white', '#fff', '#ffffff'].includes(activeColor)) {
      activeColor = Color('black').alpha(0.02);
    } else {
      activeColor = Color(activeColor).alpha(0.04);
    }

    borderColor = borderColor ? borderColor : '#b5b7c1';
    fontColor = fontColor || borderColor;
  } else if (variant === 'contained') {
    activeColor = Color(activeColor).darken(0.12);
    fontColor = fontColor || 'white';
  }

  return (
    // <ButtonBase>
    <Styled.HoverButton
      data-component-name="HoverButton"
      {...props}
      variant={variant}
      bgColor={bgColor}
      activeColor={activeColor}
      borderColor={borderColor}
      fontColor={fontColor}
    >
      {children}
    </Styled.HoverButton>
    // </ButtonBase>
  );
};

export default React.memo(HoverButton);

const Styled = {
  HoverButton: styled.div`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    position: relative;
    /* padding: 0;
    border: none;
    background: none;
    font: inherit;
    color: inherit; */
    cursor: pointer;
    background-color: ${({ variant, bgColor }) =>
      variant === 'outlined' ? 'transparent' : bgColor};
    border: 1px solid transparent;
    border-color: ${({ variant, borderColor }) =>
      variant !== 'default' ? borderColor : 'transparent'};
    color: ${({ fontColor }) => (fontColor ? fontColor : color.black_font)};
    /* transition: background-color 0.15s, border 0.15s; */
    &:hover {
      background-color: ${({ variant, activeColor }) =>
        variant === 'default' ? 'rgba(0, 0, 0, 0.04)' : activeColor};
    }
  `,
};
