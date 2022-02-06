import React, { useState, useEffect, useMemo, useRef } from 'react';
import { Grid, TextField, ButtonGroup, FormControl, MenuItem, Select } from '@material-ui/core';
import styled, { css } from 'styled-components';
import { color } from 'styles/utils';
import cx from 'classnames';
import useInput from 'lib/hooks/useInput';
import { useDidUpdateEffect } from 'lib/utils';
import MuiWrapper from 'components/common/input/MuiWrapper';
import MuiButton from 'components/common/button/MuiButton';
import T from 'components/common/text/T';
import { person_bubble_circle, partner_image_circle } from 'components/base/images';
import { StyledPlainButtonOuter } from 'components/common/styled/Button';
import CustomSpan from 'components/common/text/CustomSpan';

import { useShallowAppSelector } from 'store/hooks';
import CloseIcon from '@material-ui/icons/Close';
import Color from 'color';
import { partnerTypeList } from 'lib/mapper';
import indicationInfo from 'static/files/unit/indicationInfo.json';
import ReplyIcon from '@material-ui/icons/Reply';
import Tooltip from '@material-ui/core/Tooltip';

interface PartnerModalRequestProps {
  minorData: {
    value: string | null;
    onChange: (e: any) => void;
    setValue: (value: string) => void;
  };
  majorData: {
    value: string | null;
    onChange: (e: any) => void;
    setValue: (value: string) => void;
  };
  partnerCurrency: {
    value: string | null;
    onChange: (e: any) => void;
    setValue: (value: Date) => void;
  };
  partnerType: {
    value: string | null;
    onChange: (e: any) => void;
    setValue: (value: Date) => void;
  };

  selectedPartnerData: object | any;
  isSearchValue: {
    value: boolean | any;
    onChange: (e: any) => void;
    setValue: (value: boolean) => void;
  };

  onClickGoToBack: () => void;
  onSubmitAnswerReceivedRequest: (data: any) => void;
  onSubmitRegisterNewPartner: (data: any) => void;
}

/**
 * @param {PartnerModalRequestProps} { selectedPartner }
 * @return {*}
 */
