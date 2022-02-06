import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Grid, TextField, ButtonGroup, FormControl, MenuItem, Select } from '@material-ui/core';
import { useForm, Controller } from 'react-hook-form';
import styled from 'styled-components';
import { color } from 'styles/utils';
import cx from 'classnames';
import useInput from 'lib/hooks/useInput';
import { useDidUpdateEffect } from 'lib/utils';
import MuiWrapper from 'components/common/input/MuiWrapper';
import MuiButton from 'components/common/button/MuiButton';
import T from 'components/common/text/T';
import {
  icon_user_circle,
  icon_trash,
  note_pencil_in_circle,
  find_magnifier_circle,
} from 'components/base/images';
import PencilUnderlineIcon from 'components/base/icons/PencilUnderlineIcon';

import { StyledPlainButtonOuter } from 'components/common/styled/Button';
import ImgCrop from 'components/common/images/ImgCrop';
import CustomSpan from 'components/common/text/CustomSpan';
import IconButton from '@material-ui/core/IconButton';
import useFileInput from 'lib/hooks/useFileInput';
import Color from 'color';
import { getStringByte } from 'lib/library';

//test json
import indicationInfo from 'static/files/unit/indicationInfo.json';
import testpartnerData from 'containers/partner/testpartnerData.json';

interface PartnerModalInputProps {
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

  currencyList?: any | null;
  countryList?: any | null;
  regionList?: any | null;
  partnerDataList?: object | any;
  accountTypeList: object | any;
  onSubmitPartnerData: (data: PartnerInformationFormInput) => void;
  onDeletePartner: () => void;
}

interface PartnerInformationFormInput {
  nickName: string;
  type: number;
  phone: string;
  phoneCode: number;
  email: string;
  fax: string;
  tel: string;
  address: string;
  currency: string;
  country: number;
  region: number;
}

/**
 * @param {PartnerModalInputProps} { selectedPartner }
 * @return {*}
 */
