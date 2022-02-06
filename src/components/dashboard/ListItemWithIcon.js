import { icon_user_circle } from 'components/base/images';
import CustomSpan from 'components/common/text/CustomSpan';
import React from 'react';
import styled from 'styled-components';

// iconComponent 전달 시 Fragment 사용 금지(기본값 Fragment), typescript효환용
const ListItemWithIcon = ({
  className = '',
  iconSrc = '',
  iconComponent = <></>,
  iconWidth = 50,
  iconMarginRight = 17,
  hasFirstMarginTop = false,
  firstMarginTop = 0, // hasFirstMarginTop true 일 경우, 적용 값, 기본값으로 marginTop을 적용
  marginTop = 30,
  title = '',
  type = '',
  typeColor = ' ',
  date = '',
  column = 1,
  itemPaddingLeft = 0,
}) => {
  // let {
  //   iconSrc = icon_user_circle,
  //   iconComponent,
  //   iconWidth = 50,
  //   iconMarginRight = 17,
  //   hasFirstMarginTop,
  //   firstMarginTop,
  //   marginTop = 30,
  //   title = '',
  //   type = '',
  //   date = null,
  // } = props;

  return (
    <Styled.ListItemWithIcon
      data-component-name="ListItemWithIcon"
      hasFirstMarginTop={hasFirstMarginTop}
      firstMarginTop={firstMarginTop || marginTop}
      marginTop={marginTop}
      iconWidth={iconWidth}
      iconMarginRight={iconMarginRight}
      className={className}
      column={column}
      itemPaddingLeft={itemPaddingLeft}
    >
      <div className="listItemWithIcon__icon_box">
        {(iconComponent.type !== (<></>).type && iconComponent) || (
          <img src={iconSrc || icon_user_circle} alt="avatar" />
        )}
      </div>
      <div className="listItemWithIcon__info_box">
        <div className="listItemWithIcon__info_title">{title}</div>
        <div className="listItemWithIcon__info_name">
          <CustomSpan fontColor={typeColor}>{type}</CustomSpan>{' '}
          {!!date && (
            <>
              <CustomSpan marginLeft={3} marginRight={3}>
                l
              </CustomSpan>{' '}
              {date}
            </>
          )}
        </div>
      </div>
    </Styled.ListItemWithIcon>
  );
};

export default React.memo(ListItemWithIcon);

const Styled = {
  ListItemWithIcon: styled.div`
    display: flex;
    align-items: center;
    position: relative;
    width: ${({ column }) => 100 / column}%;
    padding-left: ${({ itemPaddingLeft }) => itemPaddingLeft && itemPaddingLeft}px;

    &:nth-child(${({ column }) => column}) ~ * {
      margin-top: ${({ marginTop }) => marginTop}px;
    }
    &:first-child,
    &:first-child ~ &:nth-child(2) {
      margin-top: ${({ hasFirstMarginTop, firstMarginTop }) =>
        hasFirstMarginTop ? firstMarginTop : 0}px;
    }

    .listItemWithIcon__icon_box {
      position: relative;
      margin-right: ${({ iconMarginRight }) => iconMarginRight}px;
      img {
        position: relative;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        border: 1px solid #e7e7e7;
      }
    }
    .listItemWithIcon__info_box {
      width: ${({ iconWidth, iconMarginRight }) =>
        `calc(100% - ${iconWidth}px - ${iconMarginRight}px - 5px)`};
      .listItemWithIcon__info_title,
      .listItemWithIcon__info_name {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
      }
      .listItemWithIcon__info_title {
      }
      .listItemWithIcon__info_name {
        margin-top: 10px;
        font-size: 14px;
        color: #858997;
      }
    }
  `,
};
