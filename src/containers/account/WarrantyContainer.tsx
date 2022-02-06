import { Grid, Checkbox, TextField } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { shallowEqual, useSelector } from 'react-redux';
import React, { useState, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import cx from 'classnames';
import useInput from 'lib/hooks/useInput';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';

import MuiButton from 'components/common/button/MuiButton';
import MuiWrapper from 'components/common/input/MuiWrapper';
import T from 'components/common/text/T';
import { employee_add, icon_trash, product_calendar } from 'components/base/images';
import CustomSpan from 'components/common/text/CustomSpan';
import CustomText from 'components/common/text/CustomText';
import ProductModalContainer from 'containers/account/ProductModalContainer';
import EmployeeContainer from 'containers/account/EmployeeContainer';
import EmployeeModalContainer from 'containers/account/EmployeeModalContainer';
import UnitPriceContainer from 'containers/account/UnitPriceContainer';
import SalesPointContainer from 'containers/account/SalesPointContainer';

import UnitPriceModalContainer from 'containers/account/UnitPriceModalContainer';
import BarChart from 'components/common/chart/BarChart';
import DonutChart from 'components/common/chart/DonutChart';
import AppModal from 'components/common/modal/AppModal';
import PlainModal from 'components/common/modal/PlainModal';
import MuiPagination from 'components/common/pagination/MuiPagination';
import PencilUnderlineIcon from 'components/base/icons/PencilUnderlineIcon';
import { EmployeeActions, UnitActions, UtilActions } from 'store/actionCreators';
import IconButton from '@material-ui/core/IconButton';
import { useDidUpdateEffect } from 'lib/utils';
import { useShallowAppSelector } from 'store/hooks';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularLoading from 'components/base/loading/CircularLoading';
import testAccountData from 'containers/account/testAccountData.json';

import { addCommas } from 'lib/library';
const syncChartItems = [
  // { title: 'volume', value: 50 - 35, color: '#F4F5FA' },
  // { title: 'used', value: 35, color: '#00A4E3' },
  { value: 15, color: '#F4F5FA' },
  { value: 35, color: '#00A4E3' },
];

interface AccountInfoProps {
  // page: object | any;
  // period: object | any;
  // checkedProjectProcess: object | any;
  // keyword: object | any;
}

// interface RootState {
//   fetchEmployeeList: object;
//   account: object;
// }
interface employeeItem {
  employeeNum: number;
}

function WarrantyContainer({}: AccountInfoProps) {
  const {
    fetchIndicationFormat,
    fetchIndicationFormatSuccess,
    fetchIndicationInfo,
    fetchIndicationInfoSuccess,
    fetchEmployeeList,
    indicationFormat,
    indicationInfo,
    fetchCurrencyList,
    fetchCurrencyListSuccess,
    fetchUnitAll,
    fetchUnitAllSuccess,
    updateUnitSuccess,
    deleteUnitSuccess,
  } = useShallowAppSelector(state => ({
    fetchIndicationFormat: state.util.indicationFormat.data,
    fetchIndicationFormatSuccess: state.util.indicationFormat.success,
    fetchIndicationInfo: state.util.indicationInfo.data,
    fetchIndicationInfoSuccess: state.util.indicationInfo.success,
    fetchEmployeeList: state.employee.employeeList.data,
    indicationFormat: state.util.indicationFormat.data,
    indicationInfo: state.util.indicationInfo.data,
    fetchCurrencyList: state.util.currencyList.data,
    fetchCurrencyListSuccess: state.util.currencyList.success,
    fetchUnitAll: state.unit.unitAll.data,
    fetchUnitAllSuccess: state.unit.unitAll.success,
    updateUnitSuccess: state.unit.updateUnit.success,
    deleteUnitSuccess: state.unit.deleteUnit.success,
  }));

  // test data ------
  const syncWarrantyProduct = testAccountData.syncWarrantyProduct.syncWarrantyProduct;
  const syncWarrantyData = testAccountData?.syncWarrantyData.syncWarrantyData;
  // const employeeList = testAccountData.emplyoeeList.list10;
  // --------------------

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState('unitPrice');

  const selectedEmployeeNumber = useInput('');
  const checkUnitPrice = useCheckSetInput(new Set([]));
  const modifyUnitPriceKeyCode = useInput('');
  const selectedWarrantyProduct = useInput();
  const selectedWarrantyProductObj = useInput({});

  const selectedWarrantyData = useInput();
  const selectedWarrantyDataObj = useInput({});
  const [selectedWarrantyDataChart, setSelectedWarrantyDataChart] = useState<object[] | []>([
    { value: 100, color: '#F4F5FA' },
    { value: 0, color: '#00A4E3' },
  ]);
  const selectedWarrantyDataChartAngle = useInput(-90);
  const isWarrantyDataChartVisible = useInput(true);

  const selectedWarrantyLicense = useInput();
  const selectedWarrantyLicenseObj = useInput();
  const [selectedWarrantyLicenseChart, setSelectedWarrantyLicenseChart] = useState<object[] | []>([
    { value: 100, color: '#F4F5FA' },
    { value: 0, color: '#00A4E3' },
  ]);
  const selectedWarrantyLicenseChartAngle = useInput(-90);
  const isWarrantyLicenseChartVisible = useInput(true);

  const [totalSalesData, setTotalSalesData] = useState<object[] | []>([]);
  const [updatUnitListStack, setUpdatUnitListStack] = useState<object[]>([]);

  const testSetData = new Set([]);

  const [updateUnitListStack, setUpdateUnitListStack] = useState<object[]>([]);

  const handleChartData = (data: object | any) => {
    // console.log('handleChartData _____ ', data);
    const { productId, used, volume } = data;
    isWarrantyDataChartVisible.onChange({ value: false });

    selectedWarrantyData.onChange({ value: productId });
    selectedWarrantyDataObj.onChange({ value: data });
    const setData = [
      { value: Number(volume) - Number(used), color: '#F4F5FA' },
      { value: Number(used), color: '#00A4E3' },
    ];
    const setChartAngle = -90 - (360 * (volume - used)) / volume;

    selectedWarrantyDataChartAngle.onChange({ value: setChartAngle });
    setSelectedWarrantyDataChart(setData);
    setTimeout(() => {
      isWarrantyDataChartVisible.onChange({ value: true });
    }, 100);
  };

  const handleChartLicense = (data: object | any) => {
    // console.log('handleChartData _____ ', data);
    const { productId, used, volume } = data;
    isWarrantyLicenseChartVisible.onChange({ value: false });

    selectedWarrantyLicense.onChange({ value: productId });
    selectedWarrantyLicenseObj.onChange({ value: data });
    const setData = [
      { value: Number(volume) - Number(used), color: '#F4F5FA' },
      { value: Number(used), color: '#00A4E3' },
    ];
    const setChartAngle = -90 - (360 * (volume - used)) / volume;

    selectedWarrantyLicenseChartAngle.onChange({ value: setChartAngle });
    setSelectedWarrantyLicenseChart(setData);
    setTimeout(() => {
      isWarrantyLicenseChartVisible.onChange({ value: true });
    }, 100);
    // console.log(selectedWarrantyDataChart[0].color);
  };

  const handleCloseAccountModal = () => {
    setIsModalOpen(false);
  };

  const handleModalPopup = (type: string | any) => {
    // type :: 0 => UnitPrice , 1 => Employee, 2 => Product
    setModalType(type);
    setIsModalOpen(true);
  };

  return (
    <StyledAcctounInfo data-component-name="AcctounInfo">
      {useMemo(() => {
        return (
          <PlainModal isOpen={isModalOpen} onClose={handleCloseAccountModal} width={1280}>
            <AppModal
              title={'Product Register'}
              content={<ProductModalContainer />}
              contentCardStyle={{
                padding: '0 0 28px',
                // padding: 0,
                backgroundColor: 'transparent',
              }}
              isCloseIcon={true}
              onClick={handleCloseAccountModal}
              onCancel={handleCloseAccountModal}
              hideButton={true}
            />
          </PlainModal>
        );
      }, [isModalOpen])}

      <div className="acctounInfo__content_wrapper warranty">
        <h1 className="acctounInfo__content_title">
          <img className="acctounInfo__content_title_icon" />
          <CustomSpan fontSize={26} fontWeight={500} marginLeft={30}>
            <T>Warranty</T>
          </CustomSpan>
        </h1>

        <Grid container className="acctounInfo__content_warranty_box products">
          <Grid item className="acctounInfo__warranty_products_icon_box">
            <img className="warranty_products_icon" />
            <CustomSpan fontSize={15} fontWeight={500}>
              <T>{selectedWarrantyProductObj.value?.membership}</T>
            </CustomSpan>
          </Grid>
          <Grid item className="acctounInfo__content_warranty_table_wrapper products">
            <div className="acctounInfo__content_warranty_button_box">
              <MuiButton
                disableElevation
                className="prduct_add_button"
                variant="contained"
                onClick={() => handleModalPopup('productRegister')}
              >
                <CustomSpan fontSize={13} fontWeight={500}>
                  + <T>Product</T>
                </CustomSpan>
              </MuiButton>
            </div>
            <div className="acctounInfo__content_warranty_table products">
              <div className="acctounInfo_warranty_table_head">
                <Grid container className="acctounInfo_warranty_table_row">
                  <Grid item className="warranty_table_row_item">
                    <T>멤버십</T>
                  </Grid>
                  <Grid item className="warranty_table_row_item">
                    <T>주문번호</T>
                  </Grid>
                  <Grid item className="warranty_table_row_item">
                    <T>시리얼넘버</T>
                  </Grid>
                  <Grid item className="warranty_table_row_item">
                    <T>기간</T>
                  </Grid>
                  <Grid item className="warranty_table_row_item">
                    {' '}
                  </Grid>
                </Grid>
              </div>
              <div className="acctounInfo_warranty_table_body_wrapper">
                <div className="acctounInfo_warranty_table_body">
                  {syncWarrantyProduct?.map((item, idx) => (
                    <Grid
                      container
                      className={cx('acctounInfo_warranty_table_row', {
                        active: selectedWarrantyProduct.value === item.productId ? true : false,
                      })}
                      key={idx}
                      onClick={() => {
                        selectedWarrantyProduct.onChange({ value: item.productId });
                        selectedWarrantyProductObj.onChange({ value: item });
                      }}
                    >
                      <Grid item className="warranty_table_row_item">
                        {item.membership}
                      </Grid>
                      <Grid item className="warranty_table_row_item">
                        {item.orderNo}
                      </Grid>
                      <Grid item className="warranty_table_row_item">
                        {item.serial}
                      </Grid>
                      <Grid item className="warranty_table_row_item">
                        {item.startDate} ~ {item.endDate}
                      </Grid>
                      <Grid item className="warranty_table_row_item">
                        X
                      </Grid>
                    </Grid>
                  ))}
                </div>
              </div>
            </div>
          </Grid>
        </Grid>

        <Grid container className="acctounInfo__content_warranty_box data">
          <Grid item className="acctounInfo__content_warranty_chart_box">
            <Grid container className="acctounInfo__warranty_chart_wrapper">
              <Grid item className="acctounInfo__warranty_chart">
                <div className="acctounInfo__warranty_chart_title">
                  <CustomText fontSize={23} fontWeight={500} fontColor={color.navy_blue}>
                    <T>DATA</T>
                  </CustomText>
                </div>
                <div className="acctounInfo__warranty_chart_info">
                  <img src={product_calendar} alt="calendar" />
                  <CustomText fontSize={15} fontStyle="italic" fontColor={color.navy_blue}>
                    Expert
                  </CustomText>
                </div>
                {isWarrantyDataChartVisible.value && (
                  <DonutChart
                    data={selectedWarrantyDataChart}
                    width={120}
                    lineWidth={8}
                    rounded
                    startAngle={selectedWarrantyDataChartAngle.value}
                  >
                    <></>
                  </DonutChart>
                )}
              </Grid>
              <Grid item className="acctounInfo__chart_data">
                <Grid container className="acctounInfo__chart_data_wrapper used">
                  <Grid item>
                    <div className="acctounInfo__chart_data_dot used"></div>
                  </Grid>
                  <Grid item className="acctounInfo__chart_data_count_box">
                    <div>
                      <CustomText fontSize={12}>
                        <T>사용 용량</T>
                      </CustomText>
                    </div>
                    <div className="acctounInfo__chart_data_count">
                      - {selectedWarrantyDataObj.value?.used}
                      <CustomText fontSize={9} marginLeft={5} fontColor="#7C7C7C">
                        GB
                      </CustomText>
                    </div>
                  </Grid>
                </Grid>
                <Grid container className="acctounInfo__chart_data_wrapper">
                  <Grid item>
                    <div className="acctounInfo__chart_data_dot"></div>
                  </Grid>
                  <Grid item className="acctounInfo__chart_data_count_box">
                    <div>
                      <CustomText fontSize={12}>사용 가능용량</CustomText>
                    </div>
                    <div className="acctounInfo__chart_data_count">
                      -{' '}
                      {selectedWarrantyDataObj.value?.volume && selectedWarrantyDataObj.value?.used
                        ? selectedWarrantyDataObj.value?.volume -
                          selectedWarrantyDataObj.value?.used
                        : ''}
                      <CustomText fontSize={9} marginLeft={5} fontColor="#7C7C7C">
                        GB
                      </CustomText>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item className="acctounInfo__content_warranty_table data">
            <div className="acctounInfo_warranty_table_head">
              <Grid container className="acctounInfo_warranty_table_row">
                <Grid item className="warranty_table_row_item">
                  <T>멤버십</T>
                </Grid>
                <Grid item className="warranty_table_row_item">
                  <T>주문번호</T>
                </Grid>
                <Grid item className="warranty_table_row_item">
                  <T>용량</T>
                </Grid>
                <Grid item className="warranty_table_row_item">
                  <T>기간</T>
                </Grid>
                <Grid item className="warranty_table_row_item">
                  {' '}
                </Grid>
              </Grid>
            </div>
            <div className="acctounInfo_warranty_table_body_wrapper">
              <div className="acctounInfo_warranty_table_body">
                {syncWarrantyData?.map((item, idx) => (
                  <Grid
                    container
                    className={cx('acctounInfo_warranty_table_row', {
                      active: selectedWarrantyData.value === item.productId ? true : false,
                    })}
                    key={idx}
                    onClick={() => {
                      handleChartData(item);
                    }}
                  >
                    <Grid item className="warranty_table_row_item">
                      {item.membership}
                    </Grid>
                    <Grid item className="warranty_table_row_item">
                      {item.orderNo}
                    </Grid>
                    <Grid item className="warranty_table_row_item">
                      {item.used}GB / {item.volume}GB
                    </Grid>
                    <Grid item className="warranty_table_row_item">
                      {item.startDate} ~ {item.endDate}
                    </Grid>
                    <Grid item className="warranty_table_row_item">
                      X
                    </Grid>
                  </Grid>
                ))}
              </div>
            </div>
          </Grid>
        </Grid>

        <Grid container className="acctounInfo__content_warranty_box program">
          <Grid item className="acctounInfo__content_warranty_chart_box">
            <Grid container className="acctounInfo__warranty_chart_wrapper">
              <Grid item className="acctounInfo__warranty_chart">
                <div className="acctounInfo__warranty_chart_title">
                  <CustomText fontSize={23} fontWeight={500} fontColor={color.navy_blue}>
                    <T>Licenses</T>
                  </CustomText>
                </div>
                <div className="acctounInfo__warranty_chart_info">
                  <img src={product_calendar} alt="calendar" />
                  <CustomText fontSize={15} fontStyle="italic" fontColor={color.navy_blue}>
                    Expert
                  </CustomText>
                </div>
                {isWarrantyLicenseChartVisible.value && (
                  <DonutChart
                    data={selectedWarrantyLicenseChart}
                    width={120}
                    lineWidth={8}
                    rounded
                    startAngle={selectedWarrantyLicenseChartAngle.value}
                  >
                    <></>
                  </DonutChart>
                )}
              </Grid>
              <Grid item className="acctounInfo__chart_data">
                <Grid container className="acctounInfo__chart_data_wrapper used">
                  <Grid item>
                    <div className="acctounInfo__chart_data_dot used"></div>
                  </Grid>
                  <Grid item className="acctounInfo__chart_data_count_box">
                    <div>
                      <CustomText fontSize={12}>
                        <T>사용 용량</T>
                      </CustomText>
                    </div>
                    <div className="acctounInfo__chart_data_count">
                      - {selectedWarrantyLicenseObj.value?.used}
                      <CustomText fontSize={9} marginLeft={5} fontColor="#7C7C7C">
                        GB
                      </CustomText>
                    </div>
                  </Grid>
                </Grid>
                <Grid container className="acctounInfo__chart_data_wrapper">
                  <Grid item>
                    <div className="acctounInfo__chart_data_dot"></div>
                  </Grid>
                  <Grid item className="acctounInfo__chart_data_count_box">
                    <div>
                      <CustomText fontSize={12}>사용 가능용량</CustomText>
                    </div>
                    <div className="acctounInfo__chart_data_count">
                      -{' '}
                      {selectedWarrantyLicenseObj.value?.volume &&
                      selectedWarrantyLicenseObj.value?.used
                        ? selectedWarrantyLicenseObj.value?.volume -
                          selectedWarrantyLicenseObj.value?.used
                        : ''}
                      <CustomText fontSize={9} marginLeft={5} fontColor="#7C7C7C">
                        GB
                      </CustomText>
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
          <Grid item className="acctounInfo__content_warranty_table program">
            <div className="acctounInfo_warranty_table_head">
              <Grid container className="acctounInfo_warranty_table_row">
                <Grid item className="warranty_table_row_item">
                  <T>멤버십</T>
                </Grid>
                <Grid item className="warranty_table_row_item">
                  <T>주문번호</T>
                </Grid>
                <Grid item className="warranty_table_row_item">
                  <T>용량</T>
                </Grid>
                <Grid item className="warranty_table_row_item">
                  <T>기간</T>
                </Grid>
                <Grid item className="warranty_table_row_item">
                  {' '}
                </Grid>
              </Grid>
            </div>
            <div className="acctounInfo_warranty_table_body_wrapper">
              <div className="acctounInfo_warranty_table_body">
                {syncWarrantyData?.map((item, idx) => (
                  <Grid
                    container
                    className={cx('acctounInfo_warranty_table_row', {
                      active: selectedWarrantyLicense.value === item.productId ? true : false,
                    })}
                    key={idx}
                    onClick={() => {
                      handleChartLicense(item);
                      // selectedWarrantyLicense.onChange({ value: item.productId });
                      // selectedWarrantyLicenseObj.onChange({ value: item });
                    }}
                  >
                    <Grid item className="warranty_table_row_item">
                      {item.membership}
                    </Grid>
                    <Grid item className="warranty_table_row_item">
                      {item.orderNo}
                    </Grid>
                    <Grid item className="warranty_table_row_item">
                      {item.used}GB / {item.volume}GB
                    </Grid>
                    <Grid item className="warranty_table_row_item">
                      {item.startDate} ~ {item.endDate}
                    </Grid>
                    <Grid item className="warranty_table_row_item">
                      X
                    </Grid>
                  </Grid>
                ))}
              </div>
            </div>
          </Grid>
        </Grid>
      </div>
    </StyledAcctounInfo>
  );
}

const StyledAcctounInfo = styled.section<{}>`
  padding-bottom: 120px;
  .acctounInfo__sales_unit_wrapper {
    padding-bottom: 40px;
  }
  .acctounInfo__content_wrapper {
    flex-wrap: wrap;
    &.sales {
      width: 466px;
      margin-bottom: 20px;
    }
    &.unit {
      width: 1162px;
      margin-left: -34px;
      margin-bottom: 20px;
    }
    &.employee {
      margin-bottom: 90px;
    }
    .acctounInfo__content_title {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      .acctounInfo__content_title_icon {
        width: 60px;
        height: 60px;
      }
    }

    .acctounInfo__content_employee_list_box {
      position: relative;
      .acctounInfo__content_employee_add_box {
        position: absolute;
        top: -70px;
        right: 0;
        .acctounInfo__content_employee_add {
          width: 300px;
          height: 40px;
          border-radius: 20px;
          background-color: #00a4e3;
          box-shadow: inset 3px 3px 6px rgb(0 0 0 / 16%);
        }
      }
      .acctounInfo__content_employee_list {
        display: flex;
        flex-wrap: wrap;
        column-gap: 23px;
        row-gap: 25px;
        .acctounInfo__content_employee_add_box1 {
          border: 1px solid #33b5e4;
          border-radius: 10px;
          width: 300px;
          height: 300px;
          padding: 45px 35px 40px;
          text-align: center;
          position: relative;
          p {
            margin-top: 10px;
          }
          &:hover {
            &:after {
              position: absolute;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              content: '';
              z-index: 1;
              background-color: #00a6e2;
              opacity: 0.23;
              border-radius: 10px;
            }
          }
        }
      }
      .acctounInfo__content_employee_paging {
        width: 100%;
        margin-top: 50px;
      }
    }

    .acctounInfo__content_warranty_box {
      &.data,
      &.program {
        width: 100%;
        box-shadow: inset 0px 0px 6px rgb(0 0 0 / 16%);
        border-radius: 15px;
      }

      &.products {
        margin-bottom: 60px;
      }
      &.data {
        margin-bottom: 20px;
      }
      .acctounInfo__warranty_products_icon_box {
        width: 466px;
        padding-right: 138px;
        height: 325px;
        box-shadow: inset 3px 3px 6px rgb(0 0 0 / 16%);
        border-radius: 15px;
        background-color: #edf4fb;
        display: inline-flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        flex-wrap: wrap;
        row-gap: 11px;
        .warranty_products_icon {
          width: 186px;
          height: 186px;
        }
      }

      .acctounInfo__content_warranty_chart_box {
        width: 322px;
        height: 294px;
        margin: 15px 0;

        .acctounInfo__warranty_chart_wrapper {
          padding-top: 110px;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          column-gap: 35px;
          .acctounInfo__warranty_chart {
            position: relative;
            width: 120px;
            height: 120px;
            .acctounInfo__warranty_chart_title {
              position: absolute;
              top: -40px;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 100%;
              text-align: center;
            }
            .acctounInfo__warranty_chart_info {
              z-index: 10;
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 100%;
              height: 100%;

              display: inline-flex;
              align-items: center;
              justify-content: center;
              flex-direction: column;
              img {
                padding-bottom: 10px;
              }
            }
          }
          .acctounInfo__chart_data {
            .acctounInfo__chart_data_wrapper {
              justify-content: flex-start;
              align-items: flex-start;
              flex-wrap: wrap;
              column-gap: 6px;
              &.used {
                margin-bottom: 15px;
              }
              .acctounInfo__chart_data_dot {
                width: 8px;
                height: 8px;
                border-radius: 50%;
                background-color: #e2e4ee;
                &.used {
                  background-color: #00a4e3;
                }
              }
              .acctounInfo__chart_data_count_box {
                .acctounInfo__chart_data_count {
                  margin-top: 6px;
                  font-size: 13px;
                  display: inline-flex;
                  align-items: flex-end;
                }
              }
            }
          }
        }
      }
      .acctounInfo__content_warranty_table_wrapper {
        position: relative;
        width: calc(100% - 328px);
        height: 325px;
        margin-left: -138px;

        .acctounInfo__content_warranty_button_box {
          position: absolute;
          top: -40px;
          right: 0;
          z-index: 1;
          .prduct_add_button {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 126px;
            height: 63px;
            padding-bottom: 23px;
            border-radius: 10px;
            box-shadow: inset 3px 3px 3px rgb(0 0 0 / 16%);
          }
        }
      }
      .acctounInfo__content_warranty_table {
        padding: 15px 30px 0;
        &.products {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 10;
          width: 100%;
          height: 100%;
          border-radius: 15px;
          box-shadow: 0px 0px 6px rgb(0 0 0 / 16%);
          background-color: #ffffff;
        }
        &.data,
        &.program {
          border-left: 4px solid #edf4fb;
          width: calc(100% - 322px);
        }

        .acctounInfo_warranty_table_head {
          height: 40px;
          border-radius: 5px;
          background-color: #edf4fb;
          .acctounInfo_warranty_table_row {
            height: 40px;
            font-size: 15px;
          }
        }
        .acctounInfo_warranty_table_body_wrapper {
          height: 254px;
          overflow-y: overlay;
          padding-right: 20px;
          margin-right: -20px;
          .acctounInfo_warranty_table_body {
            .acctounInfo_warranty_table_row {
              height: 50px;
              font-size: 16px;
            }
          }
        }
        .acctounInfo_warranty_table_row {
          width: 100%;
          align-items: center;
          border-bottom: 1px solid #edf4fb;
          position: relative;
          &.active {
            font-weight: 500;
          }
          .warranty_table_row_item {
            &:nth-child(1) {
              width: 18%;
              padding-left: 30px;
            }
            &:nth-child(2) {
              width: 27%;
            }
            &:nth-child(3) {
              width: 27%;
            }
            &:nth-child(4) {
              width: 21%;
            }
            &:nth-child(5) {
              width: 7%;
              text-align: center;
            }
          }

          &:hover {
            &:after {
              position: absolute;
              width: 100%;
              height: 100%;
              top: 0;
              left: 0;
              content: '';
              z-index: 1;
              background-color: #33b5e4;
              opacity: 0.1;
            }
          }
        }
      }
    }
  }
`;

export default React.memo(WarrantyContainer);
