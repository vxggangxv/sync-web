import React from 'react';
import styled from 'styled-components';

const CustomText = props => {
  const {
    children,
    fontSize,
    fontColor,
    fontWeight,
    fontStyle,
    marginTop,
    marginBottom,
    marginLeft,
    marginRight,
    style,
  } = props;

  return (
    <Styled.CustomText
      fontSize={fontSize}
      fontColor={fontColor}
      fontWeight={fontWeight}
      fontStyle={fontStyle}
      marginTop={marginTop}
      marginBottom={marginBottom}
      marginLeft={marginLeft}
      marginRight={marginRight}
      style={style}
      data-component-name="CustomText"
    >
      {children}
    </Styled.CustomText>
  );
};

const Styled = {
  CustomText: styled.p`
    font-size: ${props => props.fontSize && `${props.fontSize}px`};
    color: ${props => props.fontColor && `${props.fontColor}`};
    font-weight: ${props => props.fontWeight && `${props.fontWeight}`};
    font-style: ${props => props.fontStyle && `${props.fontStyle}`};
    margin-top: ${props => props.marginTop && `${props.marginTop}px`};
    margin-bottom: ${props => props.marginBottom && `${props.marginBottom}px`};
    margin-left: ${props => props.marginLeft && `${props.marginLeft}px`};
    margin-right: ${props => props.marginRight && `${props.marginRight}px`};
  `,
};

export default React.memo(CustomText);
