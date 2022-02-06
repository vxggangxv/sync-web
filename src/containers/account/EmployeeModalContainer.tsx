import React, { useState, useEffect, useMemo, useRef } from 'react';
import {
  Grid,
  Checkbox,
  TextField,
  ButtonGroup,
  FormControl,
  MenuItem,
  Select,
} from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import styled from 'styled-components';
import { color } from 'styles/utils';
import cx from 'classnames';
import useInput from 'lib/hooks/useInput';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';
import { useDidUpdateEffect } from 'lib/utils';
import MuiWrapper from 'components/common/input/MuiWrapper';
import MuiButton from 'components/common/button/MuiButton';
import T from 'components/common/text/T';
import {
  employee_add,
  icon_user_circle,
  icon_trash,
  product_calendar,
  person_bubble_rectangle_on_circle,
} from 'components/base/images';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { StyledPlainButtonOuter } from 'components/common/styled/Button';
import ImgCrop from 'components/common/images/ImgCrop';
import CustomSpan from 'components/common/text/CustomSpan';
import PencilUnderlineIcon from 'components/base/icons/PencilUnderlineIcon';
import CustomText from 'components/common/text/CustomText';
import EmployeeCard from 'components/account/EmployeeCard';
import BarChart from 'components/common/chart/BarChart';
import DonutChart from 'components/common/chart/DonutChart';
import useFileInput from 'lib/hooks/useFileInput';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { useShallowAppSelector } from 'store/hooks';
import { EmployeeActions } from 'store/actionCreators';
import { setFormData, fixedNumbering } from 'lib/library';

import testAccountData from 'containers/account/testAccountData.json';
import testpartnerData from 'containers/partner/testpartnerData.json';
interface EmployeeModalProps {
  selectedEmployeeNumber: string | any;
  // page: object | any;
  // period: object | any;
  // checkedProjectProcess: object | any;
  // keyword: object | any;
}

interface EmployeeInformationFormInput {
  email: string;
  authority: number;
  name: string;
  postPosition: string;
  assignedTask: string;
  phone: string;
  phoneCode: number;
}

interface employeeItem {
  employeeNum: string;
  name: string;
  postPosition: string;
  phone: string;
}