function PartnerModalInput({
  majorData,
  minorData,
  partnerDataList,
  accountTypeList,
  currencyList,
  countryList,
  regionList,
  onSubmitPartnerData,
  onDeletePartner,
}: PartnerModalInputProps) {
  const {
    control: partnerInfoControl,
    handleSubmit: handleSubmitInformation,
    // handleSubmit,
    errors: partnerInfoErros,
    setValue: setPartnerInfo,
    watch: partnerInfoWatch,
    getValues: getPartnerInfo,
    reset,
    formState: { isValid, errors },
    clearErrors,
  } = useForm<PartnerInformationFormInput>({
    mode: 'onChange',
    // mode: 'onSubmit',
    criteriaMode: 'firstError',
    shouldFocusError: true,
    shouldUnregister: false,
  });

  const {
    userGroupIdx,
    nickName,
    type,
    phone,
    phoneCode,
    email,
    fax,
    tel,
    address,
    profileFile,
    currency,
    accountType,
    counrty,
    region,
  } = partnerDataList;

  const isModify = useInput(false);

  const [isMenualUser, setIsMenualUser] = useState(false);
  const profileFileRef = useRef<null | any>(null);
  const [profileFilePreview, setProfileFilePreview] = useState<object | any>(null);
  const [isDeleteProfileImg, setIsDeleteProfileImg] = useState(false);
  const deleteProfileImg = useInput('');

  useEffect(() => {
    // accountType 판별
    if (!!accountType.value) {
      setIsMenualUser(
        accountTypeList.find((i: any) => i.id === accountType.value)?.type === 'manual',
      );
    } else {
      //accountType.value가 없는 경우, new로 간주
      setIsMenualUser(true);
    }
  }, [accountType.value]);

  useEffect(() => {
    if (minorData.value === 'new') {
      isModify.setValue(true);
    }
    if (minorData.value === 'detail') {
      isModify.setValue(false);
    }
  }, [minorData.value]);

  useEffect(() => {
    reset({
      nickName: nickName.value,
      type: type.value,
      phone: phone.value,
      phoneCode: phoneCode.value,
      email: email.value,
      fax: fax.value,
      tel: tel.value,
      address: address.value,
      country: counrty.value,
      currency: currency.value,
      region: region.value,
    });

    deleteProfileImg.setValue('');
    setProfileFilePreview(null);
    clearErrors([
      'nickName',
      'type',
      'phone',
      'phoneCode',
      'email',
      'fax',
      'tel',
      'address',
      'country',
      'currency',
      'region',
    ]);
  }, [
    nickName.value,
    type.value,
    phone.value,
    phoneCode.value,
    email.value,
    fax.value,
    tel.value,
    address.value,
    counrty.value,
    currency.value,
    region.value,
  ]);

  const handleChangeProfileImage = (event: any) => {
    let reader = new FileReader();
    let file = event.target.files[0];
    reader.onloadend = () => {
      // profileFile.setValue({ file: reader.result });
      setProfileFilePreview(reader.result);
    };
    reader.readAsDataURL(file);
    profileFile?.onChange(event);
  };

  const onError = () => {};

  const handleDeleteProfileImage = () => {
    setIsDeleteProfileImg(true);
    setProfileFilePreview(null);
    profileFileRef.current.value = null;
  };

  const checkKeyDown = (e: any) => {
    if (e.code === 'Enter') e.preventDefault();
  };

  return (
    <StyledPartnerModalInput data-component-name="PartnerModalInput">
      <div className="partnerModalInput__container">
        <div className="partnerModalInput__wrapper">
          <form
            onSubmit={handleSubmitInformation(onSubmitPartnerData, onError)}
            onKeyDown={e => checkKeyDown(e)}
          >
            <Grid container className="partnerModalInput__form_container">
              <Grid
                container
                item
                xs={12}
                className={cx('partnerModalInput__form_wrapper top', {
                  modify: !!isModify.value,
                })}
              >
                <Grid
                  item
                  className={cx('partnerModalInput__form_box profileImg', {
                    modify: !!isModify.value,
                  })}
                >
                  <label
                    htmlFor="partnerImage"
                    className={cx('profileImg__box', {
                      cursorPointer: minorData.value !== 'detail' && !!isMenualUser ? true : false,
                    })}
                  >
                    {!!profileFilePreview ? (
                      <ImgCrop width={80} isCircle src={profileFilePreview} className="" />
                    ) : (
                      <img src={icon_user_circle} />
                    )}
                    {minorData.value !== 'detail' && !!isMenualUser && (
                      <>
                        <div className="partner_profile_image_edit_background">
                          <input
                            type="file"
                            accept=".gif,.png,.jpeg,.jpg"
                            id="partnerImage"
                            name="partnerImage"
                            hidden
                            ref={profileFileRef}
                            onChange={e => {
                              handleChangeProfileImage(e);
                              setIsDeleteProfileImg(true);
                            }}
                          />
                        </div>

                        <span className="partner_profile_image_edit_text">Upload</span>
                      </>
                    )}
                  </label>
                  {minorData.value !== 'detail' && !!isMenualUser && (
                    <IconButton
                      aria-label="delete_image"
                      className="partner_profile_image_delete"
                      onClick={handleDeleteProfileImage}
                    >
                      <img src={icon_trash} />
                    </IconButton>
                  )}
                </Grid>
                <Grid container item className="partnerModalInput__form_box nickName">
                  <Grid item className="partner_info_row_enterType">
                    <CustomSpan fontSize={13} fontWeight={400} fontColor="#00A4E3">
                      {!!isMenualUser ? <T>Personal</T> : <T>Sync</T>}
                    </CustomSpan>
                  </Grid>
                  <Grid item className="partner_info_row_nick">
                    <Controller
                      name="nickName"
                      defaultValue=""
                      control={partnerInfoControl}
                      rules={{ required: true }}
                      render={({ onChange, value, ref }) =>
                        minorData.value !== 'detail' && !!isMenualUser ? (
                          <MuiWrapper>
                            <TextField
                              className="radius-md form__input_box"
                              variant="outlined"
                              fullWidth
                              placeholder="Fill in the information"
                              error={!!errors.email}
                              value={value}
                              onChange={onChange}
                              inputRef={ref}
                            />
                          </MuiWrapper>
                        ) : (
                          <CustomSpan fontSize={23} fontWeight={800} fontColor="#303030">
                            {value}
                          </CustomSpan>
                        )
                      }
                    />
                  </Grid>
                </Grid>
              </Grid>
              <Grid container item xs={12} className="partnerModalInput__form_wrapper ">
                <Grid
                  container
                  item
                  className={cx('partnerModalInput__form_box left', {
                    modify: !!isModify.value,
                  })}
                >
                  <Grid item className="partner_info_row partnerType">
                    <div
                      className={cx('partner_info_row_label', {
                        modify: !!isModify.value,
                      })}
                    >
                      <T>Partner Type</T>
                    </div>
                    <div className="partner_info_row_content">
                      <Controller
                        name="type"
                        defaultValue={0}
                        control={partnerInfoControl}
                        rules={{ required: true }}
                        render={({ onChange, value }) =>
                          minorData.value !== 'detail' ? (
                            <ButtonGroup className="partnerType_btn_group">
                              <MuiButton
                                disableElevation
                                className={cx('partnerType_btn md border-radius-round', {
                                  active: value === 0,
                                })}
                                data-type="radio"
                                onClick={() => onChange(0)}
                              >
                                <T>Clinic</T>
                              </MuiButton>
                              <MuiButton
                                disableElevation
                                className={cx('partnerType_btn md border-radius-round', {
                                  active: value === 1,
                                })}
                                data-type="radio"
                                onClick={() => onChange(1)}
                              >
                                <T>Laboratory</T>
                              </MuiButton>
                            </ButtonGroup>
                          ) : (
                            <CustomSpan>
                              {value === 0 && 'Clinic'}
                              {value === 1 && 'Laboratory'}
                            </CustomSpan>
                          )
                        }
                      />
                    </div>
                  </Grid>
                  <Grid item className="partner_info_row email">
                    <div
                      className={cx('partner_info_row_label', {
                        modify: !!isModify.value,
                      })}
                    >
                      {!!isMenualUser ? <T>E-mail</T> : <T>Sync ID</T>}
                      {/* <T>Sync ID / E-mail</T> */}
                    </div>
                    <div className="partner_info_row_content">
                      <Controller
                        name="email"
                        defaultValue=""
                        control={partnerInfoControl}
                        rules={{ required: false }}
                        render={({ onChange, value, ref }) =>
                          minorData.value !== 'detail' && !!isMenualUser ? (
                            <MuiWrapper>
                              <TextField
                                className="radius-md form__input_box"
                                variant="outlined"
                                fullWidth
                                placeholder="ex) dof@doflab.com"
                                error={!!errors.email}
                                value={value}
                                onChange={onChange}
                                inputRef={ref}
                              />
                            </MuiWrapper>
                          ) : (
                            <CustomSpan>{value}</CustomSpan>
                          )
                        }
                      />
                    </div>
                  </Grid>

                  <Grid item className="partner_info_row mobile">
                    <div
                      className={cx('partner_info_row_label', {
                        modify: !!isModify.value,
                      })}
                    >
                      <T>Mobile</T>
                    </div>
                    <div className="partner_info_row_content phone">
                      <Controller
                        name="phoneCode"
                        defaultValue=""
                        control={partnerInfoControl}
                        rules={{ required: false }}
                        render={({ onChange, value, ref }) =>
                          minorData.value !== 'detail' && !!isMenualUser ? (
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
                                    return countryList?.find((item: any) => item.id === selected)
                                      ?.phonecode;
                                  }}
                                  onChange={onChange}
                                >
                                  {countryList?.map((item: any, index: number) => {
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
                              {!!value &&
                                countryList?.find((item: any) => item.id === value)?.phonecode +
                                  ' )'}
                            </CustomSpan>
                          )
                        }
                      />
                      <Controller
                        name="phone"
                        defaultValue=""
                        control={partnerInfoControl}
                        rules={{ required: false }}
                        render={({ onChange, value, ref }) =>
                          minorData.value !== 'detail' && !!isMenualUser ? (
                            <MuiWrapper>
                              <TextField
                                className="radius-md form__input_box"
                                variant="outlined"
                                fullWidth
                                placeholder="Fill in the information"
                                error={!!errors.phone}
                                value={value}
                                onChange={onChange}
                                inputRef={ref}
                              />
                            </MuiWrapper>
                          ) : (
                            <CustomSpan>{value}</CustomSpan>
                          )
                        }
                      />
                    </div>
                  </Grid>
                  <Grid item className="partner_info_row country">
                    <div
                      className={cx('partner_info_row_label', {
                        modify: !!isModify.value,
                      })}
                    >
                      <T>Country</T>
                    </div>
                    <div className="partner_info_row_content country">
                      <Controller
                        name="country"
                        defaultValue=""
                        control={partnerInfoControl}
                        rules={{ required: false }}
                        render={({ onChange, value, ref }) =>
                          minorData.value !== 'detail' && !!isMenualUser ? (
                            <MuiWrapper>
                              <FormControl fullWidth variant="outlined" className="countryId_box">
                                <Select
                                  MenuProps={{
                                    anchorOrigin: {
                                      vertical: 'bottom',
                                      horizontal: 'left',
                                    },
                                    getContentAnchorEl: null,
                                  }}
                                  name="country"
                                  displayEmpty
                                  value={value}
                                  renderValue={(selected: any) => {
                                    return countryList?.find((item: any) => item.id === selected)
                                      ?.name;
                                  }}
                                  onChange={e => {
                                    onChange(e);
                                    counrty.setValue(e.target.value);
                                  }}
                                >
                                  {countryList?.map((item: any, index: number) => {
                                    if (!item.name) return null;
                                    return (
                                      <MenuItem value={item.id} key={index}>
                                        {item.phonecode && item.name}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            </MuiWrapper>
                          ) : (
                            <CustomSpan>
                              {!!value &&
                                countryList?.find((item: any) => item.id === value)?.name + ','}
                            </CustomSpan>
                          )
                        }
                      />
                      <Controller
                        name="region"
                        defaultValue=""
                        control={partnerInfoControl}
                        rules={{ required: false }}
                        render={({ onChange, value, ref }) =>
                          minorData.value !== 'detail' && !!isMenualUser ? (
                            <MuiWrapper>
                              <FormControl fullWidth variant="outlined" className="regionId_box">
                                <Select
                                  MenuProps={{
                                    anchorOrigin: {
                                      vertical: 'bottom',
                                      horizontal: 'left',
                                    },
                                    getContentAnchorEl: null,
                                  }}
                                  name="country"
                                  displayEmpty
                                  value={value}
                                  renderValue={(selected: any) => {
                                    return regionList?.find((item: any) => item.id === selected)
                                      ?.name;
                                  }}
                                  onChange={e => {
                                    onChange(e);
                                    region.setValue(e.target.value);
                                  }}
                                >
                                  {regionList?.map((item: any, index: number) => {
                                    if (!item.name) return null;
                                    return (
                                      <MenuItem value={item.id} key={index}>
                                        {item.name}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            </MuiWrapper>
                          ) : (
                            <CustomSpan>
                              {regionList?.find((item: any) => item.id === value)?.name}
                            </CustomSpan>
                          )
                        }
                      />
                    </div>
                  </Grid>
                  <Grid item className="partner_info_row currency">
                    <div
                      className={cx('partner_info_row_label', {
                        modify: !!isModify.value,
                      })}
                    >
                      Currency
                    </div>
                    <div
                      className={cx('partner_info_row_content', {
                        modify: !!isModify.value,
                      })}
                    >
                      <Controller
                        name="currency"
                        defaultValue=""
                        control={partnerInfoControl}
                        rules={{ required: true }}
                        render={({ onChange, value, ref }) =>
                          minorData.value !== 'detail' ? (
                            <MuiWrapper className="">
                              <FormControl fullWidth variant="outlined">
                                <Select
                                  MenuProps={{
                                    anchorOrigin: {
                                      vertical: 'bottom',
                                      horizontal: 'left',
                                    },
                                    getContentAnchorEl: null,
                                  }}
                                  name="currency"
                                  displayEmpty
                                  value={value}
                                  onChange={onChange}
                                >
                                  <MenuItem value="" disabled>
                                    Choose
                                  </MenuItem>
                                  {currencyList?.map((item: any, index: number) => {
                                    return (
                                      <MenuItem value={item.code} key={index}>
                                        {item.feature} {item.name}
                                      </MenuItem>
                                    );
                                  })}
                                </Select>
                              </FormControl>
                            </MuiWrapper>
                          ) : (
                            <CustomSpan>{value}</CustomSpan>
                          )
                        }
                      />
                    </div>
                  </Grid>
                </Grid>
                <Grid
                  container
                  item
                  className={cx('partnerModalInput__form_box right', {
                    modify: !!isModify.value,
                  })}
                >
                  <Grid item className="partner_info_row fax">
                    <div
                      className={cx('partner_info_row_label', {
                        modify: !!isModify.value,
                      })}
                    >
                      <T>Fax</T>
                    </div>
                    <div className="partner_info_row_content">
                      <Controller
                        name="fax"
                        defaultValue=""
                        control={partnerInfoControl}
                        rules={{ required: false }}
                        render={({ onChange, value, ref }) =>
                          minorData.value !== 'detail' ? (
                            <MuiWrapper>
                              <TextField
                                className="radius-md form__input_box"
                                variant="outlined"
                                fullWidth
                                placeholder="Partner fax number"
                                error={!!errors.fax}
                                value={value}
                                onChange={onChange}
                                inputRef={ref}
                              />
                            </MuiWrapper>
                          ) : (
                            <CustomSpan>{value}</CustomSpan>
                          )
                        }
                      />
                    </div>
                  </Grid>
                  <Grid item className="partner_info_row tel">
                    <div
                      className={cx('partner_info_row_label', {
                        modify: !!isModify.value,
                      })}
                    >
                      <T>Tel</T>
                    </div>
                    <div className="partner_info_row_content">
                      <Controller
                        name="tel"
                        defaultValue=""
                        control={partnerInfoControl}
                        rules={{ required: false }}
                        render={({ onChange, value, ref }) =>
                          minorData.value !== 'detail' ? (
                            <MuiWrapper>
                              <TextField
                                className="radius-md form__input_box"
                                variant="outlined"
                                fullWidth
                                placeholder="ex) 1234-5678"
                                error={!!errors.tel}
                                value={value}
                                onChange={onChange}
                                inputRef={ref}
                              />
                            </MuiWrapper>
                          ) : (
                            <CustomSpan>{value}</CustomSpan>
                          )
                        }
                      />
                    </div>
                  </Grid>

                  <Grid item className="partner_info_row">
                    <div
                      className={cx('partner_info_row_label address', {
                        modify: !!isModify.value,
                      })}
                    >
                      <T>Address</T>
                    </div>
                    <div
                      className={cx('partner_info_row_content address', {
                        modify: !!isModify.value,
                      })}
                    >
                      <Controller
                        name="address"
                        defaultValue=""
                        control={partnerInfoControl}
                        rules={{ required: false }}
                        render={({ onChange, value, ref }) =>
                          minorData.value !== 'detail' ? (
                            <MuiWrapper className="address__input_wrapper">
                              <TextField
                                rows={4}
                                multiline
                                className="radius-md form__input_box"
                                variant="outlined"
                                fullWidth
                                placeholder="Partner company address"
                                error={!!errors.address}
                                value={value}
                                // onChange={onChange}
                                onChange={e => {
                                  // 140byte
                                  if (getStringByte(e.target.value) > 140) {
                                    return;
                                  } else {
                                    onChange(e);
                                  }
                                }}
                                inputRef={ref}
                              />
                            </MuiWrapper>
                          ) : (
                            <CustomSpan>{value}</CustomSpan>
                          )
                        }
                      />
                    </div>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            <div
              className={cx('partner_delete', {
                delete: minorData.value === 'detail',
              })}
            >
              <span onClick={onDeletePartner}>Partner disconnect</span>
            </div>
            {minorData.value === 'detail' && (
              <StyledPlainButtonOuter
                className="partnerModalInput__form_button_box detail"
                backgroundColor={color.navy_blue}
                left="50%"
                width={370}
                height={76}
              >
                <MuiButton
                  config={{
                    width: '320px',
                  }}
                  // disabled={isDataValid}
                  // disabled={!isValid}
                  disableElevation
                  color="primary"
                  variant="contained"
                  disablebackground={color.navy_blue}
                  disablefontcolor="#ffffff"
                  className="xl border-radius-round partner_ok_button "
                  onClick={() => {
                    isModify.setValue(true);
                    majorData.setValue('input');
                    minorData.setValue('edit');
                  }}
                >
                  <T>Modify</T>
                </MuiButton>
              </StyledPlainButtonOuter>
            )}
            {minorData.value === 'edit' && (
              // 파트너 Modify
              <StyledPlainButtonOuter
                className="partnerModalInput__form_button_box edit"
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
                  className="xl border-radius-round partner_ok_button "
                  onClick={(e: any) => {
                    // onSubmitPartnerData(e);
                  }}
                >
                  <T>Save</T>
                </MuiButton>
              </StyledPlainButtonOuter>
            )}
            {minorData.value === 'new' && (
              // 파트너 수기 등록
              <StyledPlainButtonOuter
                className="partnerModalInput__form_button_box new"
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
                  disabled={!isValid}
                  disableElevation
                  color="primary"
                  variant="contained"
                  disablebackground={color.navy_blue}
                  disablefontcolor="#ffffff"
                  className="xl border-radius-round partner_ok_button "
                >
                  <T>+ Register</T>
                </MuiButton>
              </StyledPlainButtonOuter>
            )}
          </form>

          {/* </div> */}
        </div>
      </div>
    </StyledPartnerModalInput>
  );
}

const StyledPartnerModalInput = styled.section<{}>`
  .partnerModalInput__container {
    position: relative;
    width: 100%;
    margin-bottom: 30px;
    background-color: #ffffff;
    border-radius: 15px;
    height: 530px;
    padding-top: 10px;

    .partnerModalInput__wrapper {
      .partnerModalInput__wrapper_icon_box {
        position: absolute;
        top: -30px;
        right: 70px;
        transform: translate(0, -50%);
      }
      .partnerModalInput__form_container {
        flex-direction: column;
        .partnerModalInput__form_wrapper {
          margin-bottom: 20px;
        }
        .partner_info_row_enterType {
        }
        .partner_info_row_nick {
          width: 300px;
          margin-bottom: 10px;
        }
      }
      .partnerModalInput__form_box {
        width: 100%;

        &.modify {
          row-gap: 30px;
          width: 50%;
          &.left {
            padding-right: 40px;
            border-top: none;
            border-right: 1px dashed #b5b7c1;
          }
          &.right {
            padding-left: 40px;
          }
        }

        .partner_info_row {
          display: flex;
          width: 100%;

          .partner_info_row_label {
            width: 35%;
            max-width: 105px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: flex-start;
            font-size: 15px;
            font-weight: 500;
            color: #17288a;
            &.modify {
              color: #303030;
              height: 40px;
            }
          }
          .partner_info_row_content {
            width: calc(100% - 105px);
            max-width: 300px;
            height: 36px;
            display: flex;
            align-items: center;
            justify-content: flex-start;

            &.address {
              max-width: 100%;
              padding-top: 5px;
              height: 73px;
              display: block;
              line-height: 25px;
              &.modify {
                /* height: 180px; */
                height: 100px;
                margin-bottom: 80px;
                .form__input_box {
                  /* height: 180px; */
                  height: 100px;
                  margin-bottom: 80px;
                }
              }
            }

            &.modify {
              height: 40px;
            }
            .partnerType_btn_group {
              width: 100%;
              .partnerType_btn {
                width: 50%;
                height: 32px;
              }
            }

            &.phone,
            &.country {
              column-gap: 10px;
            }
            .phoneCode_box {
              width: 100px;
            }
            .countryId_box {
              width: 140px;
            }
          }
        }

        &.profileImg {
          width: 125px;
          height: 80px;
          display: flex;
          align-items: flex-end;
          justify-content: flex-start;
          &.modify {
            width: 105px;
          }
          .profileImg__box {
            width: 80px;
            height: 80px;
            border-radius: 50%;
            overflow: hidden;
            position: relative;
            box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
            &.cursorPointer {
              &:hover {
                cursor: pointer;
              }
            }
            img {
              width: 80px;
              height: 80px;
            }
            .partner_profile_image_edit_background {
              position: absolute;
              bottom: 0;
              left: 0;
              width: 80px;
              height: 30px;
              display: flex;
              align-items: center;
              justify-content: center;
              opacity: 0.4;
              background-color: #000000;
              border-radius: 0 0 40px 40px / 0 0 30px 30px;
            }
            .partner_profile_image_edit_text {
              font-size: 12px;
              font-weight: 400;
              position: absolute;
              color: #ffffff;
              background-color: transparent;
              margin-bottom: 9px;
              left: 50%;
              bottom: 0;
              transform: translate(-50%, -0);
            }
          }
          .partner_profile_image_delete {
            width: 14px;
            height: 16px;
            margin-left: -5px;
            img {
              width: 14px;
              height: 16px;
            }
            &:hover {
              cursor: pointer;
            }
          }
        }
        &.nickName {
          row-gap: 10px;
          width: calc(100% - 150px);
          flex-direction: column;
          justify-content: flex-end;
          align-items: flex-start;
        }
      }

      .partner_delete {
        display: none;
        margin-top: 5px;
        &.delete {
          display: block;
        }
        text-align: center;
        span {
          color: #b5b7c1;
          text-decoration: underline;
          &:hover {
            cursor: pointer;
            color: #303030;
          }
        }
      }

      .partnerModalInput__form_button_box {
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

        .projectInformation__btn_box {
          position: relative;
          display: flex;
          .projectInformation__reject_btn {
            position: relative;
            z-index: 2;
          }
          .projectInformation__accept_btn {
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
  }
`;

export default React.memo(PartnerModalInput);
