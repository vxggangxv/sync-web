import { Grid, Checkbox, TextField } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { shallowEqual, useSelector } from 'react-redux';
import React, { useState, useEffect, useMemo, useCallback } from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import cx from 'classnames';
import useInput from 'lib/hooks/useInput';
import MuiButton from 'components/common/button/MuiButton';
import T from 'components/common/text/T';
import { icon_trash } from 'components/base/images';
import CustomSpan from 'components/common/text/CustomSpan';
import UnitPriceModalContainer from 'containers/account/UnitPriceModalContainer';
import AppModal from 'components/common/modal/AppModal';
import PlainModal from 'components/common/modal/PlainModal';
import PencilUnderlineIcon from 'components/base/icons/PencilUnderlineIcon';
import { EmployeeActions, UnitActions, UtilActions } from 'store/actionCreators';
import IconButton from '@material-ui/core/IconButton';
import { useDidUpdateEffect } from 'lib/utils';
import { useShallowAppSelector } from 'store/hooks';

import { addCommas } from 'lib/library';

interface UnitPirceInfoProps {
  // page: object | any;
  // period: object | any;
  // checkedProjectProcess: object | any;
  // keyword: object | any;
}

function UnitPriceContainer({}: UnitPirceInfoProps) {
  const {
    fetchIndicationFormat,
    fetchIndicationInfo,
    fetchCurrencyList,
    fetchUnitAll,
    deleteUnitSuccess,
  } = useShallowAppSelector(state => ({
    fetchIndicationFormat: state.util.indicationFormat.data,
    fetchIndicationInfo: state.util.indicationInfo.data,
    fetchCurrencyList: state.util.currencyList.data,
    fetchUnitAll: state.unit.unitAll.data,
    deleteUnitSuccess: state.unit.deleteUnit.success,
  }));

  const indications = fetchIndicationFormat?.indicationFormat.indication;
  const indicationInfos = fetchIndicationInfo?.indicationInfo;
  const indicationImplants = indicationInfos?.implantList;
  const indicationMeterials = indicationInfos?.materialList;
  const indicationGroups = indicationInfos?.groupList;
  const indicationParts = indicationInfos?.partList;
  const indicationToothShades = indicationInfos?.toothShadeList;

  const unitPriceList = fetchUnitAll?.list;

  const currencyList = fetchCurrencyList?.currencyList;

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalClose, setIsModalClose] = useState(false);

  const modifyUnitPriceKeyCode = useInput('');
  const isModalModify = useInput(false);

  const handleDeleteUnitPrice = (unitId: string) => {
    // console.log('handleDeleteUnitPrice ______ unitId [_ ', unitId);
    const submitData = {
      unitList: [unitId],
    };
    UnitActions.delete_unit_request(submitData);
  };

  const handleCheckCloseModal = () => {
    console.log('handleCheckCloseModal ____________________ ', isModalModify.value);
    if (!isModalModify.value) {
      handleCloseModal();
    } else {
      setIsModalClose(true);
      setIsModalOpen(true);
    }
  };

  const handleCloseModal = () => {
    console.log('handleCloseModal ____________________ ', isModalModify.value);
    setIsModalOpen(false);
    setIsModalClose(false);
    isModalModify.setValue(false);
    UnitActions.fetch_unit_all_request({ page: 1 });
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setIsModalClose(false);
  };

  useEffect(() => {
    console.log('Init ______ [ UnitPriceContainer ]');
    // init
    UtilActions.fetch_currency_list_request();
    UtilActions.fetch_teeth_indication_format_request();
    UtilActions.fetch_teeth_indication_info_request();
    UnitActions.fetch_unit_all_request({ page: 1 });
  }, []);

  useDidUpdateEffect(() => {
    if (deleteUnitSuccess) {
      UnitActions.fetch_unit_all_request({ page: 1 });
    }
  }, [deleteUnitSuccess]);

  return (
    <StyledUnitPrice data-component-name="UnitPrice">
      {useMemo(() => {
        return (
          <PlainModal
            isOpen={isModalOpen}
            // onClose={handleCloseModal}
            onClose={handleCheckCloseModal}
            width={1160}
          >
            <AppModal
              title={'Unit Price'}
              content={
                <UnitPriceModalContainer
                  modifyUnitPriceKeyCode={modifyUnitPriceKeyCode.value}
                  partnershipIdx=""
                  isModalModify={isModalModify}
                  isModalClose={isModalClose}
                  onCloseModal={handleCloseModal}
                  // onCloseModal={handleCheckCloseModal}
                />
              }
              contentCardStyle={{
                padding: '0 0 28px',
                // padding: 0,
                backgroundColor: 'transparent',
              }}
              isCloseIcon={true}
              // onClick={handleCloseModal}
              // onCancel={handleCloseModal}
              onClick={handleCheckCloseModal}
              onCancel={handleCheckCloseModal}
              hideButton={true}
            />
          </PlainModal>
        );
      }, [isModalOpen, isModalClose, isModalModify.value])}
      <div className="unitPrice__container">
        <h1 className="unitPrice__title_box">
          <img className="unitPrice__title_icon" />
          <CustomSpan fontSize={26} fontWeight={500} marginLeft={30}>
            <T>Unit Price</T>
          </CustomSpan>
        </h1>
        <div className="unitPrice__content_box">
          <div className="unitPrice__content_button_box">
            <MuiButton
              disableElevation
              className="unit_cost_button"
              variant="contained"
              onClick={() => {
                handleOpenModal();
                modifyUnitPriceKeyCode.onChange({ value: '' });
              }}
            >
              <CustomSpan fontSize={13} fontWeight={800}>
                <T>+ Cost</T>
              </CustomSpan>
            </MuiButton>
          </div>
          <div className="unitPrice__list_table_box ">
            <div className="unitPrice__list_table ">
              <div className="unitPrice__list_table_header">
                <Grid container className="unitPrice__list_table_row">
                  <Grid item className="unit_table_row_item">
                    <T>No.</T>
                  </Grid>

                  <Grid item className="unit_table_row_item">
                    <T>Meterial configuration</T>
                  </Grid>
                  <Grid item className="unit_table_row_item">
                    <T>Meterials</T>
                  </Grid>
                  <Grid item className="unit_table_row_item">
                    <T>Option</T>
                  </Grid>
                  <Grid item className="unit_table_row_item">
                    <T>Unit Price</T>
                  </Grid>
                  <Grid item className="unit_table_row_item">
                    {' '}
                  </Grid>
                  <Grid item className="unit_table_row_item">
                    {' '}
                  </Grid>
                </Grid>
              </div>
              <div className="unitPrice__list_table_body">
                {unitPriceList?.map((item: any, index: number) => {
                  const part = indicationParts?.find(
                    (i: any) => i.idx === Number(item.unitKey.split('-')[1]),
                  ).name;
                  const meterial = indicationMeterials?.find(
                    (i: any) => i.idx === Number(item.unitKey.split('-')[2]),
                  ).name;
                  const implant = indicationImplants?.find(
                    (i: any) => i.idx === Number(item.unitKey.split('-')[3]),
                  ).type;
                  const feature = currencyList?.find((i: any) => i.code === item.currency).feature;

                  return (
                    <Grid container className="unitPrice__list_table_row " key={index}>
                      <Grid item className="unit_table_row_item">
                        {index + 1}
                      </Grid>
                      <Grid item className="unit_table_row_item">
                        {part}
                      </Grid>
                      <Grid item className="unit_table_row_item">
                        {meterial}
                      </Grid>
                      <Grid item className="unit_table_row_item">
                        <CustomSpan fontColor="#b5b7c1">{implant}</CustomSpan>
                      </Grid>
                      <Grid item className="unit_table_row_item">
                        {feature} {addCommas(item.price)}
                      </Grid>
                      <Grid item className="unit_table_row_item">
                        <IconButton
                          aria-label="cancel modal"
                          className="employeeModal__employee_cancel_btn"
                          onClick={e => {
                            handleOpenModal();
                            modifyUnitPriceKeyCode.setValue(item.unitKey);
                          }}
                        >
                          <PencilUnderlineIcon color="#99D6FB" />
                        </IconButton>
                      </Grid>
                      <Grid item className="unit_table_row_item">
                        <IconButton
                          aria-label="delete unit"
                          className="delete_unit_icon"
                          onClick={() => {
                            handleDeleteUnitPrice(item._id);
                          }}
                        >
                          <img src={icon_trash} />
                        </IconButton>
                      </Grid>
                    </Grid>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </StyledUnitPrice>
  );
}

const StyledUnitPrice = styled.section<{}>`
  .unitPrice__container {
    .unitPrice__title_box {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      .unitPrice__title_icon {
        width: 60px;
        height: 60px;
      }
    }

    .unitPrice__content_box {
      position: relative;
      height: 448px;

      .unitPrice__content_button_box {
        position: absolute;
        top: -40px;
        right: 0;
        z-index: 1;

        .unit_cost_button {
          width: 126px;
          height: 63px;
          padding-bottom: 23px;
          border-radius: 10px;
          z-index: 1;
          box-shadow: inset 3px 3px 3px rgb(0 0 0 / 16%);
        }
      }

      .unitPrice__list_table_box {
        position: relative;
        z-index: 10;
        width: 100%;
        height: 448px;
        background-color: #ffffff;
        border-radius: 15px;
        box-shadow: 0px 0px 6px rgb(0 0 0 / 16%);
        padding: 13px 25px 0;
        .unitPrice__list_table {
          height: 100%;
          .unitPrice__list_table_header {
            width: 100%;
            height: 40px;
            border-radius: 5px;
            background-color: #edf4fb;
            .unitPrice__list_table_row {
              height: 40px;
            }
          }
          .unitPrice__list_table_body {
            margin-right: -25px;
            overflow-y: overlay;
            font-size: 16px;
            height: 385px;
            position: relative;

            .unitPrice__list_table_row {
              height: 61px;
              border-bottom: 1px solid #edf4fb;
            }
          }
          .unitPrice__list_table_row {
            width: 100%;
            align-items: center;
            .unit_table_row_item {
              font-size: 15px;
              font-weight: 400;
              &:nth-child(1) {
                width: 80px;
                font-weight: 200;
                color: #b5b7c1;
                text-align: center;
              }
              &:nth-child(2) {
                width: 250px;
                font-size: 16px;
              }
              &:nth-child(3) {
                width: 250px;
                font-size: 16px;
              }
              &:nth-child(4) {
                width: 250px;
              }
              &:nth-child(5) {
                width: 160px;
                padding-right: 30px;
                text-align: right;
              }
              &:nth-child(6) {
                width: 60px;
                text-align: center;
              }
              &:nth-child(7) {
                width: 60px;
                text-align: center;
              }
            }
          }

          .delete_unit_icon {
            img {
              width: 15px;
              height: 17px;
            }
          }
        }
      }
    }
  }
`;

export default React.memo(UnitPriceContainer);
