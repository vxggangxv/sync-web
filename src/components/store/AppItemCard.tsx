import { Grid, TextField } from '@material-ui/core';
import MuiWrapper from 'components/common/input/MuiWrapper';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import cx from 'classnames';
import MuiButton from 'components/common/button/MuiButton';
import SaveAltIcon from '@material-ui/icons/SaveAlt';
import { useHistory } from 'react-router-dom';
import T from 'components/common/text/T';
import CustomSpan from 'components/common/text/CustomSpan';

interface AppItemProps {
  product: object | any;
  appItemInfo: object | any;
  // page: object | any;
  // period: object | any;
  // checkedProjectProcess: object | any;
  // keyword: object | any;
}

function AppItemCard({ appItemInfo, product }: AppItemProps) {
  const [stepFilterOpen, setStepFilterOpen] = useState(false);
  const history = useHistory();
  // const [date, setDate] = useState(null);

  useEffect(() => {
    console.log('product ____ ', product);
    console.log('appInfo ____ ', appItemInfo);
  }, [product, appItemInfo]);

  return (
    <StyledAppItemCard
      data-component-name="AppItemCard"
      baseColor={appItemInfo?.color}
      buttonColor={appItemInfo?.buttonColor}
    >
      <div className="appItemCard__card_wrapper">
        <div className="appItemCard__card_title_container">
          <img className="appItemCard__card_title" src={appItemInfo?.titleImg} />
          <p className="appItemCard__card_subTitle">
            {!!product?.productName && `:${' '}${product?.productName}`}
          </p>
        </div>
        <div className="appItemCard__card_content_container">
          <div className="appItemCard__card_icon_box">
            <div className="appItemCard__card_icon">
              <div
                className={cx('appItemCard__card_install_state', {
                  installed: !product?.isInstalled,
                })}
              ></div>

              <img src={appItemInfo?.icon} />
            </div>
          </div>
          <div className="appItemCard__card_detail_box">
            <div className="appItemCard__card_detail_top">
              <div className="appItemCard__card_detail_text">{appItemInfo?.detail}</div>
            </div>
            <div className="appItemCard__card_detail_bottom">
              <div className="appItemCard__card_viewMore">
                <T>{'View More >'}</T>
              </div>
              {/* <div
                className={cx('appItemCard__card_install_button', {
                  installed: !!product.isInstalled,
                })}
              >
                <span>
                  <T>Install</T>
                </span>
              </div> */}
              <MuiButton
                disableElevation
                disabled={!!product?.isInstalled}
                className={cx('appItemCard__card_install_button', {
                  installed: !!product?.isInstalled,
                })}
                variant="outlined"
                color="primary"
                // onClick={onRead}
              >
                <SaveAltIcon
                  className={cx('appItemCard__card_install_icon', {
                    installed: !!product?.isInstalled,
                  })}
                />
                <span>
                  <T>Install</T>
                </span>
              </MuiButton>
            </div>
          </div>
        </div>
      </div>
    </StyledAppItemCard>
  );
}

const StyledAppItemCard = styled.div<{ baseColor: string; buttonColor: string }>`
  position: relative;
  width: 360px;
  height: 300px;
  border-radius: 5px 5px 15px 15px;
  background-color: ${({ baseColor }) => baseColor};
  overflow: hidden;

  .appItemCard__card_wrapper {
    position: absolute;
    left: 0;
    bottom: 0;
    width: 360px;
    height: 295px;
    background-color: #00155e;
    padding: 35px 30px 20px;
    .appItemCard__card_title_container {
      .appItemCard__card_title {
        margin-bottom: 8px;
      }
      .appItemCard__card_subTitle {
        height: 16px;
        line-height: 16px;
        color: ${({ baseColor }) => baseColor};
        font-size: 12px;
        font-weight: 400;
        margin-bottom: 30px;
      }
    }

    .appItemCard__card_content_container {
      display: flex;
      justify-content: space-between;
      .appItemCard__card_icon_box {
        display: flex;
        align-items: flex-start;
        justify-content: flex-start;
        .appItemCard__card_icon {
          width: 90px;
          height: 90px;
          border-radius: 45px;
          background-color: #ffffff;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          .appItemCard__card_install_state {
            position: absolute;
            top: 0;
            right: 0;
            width: 24px;
            height: 24px;
            border-radius: 14px;
            border: 2px solid #ffffff;
            background-color: #a6a8b1;

            &.installed {
              background-color: ${({ baseColor }) => baseColor};
            }
          }
        }
      }
      .appItemCard__card_detail_box {
        width: 170px;
        height: 160px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        .appItemCard__card_detail_top {
          .appItemCard__card_detail_text {
            font-size: 13px;
            font-weight: 400px;
            color: #ffffff;
            width: 170px;
          }
        }
        .appItemCard__card_detail_bottom {
          .appItemCard__card_viewMore {
            // 추후 visible
            visibility: hidden;
            width: 170px;
            margin-bottom: 30px;
            font-size: 13px;
            font-style: italic;
            color: #b5b7c1;
            text-decoration: underline;
            text-align: right;
            font-weight: 200;
            &:hover {
              cursor: pointer;
            }
          }
          .appItemCard__card_install_button {
            width: 170px;
            height: 32px;
            color: ${({ buttonColor }) => buttonColor};
            border: 1px solid ${({ buttonColor }) => buttonColor};
            /* border-radius: 5px; */
            /* display: flex; */
            /* justify-content: center; */
            /* align-items: center; */
            font-size: 13px;
            font-weight: 500;
            .appItemCard__card_install_icon {
              width: 20px;
              height: 20px;
              margin-right: 5px;
              &.installed {
                display: none;
              }
            }
            /* span {
              margin-left: 5px;
            } */
            &.installed {
              border: 1px solid #b5b7c1;
              color: #b5b7c1;
              font-style: italic;
            }
            /* &:hover {
              cursor: pointer;
            } */
          }
        }
      }
    }
  }
`;

export default React.memo(AppItemCard);