function EmployeeModalContainer({ selectedEmployeeNumber }: EmployeeModalProps) {
  const {
    fetchEmployeeList,
    fetchEmployeeListSuccess,
    updateEmployeeSuccess,
    registerEmployeeSuccess,
    deleteEmployeeSuccess,
    user,
  } = useShallowAppSelector(state => ({
    fetchEmployeeList: state.employee.employeeList,
    fetchEmployeeListSuccess: state.employee.employeeList.success,
    registerEmployeeSuccess: state.employee.registerEmployee.success,
    updateEmployeeSuccess: state.employee.updateEmployee.success,
    deleteEmployeeSuccess: state.employee.deleteEmployee.success,
    user: state.user.user,
  }));

  const {
    control: employeeInfoControl,
    // handleSubmit: handleSubmitInformation,
    handleSubmit,
    errors: employeeInfoErros,
    setValue: setEmployeeInfo,
    watch: employeeInfoWatch,
    unregister,
    register,
    getValues: getEmployeeInfo,
    reset,
    formState: { isValid, errors, isDirty, isValidating, touched },
    clearErrors,
  } = useForm<EmployeeInformationFormInput>({
    mode: 'onChange',
    // mode: 'onSubmit',
    // reValidateMode: 'onChange',
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUnregister: false,
  });

  const companyName = user?.company;
  const groupCode = user?.groupCode;
  const userIdx = user?.userGroupIdx;
  // const employeeList = testAccountData.emplyoeeList.list;

  const testCountryList = testpartnerData.countryList;
  const employeeList = fetchEmployeeList.data?.list;
  const [selectedEmployeeObj, setSelectedEmployeeObj] = useState<object | any>({});

  const employeeListRef = useRef<null | any>(null);
  const selectEmployee = useInput();
  const [isModifyEmployee, setIsModifyEmployee] = useState(false);
  const [isAddEmployee, setIsAddEmployee] = useState(false);
  const [currentRegisterData, setCurrentRegisterData] = useState<object | any>(null);

  const profileFileRef = useRef<null | any>(null);
  const [profileFilePreview, setProfileFilePreview] = useState<object | any>(null);
  const profileFile = useFileInput({
    file: null,
    name: '',
  });

  const [isDeleteProfileImg, setIsDeleteProfileImg] = useState(false);
  const deleteProfileImg = useInput('');
  const [isChange, setIsChange] = useState(false);

  const handleClickAdd = () => {
    handleInitEmployeeInfo();
    setTimeout(() => {
      setIsAddEmployee(true);
      // setIsModifyEmployee(true);
      setProfileFilePreview(null);
      selectEmployee.onChange({ value: null });
    }, 100);
  };

  useEffect(() => {
    // employee init
    EmployeeActions.fetch_employee_list_request();
  }, []);

  useEffect(() => {
    console.log('selectedEmployeeObj ______ ', selectedEmployeeObj);
  }, [selectedEmployeeObj]);
  useEffect(() => {
    // init employee list load
    // API Block
    // EmployeeActions.fetch_employees_request({
    //   groupCode,
    //   userIdx,
    // });

    handleInitEmployeeInfo();
    // setSelectedEmployeeNum(selectedEmployee);

    // setIsModifyEmployee(true);
    setProfileFilePreview(null);
  }, []);

  useDidUpdateEffect(() => {
    if (updateEmployeeSuccess) {
      // TO DO - imagefile upload API
    }
  }, [updateEmployeeSuccess]);

  useEffect(() => {
    console.log('selectedEmployee _______ ', selectedEmployeeNumber);
    console.log('employeeList.length _______ ', employeeList.length);
    if (employeeList.length > 0 && !!selectedEmployeeNumber) {
      // 선택된 employee가 있는경우
      selectEmployee.onChange({ value: selectedEmployeeNumber });
      const findEmployee = employeeList?.find(
        (item: any) => item.employeeNum === selectedEmployeeNumber,
      );
      handleSetEmployeeInfo(findEmployee);

      setIsModifyEmployee(false);
    } else {
      setIsModifyEmployee(true);
      setIsAddEmployee(true);
    }
  }, [employeeList, selectedEmployeeNumber]);

  useDidUpdateEffect(() => {
    // employee 등록 성공 후,
    if (registerEmployeeSuccess) {
      // API Block
      EmployeeActions.fetch_employee_list_request();
      // setSelectedEmployeeNum(currentRegisterData.employeeNum);
      setIsAddEmployee(false);
    }
  }, [registerEmployeeSuccess]);

  useDidUpdateEffect(() => {
    // 직원리스트 스크롤 이동
    if (fetchEmployeeListSuccess) {
      if (!!selectEmployee.value) {
        const boxHeight = 651;
        const rowHeight = 58;
        const currentEmployeeRow = employeeListRef.current.querySelector(
          '.employeeModal__employee_row.active',
        );
        const employeeIndex: number = currentEmployeeRow?.dataset?.index;
        if (employeeIndex < 6) {
          employeeListRef.current.scrollTop = 0;
        } else {
          employeeListRef.current.scrollTop = rowHeight * (employeeIndex - 5);
        }
      }
    }
  }, [selectedEmployeeNumber, employeeListRef.current, fetchEmployeeListSuccess]);

  const handleClickEmployee = (data: object | any) => {
    if (data.employeeNum === selectEmployee.value) {
      handleInitEmployeeInfo();
      setIsAddEmployee(false);
      selectEmployee.onChange({ value: null });
      setIsModifyEmployee(true);
      console.log('선택 취소');
      setIsAddEmployee(true);
    } else {
      selectEmployee.onChange({ value: data.employeeNum });
      handleSetEmployeeInfo(data);
      setIsModifyEmployee(false);
      setIsAddEmployee(false);
      console.log('직원 선택');
    }
  };

  const handleSetEmployeeInfo = (data: object | any) => {
    setIsChange(false);
    setSelectedEmployeeObj(data);
    setProfileFilePreview(data?.profileImg);
    // deleteProfileImg.setValue(data?.profileIdx);
    reset({
      email: data?.email,

      authority: data?.authority,
      name: data?.name,

      postPosition: data?.postPosition,
      assignedTask: data?.assignedTask,
      phone: data?.phone,
    });
  };

  const handleInitEmployeeInfo = () => {
    reset({
      email: '',
      authority: 0,
      name: '',
      postPosition: '',
      assignedTask: '',
      phone: '',
    });
    profileFile.setValue({});
    deleteProfileImg.setValue('');
    setProfileFilePreview(null);
    clearErrors(['email', 'name', 'postPosition', 'assignedTask', 'phone']);
  };

  useEffect(() => {
    clearErrors(['email', 'name', 'postPosition', 'assignedTask', 'phone']);
  }, [selectEmployee.value]);

  const handleChangeProfileImage = (event: object | any) => {
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      // profileFile.setValue({ file: reader.result });
      setProfileFilePreview(reader.result);
    };
    reader.readAsDataURL(file);
    profileFile.onChange(event);
  };

  const onSubmit = (data: EmployeeInformationFormInput) => {
    // setTestSuccess(data);

    console.log('onSubmit _____ data _ ', data);
    // const submitData = {
    //   groupCode: groupCode,
    //   ...data,
    //   profileImg: profileFile,
    // };
    const submitData = {
      ...data,
      phonecode: 116,
    };
    setCurrentRegisterData(submitData);
    if (isAddEmployee) {
      console.log('add Employee ___________________ ');
      // API Block
      // EmployeeActions.register_employee_request(setFormData(submitData));
      EmployeeActions.register_employee_request(submitData);
      // setFormData
    } else {
      const submitUpdateData = {
        ...submitData,
        deleteProfileImg: isDeleteProfileImg ? deleteProfileImg.value : '',
      };
      // API Block
      // EmployeeActions.update_employee_request(setFormData(submitUpdateData));
      console.log('update employee ______ ', submitUpdateData);
    }
  };

  const onError = (error: object | any) => {
    console.log('onerror _______________ ', error);
  };
  const onCancel = (e: any) => {
    console.log('onCancel ___________________________');
    e.preventDefault();
    setIsModifyEmployee(false);
  };

  const handleDeleteEmployee = (employeeNum: string | any) => {
    console.log('handleDeleteEmployee number ___ ', employeeNum);
  };

  // if (!fetchEmployeeListSuccess) return null;
  return (
    <StyledEmployeeModal data-component-name="EmployeeModal">
      <h1 className="sr-only">{companyName}</h1>
      <Grid container className="employeeModal__container">
        <Grid item className="employeeModal__content_wrapper list">
          <div className="employeeModal__company_title">
            <CustomSpan fontSize={22} fontWeight={700} fontColor="#00A4E3">
              {companyName}
            </CustomSpan>
            <MuiButton
              className="employeeModal__employee_add "
              disableElevation
              variant="contained"
              onClick={() => {
                handleClickAdd();
                // testInitValue(null);
              }}
            >
              <img src={employee_add} />
              <T>+ Add</T>
            </MuiButton>
          </div>
          <div className="employeeModal__employee_list_wrapper">
            <div className="employeeModal__employee_list" ref={employeeListRef}>
              {employeeList?.map((item: any, index: number) => {
                // console.log("item ___ ", item)
                return (
                  <div className="employeeModal__employee_row_wrapper" key={item.employeeNum}>
                    <Grid
                      container
                      data-index={index}
                      className={cx('employeeModal__employee_row', {
                        active: !isAddEmployee
                          ? item.employeeNum === selectEmployee.value
                            ? true
                            : false
                          : false,
                      })}
                      onClick={() => handleClickEmployee(item)}
                    >
                      <Grid item className="employee_row_item">
                        {fixedNumbering(item.employeeNum, 3)}
                      </Grid>
                      <Grid item className="employee_row_item">
                        {item.name}
                      </Grid>
                      <Grid item className="employee_row_item">
                        {item.postPosition}
                      </Grid>
                      <Grid item className="employee_row_item">
                        {item.phone}
                      </Grid>
                      {!isAddEmployee && item.employeeNum === selectEmployee.value && (
                        <div className="employee_arrow_box">
                          <ChevronRightIcon style={{ fontSize: '28px' }} />
                        </div>
                      )}
                    </Grid>
                  </div>
                );
              })}
            </div>
          </div>
        </Grid>

        <form onSubmit={handleSubmit(onSubmit, onError)}>
          <Grid item className="employeeModal__content_wrapper detail">
            <div className="employeeModal__detail_box_wrapper">
              <img className="icon_employee_add" src={person_bubble_rectangle_on_circle} />
              <div
                className={cx('employeeModal__detail_box', {
                  edit: !!isModifyEmployee || !!isAddEmployee ? true : false,
                })}
              >
                <Grid container className="employeeModal__detail_row profile_image">
                  <Grid container item className="employee_detail_row_label">
                    {!!profileFilePreview ? (
                      <ImgCrop
                        width={110}
                        isCircle
                        src={profileFilePreview}
                        className="employee_profile_image radius-circle box-shadow-default"
                      />
                    ) : (
                      <div className="employee_profile_image default radius-circle box-shadow-default">
                        <img src={icon_user_circle} />
                      </div>
                    )}
                    {(!!isModifyEmployee || !!isAddEmployee) && (
                      <label htmlFor="profileImage" className="file_upload_btn cursor-pointer">
                        <PencilUnderlineIcon color="#99D6FB" />

                        <input
                          type="file"
                          accept=".gif,.png,.jpeg,.jpg"
                          id="profileImage"
                          // id="validBridgeData_5"
                          name="profileImage"
                          hidden
                          ref={profileFileRef}
                          onChange={e => {
                            handleChangeProfileImage(e);
                            setIsDeleteProfileImg(true);
                            setIsChange(true);
                            // profileFile.onChange(e);
                            // deleteProfileImg.setValue();
                          }}
                        />
                      </label>
                    )}
                  </Grid>
                  <Grid item>
                    <div className="employeeModal__company">
                      <CustomSpan fontSize={23} fontWeight={800}>
                        {companyName}
                      </CustomSpan>
                    </div>
                    <div className="employee_detail_row_content">
                      <span className="sr-only">Post position</span>
                      <Controller
                        name="postPosition"
                        defaultValue=""
                        control={employeeInfoControl}
                        rules={{ required: true }}
                        render={({ onChange, value, ref }) =>
                          !!isModifyEmployee || !!isAddEmployee ? (
                            <MuiWrapper>
                              <TextField
                                className="radius-md form__input_box"
                                variant="outlined"
                                fullWidth
                                placeholder="ex ) Head manager"
                                error={!!errors.postPosition}
                                value={value.length > 1 ? value : value.trim()}
                                onChange={e => {
                                  onChange(e);
                                  if (e.target.value !== selectedEmployeeObj.postPosition) {
                                    setIsChange(true);
                                  } else {
                                    setIsChange(false);
                                  }
                                }}
                                inputRef={ref}
                              />
                            </MuiWrapper>
                          ) : (
                            <CustomSpan fontColor={color.blue} fontSize={18}>
                              {value}
                            </CustomSpan>
                          )
                        }
                      />
                    </div>
                  </Grid>
                </Grid>
                <div className="employeeModal__detail_row_dashed"></div>
                <Grid container className="employeeModal__detail_row authority">
                  <Grid item className="employee_detail_row_label">
                    <T>Authority</T>
                  </Grid>
                  <Grid item className="employee_detail_row_content">
                    <Controller
                      name="authority"
                      defaultValue={0}
                      control={employeeInfoControl}
                      render={({ onChange, value }) =>
                        !!isModifyEmployee || !!isAddEmployee ? (
                          <ButtonGroup className="employeeModal__authority_btn_group">
                            <MuiButton
                              disableElevation
                              className={cx('employeeModal__authority_btn md border-radius-round', {
                                active: value === 0,
                              })}
                              data-type="radio"
                              onClick={(e: any) => {
                                onChange(0);
                                if (e.target.value !== selectedEmployeeObj.authority) {
                                  setIsChange(true);
                                } else {
                                  setIsChange(false);
                                }
                              }}
                            >
                              <T>Manager</T>
                            </MuiButton>
                            <MuiButton
                              disableElevation
                              className={cx('employeeModal__authority_btn md border-radius-round', {
                                active: value === 1,
                              })}
                              data-type="radio"
                              onClick={(e: any) => {
                                onChange(1);
                                if (e.target.value !== selectedEmployeeObj.authority) {
                                  setIsChange(true);
                                } else {
                                  setIsChange(false);
                                }
                              }}
                            >
                              <T>Staff</T>
                            </MuiButton>
                          </ButtonGroup>
                        ) : (
                          <span>
                            {!!getEmployeeInfo('email') && (value === 0 ? 'Manager' : 'Staff')}
                          </span>
                        )
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container className="employeeModal__detail_row sync_id">
                  <Grid item className="employee_detail_row_label">
                    <T>Sync ID</T>
                  </Grid>
                  <Grid item className="employee_detail_row_content">
                    <Controller
                      name="email"
                      defaultValue=""
                      control={employeeInfoControl}
                      rules={{ required: true }}
                      render={({ onChange, value, ref }) =>
                        !!isModifyEmployee || !!isAddEmployee ? (
                          <MuiWrapper>
                            <TextField
                              className="radius-md form__input_box"
                              variant="outlined"
                              fullWidth
                              placeholder="Fill in the information"
                              error={!!errors.email}
                              value={value.length > 1 ? value : value.trim()}
                              onChange={e => {
                                onChange(e);
                                if (e.target.value !== selectedEmployeeObj.email) {
                                  setIsChange(true);
                                } else {
                                  setIsChange(false);
                                }
                              }}
                              inputRef={ref}
                            />
                          </MuiWrapper>
                        ) : (
                          <span>{value}</span>
                        )
                      }
                    />
                  </Grid>
                </Grid>

                <Grid container className="employeeModal__detail_row name">
                  <Grid item className="employee_detail_row_label">
                    <T>Name</T>
                  </Grid>
                  <Grid item className="employee_detail_row_content">
                    <Controller
                      name="name"
                      defaultValue=""
                      control={employeeInfoControl}
                      rules={{ required: true }}
                      render={({ onChange, value, ref }) => {
                        return !!isModifyEmployee || !!isAddEmployee ? (
                          <MuiWrapper>
                            <TextField
                              className="radius-md form__input_box"
                              variant="outlined"
                              fullWidth
                              placeholder="Fill in the information"
                              error={!!errors.name}
                              value={value.length > 1 ? value : value.trim()}
                              onChange={e => {
                                onChange(e);
                                if (e.target.value !== selectedEmployeeObj.name) {
                                  setIsChange(true);
                                } else {
                                  setIsChange(false);
                                }
                              }}
                              inputRef={ref}
                            />
                          </MuiWrapper>
                        ) : (
                          <span>{value}</span>
                        );
                      }}
                    />
                  </Grid>
                </Grid>

                <Grid container className="employeeModal__detail_row task">
                  <Grid item className="employee_detail_row_label">
                    <T>Assigned task</T>
                  </Grid>
                  <Grid item className="employee_detail_row_content">
                    <Controller
                      name="assignedTask"
                      defaultValue=""
                      control={employeeInfoControl}
                      rules={{ required: true }}
                      render={({ onChange, value, ref }) =>
                        !!isModifyEmployee || !!isAddEmployee ? (
                          <MuiWrapper>
                            <TextField
                              className="radius-md form__input_box"
                              variant="outlined"
                              fullWidth
                              placeholder="ex ) Control full step"
                              error={!!errors.assignedTask}
                              value={value.length > 1 ? value : value.trim()}
                              onChange={e => {
                                onChange(e);
                                if (e.target.value !== selectedEmployeeObj.assignedTask) {
                                  setIsChange(true);
                                } else {
                                  setIsChange(false);
                                }
                              }}
                              inputRef={ref}
                            />
                          </MuiWrapper>
                        ) : (
                          <span>{value}</span>
                        )
                      }
                    />
                  </Grid>
                </Grid>
                <Grid container className="employeeModal__detail_row phone">
                  <Grid item className="employee_detail_row_label">
                    <T>Phone number</T>
                  </Grid>
                  <Grid item className="employee_detail_row_content phone">
                    <Controller
                      name="phoneCode"
                      defaultValue=""
                      control={employeeInfoControl}
                      rules={{ required: true }}
                      render={({ onChange, value, ref }) =>
                        !!isModifyEmployee || !!isAddEmployee ? (
                          <MuiWrapper className="">
                            <FormControl variant="outlined" className="phoneCode_box">
                              <Select
                                MenuProps={{
                                  anchorOrigin: {
                                    vertical: 'bottom',
                                    horizontal: 'left',
                                  },
                                  getContentAnchorEl: null,
                                }}
                                name="phoneCode"
                                displayEmpty
                                value={value}
                                renderValue={(selected: any) => {
                                  return testCountryList.find(item => item.id === selected)
                                    ?.phonecode;
                                }}
                                onChange={onChange}
                              >
                                {testCountryList?.map((item: any, index: number) => {
                                  if (!item.phonecode) return null;
                                  return (
                                    <MenuItem value={item.id} key={index}>
                                      {item.phonecode && `${item.name} | ${item.phonecode}`}
                                    </MenuItem>
                                  );
                                })}
                              </Select>
                            </FormControl>
                          </MuiWrapper>
                        ) : (
                          <CustomSpan>
                            {testCountryList.find(item => item.id === value)?.phonecode} )
                          </CustomSpan>
                        )
                      }
                    />
                    <Controller
                      name="phone"
                      defaultValue=""
                      control={employeeInfoControl}
                      rules={{ required: true }}
                      render={({ onChange, value, ref }) =>
                        !!isModifyEmployee || !!isAddEmployee ? (
                          <MuiWrapper>
                            <TextField
                              className="radius-md form__input_box"
                              variant="outlined"
                              fullWidth
                              placeholder="ex ) 010-1234-5678"
                              error={!!errors.phone}
                              value={value.length > 1 ? value : value.trim()}
                              onChange={e => {
                                onChange(e);
                                if (e.target.value !== selectedEmployeeObj.phone) {
                                  setIsChange(true);
                                } else {
                                  setIsChange(false);
                                }
                              }}
                              inputRef={ref}
                            />
                          </MuiWrapper>
                        ) : (
                          <span>{value}</span>
                        )
                      }
                    />
                  </Grid>
                </Grid>
              </div>
              {!isModifyEmployee && (
                <div
                  className="employeeModal__delete_box cursor-pointer"
                  onClick={() => handleDeleteEmployee(selectEmployee.value)}
                >
                  <img src={icon_trash} />
                  <CustomSpan
                    marginLeft={10}
                    fontColor="#B5B7C1"
                    fontSize={15}
                    fontWeight={200}
                    style={{ textDecoration: 'underline' }}
                  >
                    <T>Profile delete</T>
                  </CustomSpan>
                </div>
              )}
            </div>
            {!isAddEmployee && !!selectEmployee.value && (
              <div className="employeeModal__employee_btn_wrapper">
                <StyledPlainButtonOuter
                  backgroundColor={color.navy_blue}
                  left="50%"
                  width={370}
                  height={76}
                >
                  <MuiButton
                    type="submit"
                    config={{
                      width: '320px',
                      borderColor: 'white',
                    }}
                    // disabled={true}
                    // disabled={isModifyEmployee && !isValid && !!isChange}
                    disabled={isModifyEmployee && (!isChange || !isValid)}
                    // disabled={!isValid}
                    disableElevation
                    // color="primary"
                    // variant="contained"
                    // color="secondary"
                    variant={isModifyEmployee ? 'contained' : 'outlined'}
                    disablebackground={color.blue}
                    disablefontcolor="#ffffff"
                    className="xl border-radius-round employeeModal__employee_add_btn "
                    onClick={() => {
                      console.log('Modify!');
                      if (isModifyEmployee) {
                      } else {
                        setIsModifyEmployee(true);
                      }
                    }}
                  >
                    {isModifyEmployee ? <T>Save</T> : <T>Modify</T>}
                  </MuiButton>
                  {isModifyEmployee && (
                    <IconButton
                      aria-label="cancel modal"
                      className="employeeModal__employee_cancel_btn"
                      onClick={e => {
                        e.stopPropagation();
                        onCancel(e);
                        // if (cancelLink) history.push(cancelLink);
                      }}
                    >
                      <CloseIcon
                        htmlColor="white"
                        fontSize="inherit"
                        className="modal__close_icon"
                      />
                    </IconButton>
                  )}
                </StyledPlainButtonOuter>
              </div>
            )}

            {!!isAddEmployee && !selectEmployee.value && (
              <StyledPlainButtonOuter
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
                  // disabled={isDataValid}
                  disabled={!isValid}
                  disableElevation
                  color="primary"
                  variant="contained"
                  disablebackground={color.navy_blue}
                  disablefontcolor="#ffffff"
                  className="xl border-radius-round employeeModal__employee_add_btn "
                >
                  <T>+ Employee</T>
                </MuiButton>
              </StyledPlainButtonOuter>
            )}
          </Grid>
        </form>
      </Grid>
    </StyledEmployeeModal>
  );
}

