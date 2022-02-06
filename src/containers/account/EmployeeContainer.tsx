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

import EmployeeCard from 'components/account/EmployeeCard';

import EmployeeModalContainer from 'containers/account/EmployeeModalContainer';

import AppModal from 'components/common/modal/AppModal';
import PlainModal from 'components/common/modal/PlainModal';
import MuiPagination from 'components/common/pagination/MuiPagination';

import { EmployeeActions, UnitActions, UtilActions } from 'store/actionCreators';

import { useDidUpdateEffect } from 'lib/utils';
import { useShallowAppSelector } from 'store/hooks';

import useFetchLoading from 'lib/hooks/useFetchLoading';

interface EmployeeInfoProps {
  // page: object | any;
  // period: object | any;
  // checkedProjectProcess: object | any;
  // keyword: object | any;
}

interface employeeItem {
  employeeNum: number;
}

function EmployeeContainer({}: EmployeeInfoProps) {
  const { fetchEmployeeList, fetchEmployeeListSuccess } = useShallowAppSelector(state => ({
    fetchEmployeeList: state.employee.employeeList.data,
    fetchEmployeeListSuccess: state.employee.employeeList.success,
  }));

  const employeeList = fetchEmployeeList?.list;
  const employeeListPage = fetchEmployeeList?.pagingData;

  const employeePage = useInput(1);

  const [isModalOpen, setIsModalOpen] = useState(false);

  const selectedEmployeeNumber = useInput('');

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
  };

  useEffect(() => {
    // init
    console.log('Init ______ [ EmployeeContainer ]');
    EmployeeActions.fetch_employee_list_request({ page: employeePage.value });
  }, []);

  useDidUpdateEffect(() => {
    EmployeeActions.fetch_employee_list_request({ page: employeePage.value });
  }, [employeePage.value]);

  useDidUpdateEffect(() => {
    EmployeeActions.fetch_employee_list_request({ page: employeePage.value });
  }, [isModalOpen]);

  const fetchList = {
    fetchEmployeeListSuccess,
  };
  const { isFetchSuccess } = useFetchLoading(fetchList);
  // if (!isFetchSuccess) return null;

  return (
    <StyledEmployee data-component-name="Employee">
      {useMemo(() => {
        return (
          <PlainModal isOpen={isModalOpen} onClose={handleCloseModal} width={1160}>
            <AppModal
              title={'Employee'}
              content={
                <EmployeeModalContainer selectedEmployeeNumber={selectedEmployeeNumber.value} />
              }
              contentCardStyle={{
                padding: '0 0 28px',
                // padding: 0,
                backgroundColor: 'transparent',
              }}
              isCloseIcon={true}
              onClick={handleCloseModal}
              onCancel={handleCloseModal}
              hideButton={true}
            />
          </PlainModal>
        );
      }, [isModalOpen])}
      <div className="employee__container">
        <h1 className="employee__title_box ">
          <img className="employee__title_icon " />
          <CustomSpan fontSize={26} fontWeight={500} marginLeft={30}>
            <T>Employee info.</T>
          </CustomSpan>
        </h1>
        <div className="employee__content_box ">
          <div className="employee__content_button_box ">
            {employeeList?.length > 0 && (
              <MuiButton
                disableElevation
                className="employee__content_add  "
                variant="contained"
                onClick={() => {
                  handleOpenModal();
                  selectedEmployeeNumber.setValue('');
                }}
              >
                <T>+ Adding employees</T>
              </MuiButton>
            )}
          </div>
          <div className="employee__list_box ">
            {employeeList?.length > 0 ? (
              employeeList.map((item: employeeItem, idx: number) => {
                return (
                  <div
                    onClick={() => {
                      handleOpenModal();
                      selectedEmployeeNumber.setValue(item.employeeNum);
                    }}
                    key={idx}
                  >
                    <EmployeeCard item={item} />
                  </div>
                );
              })
            ) : (
              <div
                className="employee__list_empty_box "
                onClick={() => {
                  handleOpenModal();
                  selectedEmployeeNumber.setValue('');
                }}
              >
                <img src={employee_add} alt="employee_add" />
                <p>
                  <CustomSpan fontSize={16} marginRight={10} fontColor="#33B5E4">
                    +
                  </CustomSpan>
                  <CustomSpan fontSize={19} fontWeight={500} marginRight={10}>
                    <T>Adding employees</T>
                  </CustomSpan>
                </p>
              </div>
            )}
          </div>
          <div className="employee__list_paging ">
            {employeeList?.length > 0 && (
              <MuiPagination
                config={{
                  justifyContent: 'center',
                }}
                count={Math.floor(employeeListPage?.totalPage)}
                value={employeePage.value}
                onChange={(e: any, value: number) => {
                  employeePage.setValue(value);
                }}
              />
            )}
          </div>
        </div>
      </div>
    </StyledEmployee>
  );
}

const StyledEmployee = styled.section<{}>`
  .employee__container {
    flex-wrap: wrap;
    margin-bottom: 90px;

    .employee__title_box {
      margin-bottom: 20px;
      display: flex;
      align-items: center;
      .employee__title_icon {
        width: 60px;
        height: 60px;
      }
    }

    .employee__content_box {
      position: relative;
      .employee__content_button_box {
        position: absolute;
        top: -70px;
        right: 0;
        .employee__content_add {
          width: 300px;
          height: 40px;
          border-radius: 20px;
          background-color: #00a4e3;
          box-shadow: inset 3px 3px 6px rgb(0 0 0 / 16%);
        }
      }
      .employee__list_box {
        display: flex;
        flex-wrap: wrap;
        column-gap: 23px;
        row-gap: 25px;
        .employee__list_empty_box {
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
      .employee__list_paging {
        width: 100%;
        margin-top: 50px;
      }
    }
  }
`;

export default React.memo(EmployeeContainer);
