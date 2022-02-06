import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Grid, TextField } from '@material-ui/core';
import styled, { css } from 'styled-components';
import { color } from 'styles/utils';
import cx from 'classnames';
import useInput from 'lib/hooks/useInput';
import { useDidUpdateEffect } from 'lib/utils';

import MuiWrapper from 'components/common/input/MuiWrapper';
import MuiButton from 'components/common/button/MuiButton';
import T from 'components/common/text/T';
import { icon_request_post_white, note_pencil } from 'components/base/images';
import { StyledPlainButtonOuter } from 'components/common/styled/Button';
import CustomSpan from 'components/common/text/CustomSpan';

import Color from 'color';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';

import InfiniteScroll from 'react-infinite-scroll-component';
import CircularLoading from 'components/base/loading/CircularLoading';

interface PartnerModalSearchProps {
  selectedPartnerGroupIdx?: {
    value: string | null;
    onChange: (e: any) => void;
    setValue: (value: string) => void;
  };
  // 삭제 예정
  // receivedRequest: {
  //   value: object | any;
  //   onChange: (e: any) => void;
  //   setValue: (value: object) => void;
  // };
  minorCategory: {
    value: string | null;
    onChange: (e: any) => void;
    setValue: (value: string) => void;
  };
  majorCategory: {
    value: string | null;
    onChange: (e: any) => void;
    setValue: (value: string) => void;
  };

  isSearchValue: {
    value: boolean | any;
    onChange: (e: any) => void;
    setValue: (value: boolean) => void;
  };

  partnerShipState: object | any;
  partnerSearchList?: object | any;

  onClickRegisterPartner: () => void;
  onSelectPartnerSearchList: (selected: any) => void;
}

/**
 *
 *
 * @param {PartnerModalSearchProps} { selectedPartner }
 * @return {*}
 */
function PartnerModalSearch({
  // receivedRequest,
  partnerSearchList,
  majorCategory,
  minorCategory,
  isSearchValue,
  partnerShipState,
  onClickRegisterPartner,
  onSelectPartnerSearchList,
}: PartnerModalSearchProps) {
  return (
    <StyledPartnerModalSearch data-component-name="PartnerModalSearch">
      <div className="partnerModalSearch__container">
        {useMemo(
          () => (
            <>
              {minorCategory.value === 'default' && (
                <Grid container className="partnerModalSearch__register_menual_wrapper default">
                  <Grid item className="partnerModalSearch__register_menual_icon">
                    <img src={note_pencil} />
                  </Grid>
                  <Grid item className="partnerModalSearch__register_menual_box">
                    <CustomSpan fontSize={11} fontWeight={500}>
                      <T>B. If there is no Sync ID</T>
                    </CustomSpan>
                    <MuiWrapper className="partnerModalSearch__register_menual_btn_wrapper">
                      <MuiButton
                        disableElevation
                        className="partnerModalSearch__register_menual_btn"
                        variant="contained"
                        color="secondary"
                        onClick={() => {
                          onClickRegisterPartner();
                        }}
                      >
                        <img src={icon_request_post_white} alt="icon request post" />
                        <CustomSpan
                          fontSize={16}
                          fontWeight={700}
                          marginLeft={17}
                          fontColor="#ffffff"
                        >
                          <T>+ Enter Partner Info</T>
                        </CustomSpan>
                      </MuiButton>
                    </MuiWrapper>
                  </Grid>
                </Grid>
              )}
              {minorCategory.value === 'exist' && (
                <div className="partnerModalSearch__searched_exist_wrapper partnerExist">
                  {partnerSearchList?.map((item: any, index: number) => (
                    <div className="partnerExist__list_row_box" key={index}>
                      <Grid
                        container
                        className="partnerExist__list_row"
                        onClick={() => {
                          // handleSelectPartnerSearchList(item);
                          onSelectPartnerSearchList(item);
                        }}
                      >
                        <Grid item className="partnerExist__list_name">
                          <p>{item.name}</p>
                          <p>{item.email}</p>
                        </Grid>
                        <Grid item className="partnerExist__list_status_box">
                          <div className="partnerExist__list_status_arrow">
                            <ChevronRightIcon style={{ fontSize: '28px' }} />
                          </div>
                          <div className="partnerExist__list_status">
                            {!!partnerShipState?.find((i: any) => i.state === item.state)?.icon && (
                              <img
                                src={
                                  partnerShipState?.find((i: any) => i.state === item.state)?.icon
                                }
                              />
                            )}
                            <span
                              className={cx(
                                `partnerExist__partner_status ${
                                  partnerShipState?.find((i: any) => i.state === item.state)?.text
                                }`,
                              )}
                            >
                              {partnerShipState.find((i: any) => i.state === item.state)?.value}
                            </span>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  ))}
                </div>
              )}
              {minorCategory.value === 'empty' && (
                <div className="partnerModalSearch__searched_empty_wrapper partnerEmpty">
                  <div className="partnerEmpty__wrapper">
                    <div className="partnerEmpty__box"></div>
                    <p className="partnerEmpty__text">
                      <T>
                        {
                          'There is no information that you are looking for. \nDo you want to enter partner information manually?'
                        }
                      </T>
                    </p>
                  </div>
                  <StyledPlainButtonOuter
                    className="partnerEmpty__register_menual_btn_wrapper"
                    backgroundColor={color.navy_blue}
                    left="50%"
                    width={370}
                    height={76}
                  >
                    <MuiButton
                      type="submit"
                      config={{
                        width: '320px',
                      }}
                      disableElevation
                      color="primary"
                      variant="contained"
                      disablebackground={color.navy_blue}
                      disablefontcolor="#ffffff"
                      className="xl border-radius-round partnerEmpty__register_menual_btn"
                      onClick={() => {
                        onClickRegisterPartner();
                      }}
                    >
                      <T>+ Enter Partner Info</T>
                    </MuiButton>
                  </StyledPlainButtonOuter>
                </div>
              )}
            </>
          ),
          [minorCategory.value, partnerSearchList],
        )}
      </div>
    </StyledPartnerModalSearch>
  );
}