function PartnerModalRequest({
  majorData,
  minorData,
  selectedPartnerData,
  isSearchValue,
  onClickGoToBack,
  onSubmitAnswerReceivedRequest,
  onSubmitRegisterNewPartner,
}: PartnerModalRequestProps) {
  const partnerCurrency = useInput('');
  const partnerType = useInput('');

  useEffect(() => {
    partnerType.setValue(selectedPartnerData?.partnerType || '');
  }, [selectedPartnerData]);

  const receivedRequestAnswerState = [
    { id: 1, value: 'accept' },
    { id: 2, value: 'reject' },
  ];

  const handleRegisterNewPartnerData = (data: object) => {
    const reqData = {
      ...data,
      partnerType: partnerType.value,
    };
    onSubmitRegisterNewPartner(reqData);
  };

  const handleAnswerReceivedRequest = (data: object, state: string) => {
    const reqData = {
      ...data,
      partnerType: partnerType.value,
      state: receivedRequestAnswerState.find(i => i.value === state)?.id,
    };
    onSubmitAnswerReceivedRequest(reqData);
  };

  return (
    <StyledPartnerModalRequest data-component-name="PartnerModalRequest">
      <div className="partnerModalRequest__container">
        <div className="partnerModalRequest__info_wrapper">
          <div className="partnerModalRequest__info_box">
            <div
              className={cx('partnerModalRequest__redo_button_box', {
                isSearchbar: !!isSearchValue.value ? true : false,
              })}
              onClick={onClickGoToBack}
            >
              <ReplyIcon />
            </div>
            <Grid container className="partnerModalRequest__info">
              <Grid item className="partnerModalRequest__info_image ">
                <div className="partnerModalRequest__info_image_box">
                  <img src={partner_image_circle} />
                </div>
              </Grid>
              <Grid item className="partnerModalRequest__info_content">
                {!!selectedPartnerData && (
                  <>
                    <div className="partnerModalRequest__info_row name">
                      <Tooltip
                        className="partnerModalRequest__info_tooltip"
                        title={selectedPartnerData.name}
                        placement="top"
                        // open={true}
                        disableHoverListener={false}
                        disableFocusListener={true}
                        disableTouchListener={true}
                      >
                        <span>{selectedPartnerData?.name}</span>
                      </Tooltip>
                    </div>
                    <div className="partnerModalRequest__info_row email">
                      <Tooltip
                        className="partnerModalRequest__info_tooltip"
                        title={selectedPartnerData.email}
                        placement="top"
                        // open={true}
                        disableHoverListener={false}
                        disableFocusListener={true}
                        disableTouchListener={true}
                      >
                        <span>{selectedPartnerData?.email}</span>
                      </Tooltip>
                    </div>
                    <div className="partnerModalRequest__info_row phone">
                      {selectedPartnerData?.phone}
                    </div>
                    <div className="partnerModalRequest__info_row region">
                      {selectedPartnerData?.countryName}, {selectedPartnerData?.stateName}
                    </div>
                  </>
                )}
              </Grid>
            </Grid>
          </div>
          <Grid container className="partnerModalRequest__select_box">
            <Grid item className="partnerModalRequest__select_label">
              <T>Partner Type</T>
            </Grid>
            <Grid item className="partnerModalRequest__select_item_wrapper">
              <MuiWrapper className="partnerModalRequest__select_item">
                <FormControl fullWidth variant="outlined">
                  <Select
                    MenuProps={{
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      getContentAnchorEl: null,
                    }}
                    name="unitCurrency"
                    displayEmpty
                    value={partnerType.value}
                    disabled={minorData.value === 'waiting' ? true : false}
                    onChange={partnerType.onChange}
                  >
                    <MenuItem value="" disabled>
                      Choose
                    </MenuItem>
                    {partnerTypeList?.map((item: any, index: number) => {
                      return (
                        <MenuItem value={`${item.id}`} key={index}>
                          {item.text}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </MuiWrapper>
            </Grid>
          </Grid>
        </div>
        {minorData.value === 'received' && (
          <StyledPlainButtonOuter
            className="partnerModalRequest__button_box receivedRequest"
            backgroundColor={color.navy_blue}
            left="50%"
            width={410}
            height={76}
          >
            <div className="receivedRequest__btn_box">
              <MuiButton
                config={{
                  width: '95px',
                  color: color.gray_week,
                }}
                disableElevation
                variant="contained"
                className="xl border-radius-round inset-shadow-default receivedRequest__reject_btn"
                onClick={() => {
                  handleAnswerReceivedRequest(selectedPartnerData, 'reject');
                }}
              >
                Reject
              </MuiButton>
              <MuiButton
                config={{
                  width: '295px',
                }}
                // disabled={!partnerCurrency.value || !partnerType.value}
                disabled={!partnerType.value}
                disableElevation
                variant="contained"
                className="xl border-radius-round inset-shadow-default receivedRequest__accept_btn"
                onClick={() => {
                  handleAnswerReceivedRequest(selectedPartnerData, 'accept');
                }}
              >
                <span className="btn-shadow-inset"></span>
                Accept
              </MuiButton>
            </div>
          </StyledPlainButtonOuter>
        )}
        {minorData.value === 'waiting' && (
          <StyledPlainButtonOuter
            className="partnerModalRequest__button_box requestWaiting"
            backgroundColor={color.navy_blue}
            left="50%"
            width={410}
            height={76}
          >
            <MuiButton
              type="submit"
              config={{
                width: '320px',
              }}
              disabled={true}
              disableElevation
              color="primary"
              variant="contained"
              disablebackground={color.navy_blue}
              disablefontcolor="#ffffff"
              className="xl border-radius-round partner_ok_button requestWaiting__btn"
              endIcon={
                <div
                  aria-label="cancel modal"
                  className="partner_cancel_button"
                  onClick={e => {
                    e.preventDefault();
                  }}
                >
                  <CloseIcon htmlColor="white" fontSize="inherit" />
                </div>
              }
            >
              <T>Waiting</T>
            </MuiButton>
          </StyledPlainButtonOuter>
        )}
        {minorData.value === 'new' && (
          <StyledPlainButtonOuter
            className="partnerModalRequest__button_box requestRegister"
            backgroundColor={color.navy_blue}
            left="50%"
            width={410}
            height={76}
          >
            <MuiButton
              type="submit"
              config={{
                width: '320px',
              }}
              // disabled={!partnerCurrency.value || !partnerType.value}
              disabled={!partnerType.value}
              disableElevation
              color="primary"
              variant="contained"
              disablebackground={color.navy_blue}
              disablefontcolor="#ffffff"
              className="xl border-radius-round partner_ok_button requestRegister__btn"
              endIcon={
                <div
                  aria-label="cancel modal"
                  className="partner_cancel_button"
                  onClick={e => {
                    e.preventDefault();
                  }}
                >
                  <CloseIcon htmlColor="white" fontSize="inherit" />
                </div>
              }
              onClick={() => {
                handleRegisterNewPartnerData(selectedPartnerData);
              }}
            >
              <T>OK</T>
            </MuiButton>
          </StyledPlainButtonOuter>
        )}
      </div>
    </StyledPartnerModalRequest>
  );
}

const StyledPartnerModalRequest = styled.section<{}>`
  .partnerModalRequest__container {
    height: 390px;
    width: 100%;
    margin-bottom: 30px;
    position: relative;
    background-color: #ffffff;
    .partnerModalRequest__info_wrapper {
      .partnerModalRequest__info_box {
        height: 230px;
        width: 100%;
        align-items: center;
        background-color: #eaf8fd;
        border-radius: 5px;
        margin-bottom: 20px;
        position: relative;
        .partnerModalRequest__redo_button_box {
          width: 40px;
          height: 40px;
          border: 1px solid #ffffff;
          background-color: #00a4e3;
          color: #ffffff;
          position: absolute;
          top: 50%;
          border-radius: 50%;
          align-items: center;
          justify-content: center;
          transform: translate(-50%, -50%);
          display: none;
          &.isSearchbar {
            display: flex;
          }
          &:hover {
            cursor: pointer;
          }
        }

        .partnerModalRequest__info {
          height: 100%;
          padding: 40px;
          p {
            color: #ffffff;
            &:first-child {
              margin-bottom: 28px;
            }
            &:last-child {
              margin-top: 7px;
            }
          }
          .partnerModalRequest__info_image {
            width: 60px;
            .partnerModalRequest__info_image_box {
              width: 60px;
              height: 60px;
              border-radius: 30px;
              background-color: #ffffff;
            }
          }
          .partnerModalRequest__info_content {
            width: 350px;
            padding-left: 40px;
            .partnerModalRequest__info_row {
              width: 310px;
              color: #303030;
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              .partnerModalRequest__info_tooltip {
                width: 310px;
              }
              &.name {
                margin-top: 10px;
                font-size: 19px;
                font-weight: 700;
              }
              &.email,
              &.phone,
              &.region {
                margin-top: 20px;
                font-size: 15px;
                font-weight: 400;
              }
            }
          }
        }
      }
      .partnerModalRequest__select_box {
        align-items: center;
        height: 40px;
        .partnerModalRequest__select_label {
          width: 140px;
        }
        .partnerModalRequest__select_item_wrapper {
          width: 350px;
        }
      }
    }

    .partnerModalRequest__button_box {
      .partner_ok_button {
        border: 1px solid #ffffff;
        position: relative;
        .partner_cancel_button {
          position: absolute;
          top: 50%;
          right: 10px;
          border: 1px solid #ffffff;
          border-radius: 18px;
          width: 36px;
          height: 36px;
          transform: translate(0, -50%);
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

export default React.memo(PartnerModalRequest);
