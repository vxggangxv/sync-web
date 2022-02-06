import { Grid, Select, MenuItem, FormControl } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import cx from 'classnames';
import useInput from 'lib/hooks/useInput';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';
import { useShallowAppSelector } from 'store/hooks';
import MuiButton from 'components/common/button/MuiButton';
import MuiWrapper from 'components/common/input/MuiWrapper';
import T from 'components/common/text/T';
import { coin_stack, icon_tab_open_all, icon_tab_close_all } from 'components/base/images';
import CustomSpan from 'components/common/text/CustomSpan';
import CustomText from 'components/common/text/CustomText';
import ImplantPriceRow from 'components/account/ImplantPriceRow';
import BarChart from 'components/common/chart/BarChart';
import DonutChart from 'components/common/chart/DonutChart';
import { StyledPlainButtonOuter } from 'components/common/styled/Button';
import Collapse from '@material-ui/core/Collapse';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { EmployeeActions, UnitActions, UtilActions, AppActions } from 'store/actionCreators';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import { useDidUpdateEffect } from 'lib/utils';
import AlertModalContent from 'components/common/modal/contents/AlertModalContent';
import { devConsoleSet } from 'lib/library';

interface UnitPriceModalProps {
  modifyUnitPriceKeyCode?: string | any;
  partnershipIdx?: number | string;
  isModalModify: {
    value: boolean | null;
    onChange: (e: any) => void;
    setValue: (value: boolean) => void;
  };
  isModalClose?: boolean | null;
  onCloseModal: () => void;
  // page: object | any;
  // period: object | any;
  // checkedProjectProcess: object | any;
  // keyword: object | any;
}

interface unitPriceType {
  [key: string]: object;
}