const StyledPartnerModalSearch = styled.section<{}>`
  .partnerModalSearch__container {
    .partnerModalSearch__register_menual_wrapper {
      height: 420px;
      /* padding-top: 30px; */
      justify-content: space-between;
      align-items: flex-start;
      .partnerModalSearch__register_menual_icon {
        img {
          width: 80px;
          height: 80px;
        }
        margin-right: 20px;
      }
      .partnerModalSearch__register_menual_box {
        width: calc(100% - 100px);
        column-gap: 15px;
        display: flex;
        flex-direction: column;
        row-gap: 15px;
        .partnerModalSearch__register_menual_btn_wrapper {
          .partnerModalSearch__register_menual_btn {
            width: 100%;
          }
        }
      }
    }
    .partnerModalSearch__searched_exist_wrapper {
      height: 420px;
      /* padding-top: 30px; */
      overflow-y: overlay;
      padding-right: 20px;
      margin-right: -20px;
      .partnerExist__list_row_box {
        height: 70px;
        border-bottom: 1px solid #eff1f8;
        display: flex;
        align-items: center;
        .partnerExist__list_row {
          align-items: center;
          justify-content: space-between;
          padding-left: 30px;
          height: 70px;

          .partnerExist__list_name {
            width: 350px;
            p {
              &:nth-child(1) {
                font-size: 14px;
                margin-bottom: 8px;
                font-weight: 500;
              }
              &:nth-child(2) {
                font-size: 12px;
              }
            }
          }
          .partnerExist__list_status_box {
            .partnerExist__list_status_arrow {
              display: none;
            }
            .partnerExist__list_status {
              display: flex;
              align-items: center;
            }
          }

          &:hover {
            cursor: pointer;
            background-color: #00a4e3;
            border-radius: 5px 35px 35px 5px;

            .partnerExist__list_name {
              p {
                color: #ffffff;
              }
            }

            .partnerExist__list_status_box {
              .partnerExist__list_status_arrow {
                width: 30px;
                height: 30px;
                color: #ffffff;
                border: 1px solid #ffffff;
                border-radius: 50%;
                margin-right: 17px;
                display: block;
              }
              .partnerExist__list_status {
                display: none;
              }
            }
            &:after {
            }
          }
        }
      }
    }
    .partnerModalSearch__searched_empty_wrapper {
      /* margin-bottom: 30px; */
      /* height: 390px; */
      /* height: 420px; */
      height: 390px;
      position: relative;
      margin-bottom: 30px;
      .partnerEmpty__wrapper {
        /* height: 390px; */
        display: flex;
        /* margin-bottom: 30px; */
        /* justify-content: center; */
        align-items: center;
        flex-direction: column;
        /* padding-top: 30px; */
        .partnerEmpty__box {
          width: 250px;
          height: 250px;
          background-color: #fafafd;
          border-radius: 10px;
        }
      }
      .partnerEmpty__text {
        text-align: center;
        color: #b5b7c1;
        padding-top: 20px;
        font-size: 14px;

        /* width: 296px; */
        white-space: nowrap;
        text-overflow: ellipsis;
        line-height: 22px;
      }
    }

    .partnerEmpty__register_menual_btn_wrapper {
      .partnerEmpty__register_menual_btn {
        border: 1px solid #ffffff;
        position: relative;
        .partner_cancel_button {
          position: absolute;
          /* top: 50%; */
          bottom: 0;
          right: 10px;
          border: 1px solid #ffffff;
          border-radius: 18px;
          width: 36px;
          height: 36px;
          /* transform: translate(0, -50%); */
          transform: translate(-50%, -50%);
          display: inline-flex;
          align-items: center;
          justify-content: center;
        }
      }

      .receivedRequest__btn_box {
        position: relative;
        display: flex;
        .receivedRequest__reject_btn {
          position: relative;
          z-index: 2;
        }
        .receivedRequest__accept_btn {
          margin-left: -10px;
          background: rgb(0, 166, 226);
          background: linear-gradient(90deg, rgba(0, 166, 226, 1) 0%, rgba(8, 123, 238, 1) 100%);
          border: none;
          border-top-left-radius: 0;
          border-bottom-left-radius: 0;
          overflow: hidden;
          &:hover {
            background: ${`linear-gradient(
            90deg,
            ${Color('rgba(0, 166, 226, 1)').darken(0.12)} 0%,
            ${Color('rgba(8, 123, 238, 1)').darken(0.12)} 100%
          )`};
          }
          .btn-shadow-inset {
            position: absolute;
            top: -5px;
            left: -46px;
            width: 66px;
            height: 66px;
            border-radius: 33px;
            background-color: ${color.navy_blue};
            box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.16);
          }
        }
      }
    }
  }
`;

export default React.memo(PartnerModalSearch);