const StyledEmployeeModal = styled.section<{}>`
  /* .modal__cancel_btn {
    position: absolute;
    top: 50%;
    right: 6px;
    transform: translateY(-50%);
    width: 40px;
    height: 40px;
    border: 1px solid white;
    border-radius: 50%;
  } */
  .employeeModal__employee_btn_wrapper {
    position: relative;

    .employeeModal__employee_cancel_btn {
      position: absolute;
      top: 50%;
      right: 18px;
      /* right: 50%; */
      border: 1px solid #ffffff;
      border-radius: 18px;
      width: 36px;
      height: 36px;
      transform: translate(0, -50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
      /* background-color: ${color.blue}; */
    }
  }
  .employeeModal__container {
    justify-content: space-between;
    /* padding-bottom: 28px; */
    .employeeModal__content_wrapper {
      height: 740px;

      &.list {
        border-radius: 15px;
        padding: 40px 30px 38px;
        width: 560px;
        background-color: #ffffff;
      }
      &.detail {
        width: 550px;
        position: relative;
      }
    }

    .employeeModal__company_title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 30px;
      .employeeModal__employee_add {
        width: 132px;
        height: 32px;
        border-radius: 15px;
        img {
          width: 34px;
          height: 26px;
          margin-right: 3px;
        }
      }
    }
    .employeeModal__employee_list_wrapper {
      width: 100%;
      height: 620px;
      background-color: #eff1f8;
      border-radius: 15px;
      padding: 5px 15px 10px;
      /* padding: 11px 15px; */
      /* padding: 0 15px 15px; */
      .employeeModal__employee_list {
        /* height: calc(620px - 22px); */
        height: calc(620px - 15px);
        padding-right: 15px;
        margin-right: -15px;
        overflow-y: overlay;
        .employeeModal__employee_row_wrapper {
          height: 55px;
          border-bottom: 1px solid #b2bedd;
          font-size: 13px;
          font-weight: 500;

          .employeeModal__employee_row {
            height: 100%;
            align-items: center;
            position: relative;
            .employee_row_item {
              &:nth-child(1) {
                width: 75px;
                padding-left: 9px;
                color: #b5b7c1;
              }
              &:nth-child(2) {
                width: 122px;
                padding-left: 5px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }
              &:nth-child(3) {
                width: 106px;
                padding-left: 5px;
                text-overflow: ellipsis;
                overflow: hidden;
                white-space: nowrap;
              }
              &:nth-child(4) {
                width: 146px;
                padding-left: 5px;
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

            &.active {
              background-color: #00a4e3;
              border-radius: 5px 29px 29px 5px;
              border-bottom: 1px solid #b2bedd;
              position: relative;

              .employee_row_item {
                color: #ffffff;
              }
              .employee_arrow_box {
                position: absolute;
                width: 30px;
                height: 30px;
                top: 50%;
                right: 14px;
                transform: translate(0, -50%);
                border: 1px solid #ffffff;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                color: #ffffff;
              }
            }
          }
        }
      }
    }

    .employeeModal__detail_box_wrapper {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      border-radius: 15px;
      padding: 110px 45px 38px;
      background-color: #ffffff;
      height: 100%;
      position: relative;
      .icon_employee_add {
        position: absolute;
        top: 0;
        right: 45px;
        transform: translate(0, -50%);
      }
      .employeeModal__detail_box {
        /* padding: 0 72px; */
        /* padding: 0 70px; */
        display: flex;
        flex-direction: column;
        flex-wrap: wrap;
        /* row-gap: 13px; */
        &.edit {
          row-gap: 20px;
          .employeeModal__detail_row_dashed {
            margin: 5px 0;
          }
          .employeeModal__company {
            margin-bottom: 15px;
          }
        }
        .employeeModal__detail_row_dashed {
          height: 1px;
          width: 100%;
          border-top: 1px dashed #b5b7c1;
          margin: 25px 0;
        }
        .employeeModal__company {
          margin-bottom: 8px;
        }
        .employeeModal__detail_row {
          justify-content: space-between;
          align-items: center;
          height: 40px;
          .employee_detail_row_label {
            width: 130px;
            font-size: 15px;
            font-weight: 400;
          }
          .employee_detail_row_content {
            width: 300px;
            height: 40px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            font-size: 15px;
            font-weight: 400px;
            &.phone {
              column-gap: 10px;
              .phoneCode_box {
                width: 100px;
              }
            }
          }
          &.profile_image {
            height: 110px;
            align-items: flex-end;
            .employee_detail_row_label {
              align-items: flex-end;
            }

            .employee_profile_image {
              box-shadow: 0px 0px 6px rgb(0 0 0 / 16%);
              width: 110px;
              height: 110px;
              border-radius: 50%;
              justify-content: flex-end;
              align-items: flex-start;
              margin: 0;
              &.default {
                img {
                  width: 100%;
                  height: 100%;
                }
              }
            }
            .employee_profile_edit {
              width: 40px;
              height: 40px;
            }
            .image_file_btn_box {
              display: flex;
              align-items: center;
            }
          }

          /* &.sync_id {
            .employee_detail_row_label {
              font-weight: 500;
            }
          }

          &.password {
            .employee_detail_row_label {
              font-weight: 500;
            }
          } */
          &.authority {
            /* .employee_detail_row_label {
              font-weight: 500;
            } */
            &.edit {
              padding: 10px 0;
            }
            .employeeModal__authority_btn_group {
              width: 300px;
              .employeeModal__authority_btn {
                height: 32px;
                width: 50%;
              }
            }
          }
          &.name {
          }
          &.employee_number {
          }
          &.position {
          }
          &.task {
          }
          &.phone {
          }
        }
      }

      .employeeModal__delete_box {
        height: 37px;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-bottom: 30px;
      }
    }
  }
`;

export default React.memo(EmployeeModalContainer);