function UnitPriceModalContainer({
  modifyUnitPriceKeyCode = '',
  partnershipIdx,
  isModalModify,
  isModalClose,
  onCloseModal,
}: UnitPriceModalProps) {
  const {
    user,
    fetchIndicationFormat,
    fetchIndicationFormatSuccess,
    fetchIndicationInfo,
    fetchIndicationInfoSuccess,
    fetchCurrencyList,
    fetchCurrencyListSuccess,
    fetchUnit,
    fetchUnitSuccess,
    updateUnitSuccess,
  } = useShallowAppSelector(state => ({
    user: state.user.user,
    fetchIndicationFormat: state.util.indicationFormat.data,
    fetchIndicationFormatSuccess: state.util.indicationFormat.success,
    fetchIndicationInfo: state.util.indicationInfo.data,
    fetchIndicationInfoSuccess: state.util.indicationInfo.success,
    fetchCurrencyList: state.util.currencyList.data,
    fetchCurrencyListSuccess: state.util.currencyList.success,
    fetchUnit: state.unit.unit.data,
    fetchUnitSuccess: state.unit.unit.success,
    updateUnitSuccess: state.unit.updateUnit.success,
  }));
  /* Depth format
   * Indication -> Part -> Meterial -> Implant
   */
  const indications = fetchIndicationFormat?.indicationFormat.indication;
  const indicationInfos = fetchIndicationInfo?.indicationInfo;
  const indicationImplants = indicationInfos?.implantList;
  const indicationMeterials = indicationInfos?.materialList;
  const indicationGroups = indicationInfos?.groupList;
  const indicationParts = indicationInfos?.partList;
  const indicationToothShades = indicationInfos?.toothShadeList;
  const currencyList = fetchCurrencyList?.currencyList;

  const unitPrice = fetchUnit?.unitPrice;

  const indicationSeq = useInput();
  const indicationPartSeq = useInput();
  const [indicationPart, setIndicationPart] = useState<object | any>();
  const [hasSelectedChild, setHasSelectedChild] = useState<boolean>(false);

  const [isModify, setIsModify] = useState<boolean>(false);
  const [isOpenAllIndication, setIsOpenAllIndication] = useState<boolean>(false);
  const [implantPrice, setImplantPrice] = useState<object | any>();
  const currency = useInput('');
  const nextCurrencySave = useInput('');
  const priceRef = useRef<null | any>(null);
  const [objectPrice, setObjectPrice] = useState<object | any>([]);
  const [selectedUnit, setSelectedUnit] = useState<object | any>();
  const [tabPartsIndex, setTabPartsIndex] = useState<number>(0);
  const [saveNextActionData, setSaveNextActionData] = useState<object | any>('');

  const selectedMeterialList = useCheckSetInput(new Set([]));
  const unitPriceCode = useInput('');

  const sectionScroll = useRef<null | any>(null);

  const noticeList = {
    title: 'Unit Data',
    mainText: '수정사항을 저장하시겠습니까?',
    subText:
      '[OK] 버튼 클릭시 수정사항이 저장되며,\n[X] 버튼 클릭시 수정사항은 저장되지 않고 이동됩니다.',
  };

  const alertNotSavePrice = (action: string, data: any) => {
    AppActions.add_popup({
      isOpen: true,
      isCloseIcon: true,
      width: 660,
      title: '',
      content: (
        <AlertModalContent
          title={noticeList.title}
          mainText={noticeList.mainText}
          subText={noticeList.subText}
        />
      ),
      onClick() {
        handleSavePrice();
        setSaveNextActionData({ action, data });
        return;
      },
      onCancel() {
        handleNextActions(action, data);
        setSaveNextActionData('');
        return;
      },
      onExit() {
        return;
      },
    });
  };

  const handleNextActions = (action: string | null, data: any) => {
    isModalModify.setValue(false);
    setIsModify(false);
    setImplantPrice('');
    if (action === 'parts') {
      selectedMeterialList.setValue(new Set([]));
      setIsOpenAllIndication(false);
      setHasSelectedChild(true);
      indicationPartSeq.onChange({ value: data.seq });
      setIndicationPart({
        ...data,
      });
    } else if (action === 'indications') {
      indicationPartSeq.onChange({ value: null });
      setIndicationPart(null);
      setHasSelectedChild(false);
      indicationSeq.onChange({ value: data.seq });
    } else if (action === 'currency') {
      currency.setValue(data);
    } else if (action === 'close') {
      onCloseModal();
    } else {
      return;
    }
  };

  const handleImplantPrice = (unitKey: string, price: number) => {
    setImplantPrice({
      ...implantPrice,
      [`${unitKey}`]: {
        unitKey,
        currency: currency.value,
        price,
      },
    });
  };

  const handleModifyCancel = () => {
    setImplantPrice('');
    setIsModify(false);
    isModalModify.setValue(false);
  };

  const handleSavePrice = () => {
    if (!implantPrice) return;
    const updateUnitList = new Array();
    Object.values(implantPrice).forEach(item => updateUnitList.push(item));
    const submitData = {
      baseUnitList: updateUnitList,
    };
    UnitActions.update_unit_request(submitData);
    setSaveNextActionData('');
  };

  useDidUpdateEffect(() => {
    if (isModalModify.value && isModalClose) {
      alertNotSavePrice('close', '');
    }
  }, [isModalClose, isModalModify.value]);

  useEffect(() => {
    if (!implantPrice) {
      // 수정사항 여부 체크
      isModalModify.setValue(false);
    } else {
      isModalModify.setValue(true);
    }
  }, [implantPrice]);

  useDidUpdateEffect(() => {
    if (updateUnitSuccess) {
      if (!saveNextActionData) {
        setImplantPrice('');
        setIsModify(false);
        isModalModify.setValue(false);
      } else {
        handleNextActions(saveNextActionData.action, saveNextActionData.data);
      }
      UnitActions.fetch_unit_request({ currency: currency.value, partnershipIdx: '' });
    }
  }, [updateUnitSuccess]);

  useDidUpdateEffect(() => {
    if (!!currency.value) {
      UnitActions.fetch_unit_request({ currency: currency.value, partnershipIdx: partnershipIdx });
    }
  }, [currency.value]);

  useDidUpdateEffect(() => {
    if (fetchUnitSuccess) {
      setObjectPrice(unitPrice);
    }
  }, [fetchUnitSuccess]);

  const handleClickIndication = (indication: any) => {
    // console.log('handleClickIndication ____ index __ ', index);
    if (!implantPrice) {
      indicationPartSeq.onChange({ value: null });
      setIndicationPart(null);
      setHasSelectedChild(false);
      if (indicationSeq.value === indication.seq) {
        indicationSeq.onChange({ value: null });
      } else {
        indicationSeq.onChange({ value: indication.seq });
      }
    } else {
      if (indicationSeq.value === indicationSeq) {
        return;
      } else {
        alertNotSavePrice('indications', indication);
      }
    }
  };

  const handleClickIndicationPart = (part: any) => {
    if (!implantPrice) {
      selectedMeterialList.setValue(new Set([]));
      setIsOpenAllIndication(false);
      if (indicationPartSeq.value === part.seq) {
        indicationPartSeq.onChange({ value: null });
        setIndicationPart(null);
        setHasSelectedChild(false);
      } else {
        if (!!sectionScroll.current) {
          sectionScroll.current.scrollTop = 0;
        }
        setHasSelectedChild(true);
        indicationPartSeq.onChange({ value: part.seq });
        setIndicationPart({
          ...part,
        });
      }
      setIsModify(false);
    } else {
      if (indicationPartSeq.value === part.seq) {
        return;
      } else {
        alertNotSavePrice('parts', part);
      }
    }
  };

  const handleOpenIndicationTabs = (indicationPart: any) => {
    setIsOpenAllIndication(!isOpenAllIndication);
    selectedMeterialList.setValue(new Set([]));

    if (!isOpenAllIndication) {
      indicationPart.forEach((item: any) => {
        selectedMeterialList.onChange({ value: item.seq });
      });
    } else {
      sectionScroll.current.scrollTop = 0;
    }
  };

  const handleChangeCurrency = (event: any) => {
    if (!implantPrice) {
      currency.setValue(event.target.value);
      setIsModify(false);
    } else {
      alertNotSavePrice('currency', event.target.value);
    }
  };

  useEffect(() => {
    if (!!modifyUnitPriceKeyCode) {
      //list에서 unit 수정 통해 들어온 경우,
      unitPriceCode.setValue(modifyUnitPriceKeyCode);
      setIsModify(true);
      setSelectedUnit({
        indication: Number(modifyUnitPriceKeyCode.split('-')[0]),
        part: Number(modifyUnitPriceKeyCode.split('-')[1]),
        meterial: Number(modifyUnitPriceKeyCode.split('-')[2]),
        implant: Number(modifyUnitPriceKeyCode.split('-')[3]),
      });
    }
  }, [modifyUnitPriceKeyCode]);

  useDidUpdateEffect(() => {
    // indication tab 펼치기 상태값 체크
    if (indicationPart?.materialList?.length === selectedMeterialList.value.size) {
      setIsOpenAllIndication(true);
    } else {
      setIsOpenAllIndication(false);
    }
  }, [selectedMeterialList.value]);

  useEffect(() => {
    if (!!selectedUnit) {
      setHasSelectedChild(true);
      indicationSeq.onChange({ value: selectedUnit.indication });
      indicationPartSeq.onChange({ value: selectedUnit.part });

      setIndicationPart({
        ...indications
          ?.find((item: any) => item.seq === selectedUnit.indication)
          ?.list?.find((item: any) => item.seq === selectedUnit.part),
      });
      selectedMeterialList.onChange({ value: selectedUnit.meterial });
    }
  }, [selectedUnit]);

  useEffect(() => {
    // init
    currency.setValue(user?.currencyCode);
    UtilActions.fetch_currency_list_request();
    UtilActions.fetch_teeth_indication_format_request();
    UtilActions.fetch_teeth_indication_info_request();
  }, []);

  return (
    <StyledUnitPriceModal data-component-name="UnitPriceModal">
      <Grid container className="unitPriceModal__container">
        <Grid item className="unitPriceModal__indication_list_wrapper">
          <img className="unitPriceModal__icon_coin" src={coin_stack} />
          {!partnershipIdx && (
            <div className="unitPriceModal__currency_container">
              <p>
                <T>Currency</T>
              </p>
              <MuiWrapper className="unitPriceModal__currency_select_wrapper">
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
                    value={currency.value}
                    onChange={handleChangeCurrency}
                  >
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
            </div>
          )}
          <div className="unitPriceModal__part_list_container">
            <div className="unitPriceModal__part_list">
              {indications?.map((indication: any, index: number) => {
                return (
                  <div key={index}>
                    <div
                      className={cx('unitPriceModal__part_list_row groupName', {
                        active:
                          !hasSelectedChild && indicationSeq.value === indication.seq
                            ? true
                            : false,
                        selectedChild:
                          !!hasSelectedChild && indicationSeq.value === indication.seq
                            ? true
                            : false,
                      })}
                      onClick={e => {
                        handleClickIndication(indication);
                      }}
                    >
                      <div
                        className="list_pointer_alphabet"
                        dangerouslySetInnerHTML={{ __html: `&#${97 + index};)` }}
                      ></div>
                      {indication.name}
                      {!!indicationSeq.value && indicationSeq.value === indication.seq && (
                        <div className="unitPriceModal__arrow_box down">
                          <ChevronRightIcon style={{ fontSize: '28px' }} />
                        </div>
                      )}
                    </div>
                    <Collapse
                      in={indicationSeq.value === indication.seq ? true : false}
                      timeout="auto"
                      unmountOnExit
                    >
                      {indication.list.map((part: any, index: number) => {
                        return (
                          <div
                            key={index}
                            className={cx('unitPriceModal__part_list_row itemName', {
                              active:
                                !!indicationPartSeq.value && indicationPartSeq.value === part.seq
                                  ? true
                                  : false,
                            })}
                            onClick={() => {
                              handleClickIndicationPart(part);
                              setTabPartsIndex(index + 1);
                            }}
                          >
                            {index + 1}. {part.name}
                            {!!indicationPartSeq.value && indicationPartSeq.value === part.seq && (
                              <div className="unitPriceModal__arrow_box right">
                                <ChevronRightIcon style={{ fontSize: '28px' }} />
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </Collapse>
                  </div>
                );
              })}
            </div>
          </div>
        </Grid>
        <Grid item className="unitPriceModal__meterial_list_wrapper">
          <div className="unitPriceModal__meterial_list_container">
            {!!indicationPart && (
              <>
                <div className="unitPriceModal__meterial_list_title_wrapper">
                  <Grid container className="unitPriceModal__meterial_list_title_box">
                    <Grid item className="unitPriceModal__meterial_list_title">
                      {tabPartsIndex}. {indicationPart.name}
                    </Grid>
                    <Grid item className="unitPriceModal__meterial_list_title_currency">
                      <div>
                        <span
                          dangerouslySetInnerHTML={{
                            __html: `${
                              currencyList?.find((item: any) => item.code === currency.value)
                                ?.feature
                            }`,
                          }}
                        ></span>{' '}
                        {currencyList?.find((item: any) => item.code === currency.value)?.name}
                      </div>
                      <span
                        className="unitPriceModal__meterial_list_tab_open"
                        onClick={() => {
                          handleOpenIndicationTabs(indicationPart.materialList);
                        }}
                      >
                        {isOpenAllIndication ? (
                          <img src={icon_tab_close_all} />
                        ) : (
                          <img src={icon_tab_open_all} />
                        )}
                      </span>
                    </Grid>
                  </Grid>
                </div>
                <div className="unitPriceModal__meterial_list_box" ref={sectionScroll}>
                  {indicationPart.materialList.map((meterial: any, index: number) => {
                    return (
                      <div key={index}>
                        <Grid
                          container
                          className="unitPriceModal__meterial_list_row item"
                          onClick={() => {
                            selectedMeterialList.onChange({ value: meterial.seq });
                            unitPriceCode.setValue('');
                          }}
                        >
                          <CustomSpan
                            fontSize={14}
                            fontWeight={400}
                            marginLeft={10}
                            fontColor="#00A4E3"
                          >
                            {tabPartsIndex}-{index + 1}.
                            {
                              indicationMeterials?.find((item: any) => item.idx === meterial.seq)
                                ?.name
                            }
                          </CustomSpan>
                          <ArrowDropUpIcon
                            className={cx('unitPriceModal__meterial_list_row_arrow', {
                              open: selectedMeterialList.value.has(meterial.seq),
                            })}
                            htmlColor="#B5B7C1"
                            fontSize="large"
                          />
                        </Grid>
                        <Collapse
                          in={selectedMeterialList.value.has(meterial.seq)}
                          timeout="auto"
                          unmountOnExit
                        >
                          <div ref={priceRef} className="unitPriceModal__implant_list_wrapper">
                            {meterial.implantList.map((implant: any, index: number) => {
                              return (
                                <ImplantPriceRow
                                  unitPriceCode={unitPriceCode.value}
                                  // isModify={!!modifyUnitPriceKeyCode ? true : isModify}
                                  isModify={isModify}
                                  implantType={
                                    indicationImplants?.find(
                                      (item: any) => item.idx === implant.seq,
                                    )?.type || ''
                                  }
                                  implantId={implant.seq}
                                  unitKey={implant.key}
                                  unitPrice={
                                    objectPrice.find((item: any) => item.unitKey === implant.key)
                                      ?.price
                                  }
                                  onChangePrice={handleImplantPrice}
                                  key={index}
                                />
                              );
                            })}
                          </div>
                        </Collapse>
                      </div>
                    );
                  })}
                </div>
              </>
            )}
          </div>
          {!!indicationPartSeq.value && (
            <div className="unitPriceModal__btn_wrapper">
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
                  disableElevation
                  disabled={!!isModify && !implantPrice}
                  variant={isModify ? 'contained' : 'outlined'}
                  disablebackground={color.blue}
                  disablefontcolor="#ffffff"
                  className="xl border-radius-round unitPriceModal__save_btn "
                  onClick={() => {
                    if (isModify) {
                      handleSavePrice();
                    } else {
                      if (!isOpenAllIndication) {
                        // modify 클릭시, 탭 펼치기
                        handleOpenIndicationTabs(indicationPart.materialList);
                      }
                      setIsModify(true);
                    }
                  }}
                >
                  {!isModify ? <T>Modify</T> : <T>Save</T>}
                </MuiButton>
                {isModify && (
                  <IconButton
                    aria-label="cancel modal"
                    className="unitPriceModal__cancel_btn"
                    onClick={e => {
                      e.stopPropagation();
                      handleModifyCancel();
                    }}
                  >
                    <CloseIcon htmlColor="white" fontSize="inherit" className="modal__close_icon" />
                  </IconButton>
                )}
              </StyledPlainButtonOuter>
            </div>
          )}
        </Grid>
      </Grid>
    </StyledUnitPriceModal>
  );
}

const StyledUnitPriceModal = styled.section<{}>`
  .unitPriceModal__btn_wrapper {
    position: relative;
    .unitPriceModal__cancel_btn {
      position: absolute;
      top: 50%;
      right: 18px;
      border: 1px solid #ffffff;
      border-radius: 18px;
      width: 36px;
      height: 36px;
      transform: translate(0, -50%);
      display: inline-flex;
      align-items: center;
      justify-content: center;
      z-index: 10;
    }
  }
  .list_pointer_alphabet {
    margin-right: 5px;
  }
  .unitPriceModal__container {
    width: 100%;
    border-radius: 15px;
    /* padding: 40px 30px 38px; */
    background-color: #ffffff;
    /* position: relative; */
    .unitPriceModal__indication_list_wrapper {
      width: 455px;
      height: 810px;
      padding: 30px 30px 68px;
      position: relative;
      .unitPriceModal__icon_coin {
        position: absolute;
        top: -56px;
        right: 0;
      }
      .unitPriceModal__currency_container {
        height: 87px;
        .unitPriceModal__currency_select_wrapper {
          margin-top: 10px;
          width: 295px;
        }
      }

      .unitPriceModal__part_list_container {
        padding: 22px 0 22px 14px;
        box-shadow: inset 2px 2px 4px rgb(0 0 0 / 16%);
        background-color: #fbfcfd;
        border-radius: 15px;
        width: 395px;
        height: 632px;
        .unitPriceModal__part_list {
          /* width: calc(395px - 28px); */
          height: calc(632px - 44px);
          /* margin: 22px 14px; */
          /* padding-right: 10px; */
          /* margin-right: -10px; */
          padding-right: 14px;
          overflow-y: overlay;

          .unitPriceModal__part_list_row {
            width: 100%;
            border-bottom: 1px solid #eff1f8;
            position: relative;
            /* display: inline-block; */
            display: flex;
            justify-content: flex-start;
            align-items: center;
            font-size: 16px;
            &.groupName {
              color: #b5b7c1;
              height: 58px;
              padding-left: 33px;
              font-weight: 500;
            }

            &.itemName {
              height: 45px;
              padding-left: 53px;
              font-weight: 400;
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
                color: #ffffff;
              }
            }

            &.active {
              background-color: #00a4e3;
              border-radius: 5px 29px 29px 5px;
              border-bottom: 1px solid #b2bedd;
              position: relative;
              color: #ffffff;

              .unitPriceModal__arrow_box {
                position: absolute;
                width: 30px;
                height: 30px;
                /* top: 50%; */
                right: 14px;
                border: 1px solid #ffffff;
                border-radius: 50%;
                display: flex;
                justify-content: center;
                align-items: center;
                transform: translate(0, -50%);
                &.down {
                  transform: rotate(90deg);
                }
                &.right {
                  top: 50%;
                }
              }
            }

            &.selectedChild {
              color: #00a4e3;
              .unitPriceModal__arrow_box {
                display: none;
              }
            }
          }
        }
      }
    }
    .unitPriceModal__meterial_list_wrapper {
      /* width: 805px; */
      width: 685px;
      height: 810px;
      /* padding: 40px 30px 68px; */
      padding: 40px 30px 0;
      border-radius: 15px 0 0 15px;
      /* box-shadow: 0px 3px 6px rgb(0 0 0 / 16%); */
      box-shadow: 0px 0px 10px rgb(0 0 0 / 16%);
      position: relative;
      .unitPriceModal__meterial_list_container {
        border: 1px solid #b5b7c1;
        border-radius: 5px;
        overflow: hidden;
        height: calc(100% - 68px);
        margin-bottom: 68px;

        //list title
        .unitPriceModal__meterial_list_title_wrapper {
          height: 50px;
          background-color: #edf4fb;
          display: flex;
          align-items: center;
          .unitPriceModal__meterial_list_title_box {
            font-size: 16px;
            font-weight: 700;
            justify-content: space-between;
            .unitPriceModal__meterial_list_title {
              margin-left: 40px;
            }
            .unitPriceModal__meterial_list_title_currency {
              /* margin-right: 115px; */
              width: 140px;
              display: flex;
              align-items: center;
              justify-content: space-between;
              .unitPriceModal__meterial_list_tab_open {
                /* margin-right: 20px; */
                margin-right: 60px;
                display: flex;
                align-items: flex-end;
              }
            }
          }
        }
        //list item
        .unitPriceModal__meterial_list_box {
          /* height: 662px; */
          height: calc(100% - 50px);
          padding: 19px 40px 19px 40px;
          overflow-y: overlay;
          .unitPriceModal__meterial_list_row {
            align-items: center;
            justify-content: space-between;

            &.item {
              height: 45px;
              border-bottom: 1px solid #eff1f8;
              justify-content: space-between;
              .unitPriceModal__meterial_list_row_arrow {
                margin-right: 12px;
                transform: rotate(180deg);
                &.open {
                  transform: rotate(0deg);
                }
              }
            }
          }

          .unitPriceModal__implant_list_wrapper {
            padding: 4px 0;
            display: flex;
            flex-direction: column;
            row-gap: 10px;
            border-bottom: 1px solid #eff1f8;
          }
        }
      }
    }
  }
`;

export default React.memo(UnitPriceModalContainer);
