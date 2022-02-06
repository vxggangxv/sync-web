import React from 'react';
import styled from 'styled-components';

interface ListBackgroundVeticalDivisionProps {
  divisionNumber?: number;
  borderWidth?: number;
  borderStyle?: string;
  borderColor?: string;
}

function ListBackgroundVeticalDivision({
  divisionNumber = 2,
  borderWidth,
  borderStyle,
  borderColor,
}: ListBackgroundVeticalDivisionProps) {
  const listBgItemWidth = 100 / divisionNumber;

  return (
    <StyledListBackgroundVeticalDivision
      data-component-name="ListBackgroundVeticalDivision"
      className="projectFileUpload__list_bg"
      borderWidth={borderWidth}
      borderStyle={borderStyle}
      borderColor={borderColor}
    >
      {Array.from({ length: divisionNumber - 1 }).map((item, idx) => (
        <div
          className="projectFileUpload__list_bg_item"
          key={idx}
          style={{
            width: `${listBgItemWidth}%`,
          }}
        ></div>
      ))}
    </StyledListBackgroundVeticalDivision>
  );
}

const StyledListBackgroundVeticalDivision = styled.div<{
  borderWidth?: number;
  borderStyle?: string;
  borderColor?: string;
}>`
  &.projectFileUpload__list_bg {
    display: flex;
    position: absolute;
    top: 0px;
    width: 100%;
    height: 100%;
    .projectFileUpload__list_bg_item {
      position: relative;
      left: ${({ borderWidth }) => (borderWidth ? `calc(${borderWidth}px / 2)` : 0)};
      height: 100%;
      border-right: 1px dashed #b5b7c1;
      border-right-width: ${({ borderWidth }) =>
        (typeof borderWidth === 'number' || !!borderWidth) && `${borderWidth}px`};
      border-style: ${({ borderStyle }) => !!borderStyle && borderStyle};
      border-color: ${({ borderColor }) => !!borderColor && borderColor};
    }
  }
`;

export default React.memo(ListBackgroundVeticalDivision);
