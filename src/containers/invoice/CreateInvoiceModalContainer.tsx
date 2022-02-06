import { FormControl, Grid, IconButton, MenuItem, Select, TextField } from '@material-ui/core';
import MuiButton from 'components/common/button/MuiButton';
import CustomDatePicker from 'components/common/input/CustomDatePicker';
import MuiWrapper from 'components/common/input/MuiWrapper';
import { StyledPlainButtonOuter } from 'components/common/styled/Button';
import CustomSpan from 'components/common/text/CustomSpan';
import useDateInput from 'lib/hooks/useDateInput';
import useInput from 'lib/hooks/useInput';
import React, { Fragment, useEffect, useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import cx from 'classnames';
import PencilUnderlineIcon from 'components/base/icons/PencilUnderlineIcon';
import TrashIcon from 'components/base/icons/TrashIcon';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { useDidUpdateEffect } from 'lib/utils';
import { addCommas, validateObjProperties } from 'lib/library';
import CustomText from 'components/common/text/CustomText';
import moment from 'moment';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';
import { AppActions, InvoiceActions, PartnerActions } from 'store/actionCreators';
import { fetch_sync_partners } from 'store/modules/partner';
import AsyncFetchSelect from 'components/common/select/AsyncFetchSelect';
import { fetchSyncPartners } from 'api/partner';
import { debounce } from 'lodash';

interface CreateInvoiceModalContainerProps {
  fetchInvoicePartners: (value: {
    keyword?: string;
    page?: number;
    setLoading?: (value: boolean) => {};
  }) => any;
}

interface Unit {
  // [key: string]: string | number;
  content: string;
  quantity: number;
  unitPrice: number;
  //
  isModify?: boolean;
}

interface ProjectInvoice {
  projectIdx: number;
  projectId: string;
  unitList: Unit[];
}

interface InvoicePartnersData {
  list?: {
    email: string;
    groupCode: string;
    isSelf: number;
    name: string;
    partnerType: null | number;
    userGroupIdx: number;
  }[];
  pagingData?: {
    endPage: number;
    nextPage: number;
    page: number;
    prevPage: number;
    startPage: number;
    totalPage: number;
  };
}

interface InvoicePartner {
  email: string;
  groupCode: string;
  isSelf: number;
  name: string;
  partnerType: null | number;
  userGroupIdx: number;
}

interface InvoicePagingData {
  endPage: number;
  nextPage: number;
  page: number;
  prevPage: number;
  startPage: number;
  totalPage: number;
}

function CreateInvoiceModalContainer({ fetchInvoicePartners }: CreateInvoiceModalContainerProps) {
  const period = useDateInput(null);
  //
  const partner = useInput('');
  const partnerKeyword = useInput('');
  const [fetchInvoicePartnersLoading, setFetchInvoicePartnersLoading] = useState(false);
  const [invoicePartners, setInvoicePartners] = useState<any[] | InvoicePartner[]>([]);
  const [invoicePartnersPagingData, setInvoicePartnersPagingData] =
    useState<null | InvoicePagingData>(null);
  const hasMoreInvoicePartners =
    invoicePartnersPagingData &&
    invoicePartnersPagingData.page < invoicePartnersPagingData.totalPage;

  // TEMP:
  const invoiceListData: any[] = [];
  // const invoiceListData = [
  //   // 프로젝트별 unit 정보 리스트
  //   {
  //     projectIdx: 1, // 프로젝트 idx
  //     projectId: '211013-sender-0001', // 프로젝트 id
  //     unitList: [
  //       // unit 정보 리스트
  //       {
  //         content: 'Crown Zirconia', // unit 이름
  //         quantity: 10, // 수량
  //         unitPrice: 100000, //가격
  //       },
  //       {
  //         content: 'Anatomic ceramic',
  //         quantity: 7,
  //         unitPrice: 3000,
  //       },
  //     ],
  //   },
  //   {
  //     projectIdx: 2, // 프로젝트 idx
  //     projectId: '211013-sender-0002', // 프로젝트 id
  //     unitList: [
  //       // unit 정보 리스트
  //       {
  //         content: 'Crown Zirconia', // unit 이름
  //         quantity: 10, // 수량
  //         unitPrice: 100000, //가격
  //       },
  //       {
  //         content: 'Anatomic ceramic',
  //         quantity: 7,
  //         unitPrice: 3000,
  //       },
  //     ],
  //   },
  //   {
  //     projectIdx: 3, // 프로젝트 idx
  //     projectId: '211013-sender-0003', // 프로젝트 id
  //     unitList: [
  //       // unit 정보 리스트
  //       {
  //         content: 'Crown Zirconia', // unit 이름
  //         quantity: 10, // 수량
  //         unitPrice: 100000, //가격
  //       },
  //       {
  //         content: 'Anatomic ceramic',
  //         quantity: 7,
  //         unitPrice: 3000,
  //       },
  //     ],
  //   },
  // ];

  const unitListBodyRef = useRef<HTMLDivElement | any>(null);
  const [invoiceList, setInvoiceList] = useState<ProjectInvoice[]>([]);
  const checkedModifyProject = useCheckSetInput(new Set([]));
  // const [invoiceList, setInvoiceList] = useState<ProjectInvoice[]>(invoiceListData);
  const [newUnitList, setNewUnitList] = useState<Unit[]>([]);
  const [newUnitListLength, setNewUnitListLength] = useState(0);
  const discount = useInput(0);
  const overdue = useInput(0);
  const totalPrice = useMemo(() => {
    const allUnitList = invoiceList.reduce((acc, curr) => {
      return acc.concat(...curr.unitList);
    }, [] as any[]);
    const totalUnitPrice = allUnitList.reduce((acc, curr) => {
      return (acc = acc + curr.unitPrice * curr.quantity);
    }, 0);
    const totalNewUnitPrice = newUnitList.reduce((acc, curr) => {
      return (acc = acc + curr.unitPrice * curr.quantity);
    }, 0);
    return totalUnitPrice + totalNewUnitPrice;
  }, [invoiceList, newUnitList]);
  const finalPrice = totalPrice - discount.value + overdue.value;
  const validNewUnitList = useMemo(
    () =>
      !!newUnitList.length ? [...newUnitList].filter(item => validateObjProperties(item)) : [],
    [newUnitList],
  );
  const isValidUnitData = useMemo(() => {
    return [!!invoiceList.length, !!validNewUnitList.length].some(item => item === true);
  }, [invoiceList.length, validNewUnitList]);

  // SECTION: function

  const handleFetchInvoicePartners = debounce(async (first?: boolean) => {
    if (first) {
      console.log('first');
      const result = await fetchInvoicePartners({ keyword: '', page: 1 });
      setInvoicePartners(result?.list);
      setInvoicePartnersPagingData(result?.pagingData);
      return;
    }

    if (!hasMoreInvoicePartners) return;
    const result = await fetchInvoicePartners({
      keyword: partnerKeyword.value?.trim() || '',
      page: invoicePartnersPagingData ? invoicePartnersPagingData?.page + 1 : 1,
    });
    setInvoicePartners(draft => draft.concat(result?.list));
    setInvoicePartnersPagingData(result?.pagingData);
    return;
  }, 500);

  const handleSearchInvoicePartners = debounce(async (value: string) => {
    // console.log('search value', value);
    partnerKeyword.setValue(value);
    setInvoicePartners([]);
    const result = await fetchInvoicePartners({ keyword: value?.trim() || '', page: 1 });
    setInvoicePartners(result?.list);
    setInvoicePartnersPagingData(result?.pagingData);
  }, 500);

  // TEST:
  useEffect(() => {
    console.log('invoicePartners', invoicePartners);
  }, [invoicePartners]);

  // isNew를 통해 invoiceList, newUnitList 구분
  // 새로 만든 projectId 수정, for newUnitList
  const handleChangeUnitProjectId = ({
    id,
    projectId,
    isNew,
  }: {
    id: number;
    projectId: string;
    isNew?: boolean;
  }) => {
    setNewUnitList(draft => {
      return draft.reduce((acc, curr, idx) => {
        return acc.concat(idx === id ? { ...curr, projectId } : curr);
      }, [] as any[]);
    });
  };

  // onChange - content, quzntity, unitPrice value
  // 타입 상수 설정
  const CONTENT = 'content';
  const QUANTITY = 'quantity';
  const UNIT_PRICE = 'unitPrice';
  const handleChangeUnit = ({
    invoiceIdx,
    id,
    isNew,
    type,
    value,
  }: {
    invoiceIdx?: number;
    id: number;
    isNew?: boolean;
    type: string;
    value: string | number;
  }) => {
    if ([QUANTITY, UNIT_PRICE].includes(type) && isNaN(Number(value))) return;

    if (isNew) {
      setNewUnitList(draft => {
        return draft.reduce((acc, curr, idx) => {
          return acc.concat(idx === id ? { ...curr, [type]: value } : curr);
        }, [] as any[]);
      });

      return;
    }

    setInvoiceList(draft => {
      return draft.reduce((acc, curr, idx) => {
        if (idx === invoiceIdx) {
          const parsedUnitList = curr.unitList.reduce((unitAcc, unitCurr, unitIdx) => {
            return unitAcc.concat(unitIdx === id ? { ...unitCurr, [type]: value } : unitCurr);
          }, [] as any[]);

          return acc.concat({ ...curr, unitList: parsedUnitList });
        }
        return acc.concat(curr);
      }, [] as any[]);
    });
  };

  // 기존 invoice data 수정, for InvoiceList
  const handleModifyUnit = ({
    invoiceIdx,
    id,
    isModify,
    isNew,
  }: {
    invoiceIdx: number;
    id: number;
    isModify: boolean | undefined;
    isNew?: boolean;
  }) => {
    setInvoiceList(draft => {
      return draft.reduce((acc, curr, idx) => {
        if (idx === invoiceIdx) {
          const parsedUnitList = curr.unitList.reduce(
            (unitAcc, unitCurr, unitIdx) =>
              unitAcc.concat(
                unitIdx === id ? { ...unitCurr, isModify: !unitCurr.isModify } : unitCurr,
              ),
            [] as any[],
          );

          return acc.concat({ ...curr, unitList: parsedUnitList });
        }
        return acc.concat(curr);
      }, [] as any[]);
    });

    // when modify, focus input
    if (!isModify) {
      unitListBodyRef.current
        // .querySelector(`[data-id="${id}"] .createInvoiceModal__receipt_input.price`)
        .querySelector(`[data-id="${id}"] .createInvoiceModal__receipt_input.content`)
        .focus();
    }
  };

  const handleRemoveUnit = ({
    invoiceIdx,
    id,
    isNew,
  }: {
    invoiceIdx?: number;
    id: number;
    isNew?: boolean;
  }) => {
    if (isNew) {
      setNewUnitList(draft => {
        return draft.filter((item, idx) => idx !== id);
      });

      return;
    }

    setInvoiceList(draft => {
      const currentInvoice: ProjectInvoice | any =
        draft.find((item, idx) => idx === invoiceIdx) || [];
      // console.log('currentInvoice', currentInvoice);
      //
      if (currentInvoice.unitList.length === 1) {
        return draft.filter((item, idx) => idx !== invoiceIdx);
      } else {
        return draft.reduce((acc, curr, idx) => {
          if (idx === invoiceIdx) {
            const parsedUnitList = curr.unitList.filter((unitItem, unitIdx) => {
              return unitIdx !== id;
            });

            return acc.concat({ ...curr, unitList: parsedUnitList });
          }
          return acc.concat(curr);
        }, [] as any[]);
      }
    });
    // setUnitList((draft: any[]) => {
    //   return draft.reduce((acc, curr) => {
    //     return acc.concat(idx === id ? { ...curr, isRemove: !curr.isRemove } : curr);
    //   }, [] as object[]);
    // });
  };

  const handleAddUnit = () => {
    // let isValid = true;
    // if (newUnitList.length) {
    //   console.log('newUnitList[newUnitList.length - 1]', newUnitList[newUnitList.length - 1]);
    //   isValid = validateObjProperties(newUnitList[newUnitList.length - 1]);
    // }

    // if (!isValid) return;

    const unitDefaultForm = {
      content: '',
      quantity: 0,
      unitPrice: 0,
    };
    setNewUnitList((draft: any) => [...draft, unitDefaultForm]);
  };

  const handlePublishProject = () => {
    // TODO: request api
    console.log('invoiceList', invoiceList);
    console.log('validNewUnitList', validNewUnitList);
    console.log('isValidUnitData', isValidUnitData);
  };

  // SECTION: DidMount
  // init invoiceProjectList data
  useEffect(() => {
    handleFetchInvoicePartners(true);

    if (invoiceListData?.length) {
      // const parsedProjectInvoiceList = invoiceListData.reduce((acc, curr) => {
      //   const parsedUnitList = curr.unitList.reduce(
      //     (unitAcc, unitCurr) => unitAcc.concat({ ...unitCurr, isModify: false }),
      //     [] as any[],
      //   );

      //   return acc.concat({ ...curr, unitList: parsedUnitList });
      // }, [] as any[]);
      // setInvoiceList(parsedProjectInvoiceList);
      setInvoiceList(invoiceListData);
    }
  }, []);

  // SECTION: DidUpdate
  // when newUnitList.length change, compare prevLength with currentLength
  useDidUpdateEffect(() => {
    // if add, scroll and focus
    if (unitListBodyRef.current) {
      unitListBodyRef.current.scrollTop = unitListBodyRef.current.scrollHeight;

      const isBigger = newUnitList.length > newUnitListLength;
      const inputRowElementList = unitListBodyRef.current.querySelectorAll(`[data-new-id]`);
      if (inputRowElementList.length && isBigger) {
        const lastElement = inputRowElementList[inputRowElementList.length - 1];
        lastElement.querySelector(`.createInvoiceModal__receipt_input.content`).focus();
      }
    }
    setNewUnitListLength(newUnitList.length);
  }, [newUnitList.length]);

  const fetchInvoiceInitParams = useMemo(
    () => ({
      startDate: period.value ? period.value[0] : '',
      endDate: period.value ? period.value[1] : '',
      partnershipIdx: partner.value || '',
    }),
    [partner.value, period.value],
  );

  // when partner, period change, request api
  useDidUpdateEffect(() => {
    InvoiceActions.fetch_invoice_init_request(fetchInvoiceInitParams);
  }, [partner.value, period.value]);

  // useEffect(() => {
  //   console.log('period.value', period.value);
  //   if (period.value) {
  //     console.log(period.value[0].format('YYYY-MM-DD'));
  //     console.log(period.value[1].format('YYYY-MM-DD'));
  //   }
  // }, [period.value]);

  // TEST:
  useEffect(() => {
    console.log('invoiceList', invoiceList);
  }, [invoiceList]);

  return (
    <StyledCreateInvoiceModalContainer data-component-name="CreateInvoiceModalContainer">
      <div className="createInvoiceModal__top">
        <div className="createInvoiceModal__filter_container">
          <div className="createInvoiceModal__filter_label">Please select a partner and date.</div>
          <div className="createInvoiceModal__filter_box">
            {/* <MuiWrapper className="sm createInvoiceModal__partner_select_box" isGlobalStyle>
              <FormControl fullWidth variant="outlined">
                <Select
                  MenuProps={{
                    anchorOrigin: {
                      vertical: 'bottom',
                      horizontal: 'left',
                    },
                    getContentAnchorEl: null,
                    marginThreshold: 10,
                  }}
                  displayEmpty
                  // multiple
                  // name="preferedProgram"
                  value={partner?.value}
                  onChange={partner?.onChange}
                  // renderValue={selected => {
                  //   if (selected.length === 0) return '';
                  //   const selectedLabelList = toolList.reduce((acc, curr) => {
                  //     if (selected.includes(curr.id)) return acc.concat(curr.label);
                  //     return acc;
                  //   }, []);

                  //   return selectedLabelList.join(', ');
                  // }}
                >
                  <MenuItem value="" disabled>
                    <CustomSpan fontColor={color.gray_week}>Partner list</CustomSpan>
                  </MenuItem>
                  <MenuItem value="1">1</MenuItem>
                  <MenuItem value="2">2</MenuItem>
                </Select>
              </FormControl>
            </MuiWrapper> */}
            <AsyncFetchSelect
              className="sm createInvoiceModal__partner_select_box"
              // fullWidth
              // fontColor="white"
              // borderColor="white"
              // hoverBorderColor="white"
              // activeBorderColor="white"
              // loadingIconColor="white"
              // dropIconColor="white"
              // placeholderColor="white"
              inputProps={{
                placeholder: 'Patner list',
                selectedValue: partner.value,
                setSelectedValue: partner.setValue,
                data: invoicePartners,
                hasMoreData: hasMoreInvoicePartners,
                idKey: 'userGroupIdx',
                labelKey: 'name',
                onFetch: handleFetchInvoicePartners,
                searchLoading: fetchInvoicePartnersLoading,
                onSearch: handleSearchInvoicePartners,
              }}
            />

            <CustomDatePicker
              type="rangeDate"
              fullWidth
              borderColor="#B5B7C1"
              height={32}
              fontSize={12}
              value={period.value}
              onChange={period.onChange}
              className={cx({
                error: period.value !== null ? !period.value : false,
              })}
              isClient={true}
            />
          </div>
        </div>
      </div>

      <div className="createInvoiceModal__middle">
        <div className="createInvoiceModal__receipt_container">
          <div className="createInvoiceModal__receipt_info_box">
            <div className="createInvoiceModal__receipt_info_card">
              <div className="createInvoiceModal__receipt_info_card_partner">
                <div className="createInvoiceModal__receipt_info_card_partner_to flex-center">
                  Invoice to
                </div>
                <CustomText fontSize={21} fontWeight={700} marginTop={25}>
                  {'웃는내일치과'}
                </CustomText>
              </div>
              {/* <div className="createInvoiceModal__receipt_info_card_order_code">
                <CustomText fontColor={color.gray_week}>Order Code</CustomText>
                <CustomText fontSize={19} fontWeight={500} marginTop={15}>
                  {'#000001'}
                </CustomText>
              </div> */}
              <div className="createInvoiceModal__receipt_info_card_date">
                <CustomText fontColor={color.gray_week}>Project Date</CustomText>
                {period.value && (
                  <CustomText fontSize={19} fontWeight={500} marginTop={15}>
                    {moment(period.value[0]).format('MMM DD, YYYY')} ~{' '}
                    {moment(period.value[1]).format('MMM DD, YYYY')}
                  </CustomText>
                )}
              </div>
              <div className="createInvoiceModal__receipt_info_card_email">
                <CustomText fontColor={color.gray_week}>Account Email</CustomText>
                <CustomText fontSize={19} fontWeight={500} marginTop={15}>
                  {'shk@gmail.com'}
                </CustomText>
              </div>
            </div>
          </div>

          <div className="createInvoiceModal__receipt_items_box">
            <div className="createInvoiceModal__receipt_items_table">
              <Grid container className="createInvoiceModal__receipt_items_thead">
                <Grid item container className="createInvoiceModal__receipt_items_row">
                  <Grid
                    item
                    container
                    alignItems="center"
                    className="createInvoiceModal__receipt_items_th"
                  >
                    Project ID
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    className="createInvoiceModal__receipt_items_th"
                  >
                    Content
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    justifyContent="center"
                    className="createInvoiceModal__receipt_items_th"
                  >
                    Quantity
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    justifyContent="flex-end"
                    className="createInvoiceModal__receipt_items_th"
                  >
                    Unit price
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    justifyContent="flex-end"
                    className="createInvoiceModal__receipt_items_th"
                  >
                    Price
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    justifyContent="center"
                    className="createInvoiceModal__receipt_items_th"
                  ></Grid>
                </Grid>
              </Grid>

              <Grid
                container
                className="createInvoiceModal__receipt_items_tbody"
                ref={unitListBodyRef}
              >
                {!invoiceList.length && !newUnitList.length && (
                  <Grid item container className="createInvoiceModal__receipt_items_row">
                    <Grid
                      item
                      container
                      alignItems="center"
                      className="createInvoiceModal__receipt_items_td"
                    >
                      <button
                        className="createInvoiceModal__receipt_items_plus_icon_box btn-reset flex-center"
                        onClick={handleAddUnit}
                      >
                        <AddIcon
                          htmlColor="white"
                          fontSize="inherit"
                          className="createInvoiceModal__receipt_items_plus_icon"
                        />
                      </button>
                    </Grid>
                  </Grid>
                )}
                {!!invoiceList.length &&
                  invoiceList.map((invoiceItem: ProjectInvoice, invoiceIdx: number) => (
                    <Fragment key={invoiceItem.projectIdx}>
                      {!!invoiceItem.unitList.length &&
                        invoiceItem.unitList.map((unitItem, unitIdx) => {
                          const isModifyUnitItem = [...checkedModifyProject.value].find(
                            item => item === `${invoiceIdx}-${unitIdx}`,
                          );

                          return (
                            <Grid
                              item
                              container
                              className="createInvoiceModal__receipt_items_row"
                              data-id={unitIdx}
                              key={unitIdx}
                            >
                              <Grid
                                item
                                container
                                alignItems="center"
                                className="createInvoiceModal__receipt_items_td"
                              >
                                {invoiceIdx === invoiceList.length - 1 &&
                                  unitIdx === invoiceItem.unitList.length - 1 &&
                                  !newUnitList.length && (
                                    <button
                                      className="createInvoiceModal__receipt_items_plus_icon_box btn-reset flex-center"
                                      onClick={handleAddUnit}
                                    >
                                      <AddIcon
                                        htmlColor="white"
                                        fontSize="inherit"
                                        className="createInvoiceModal__receipt_items_plus_icon"
                                      />
                                    </button>
                                  )}
                                {unitIdx === 0 && invoiceItem.projectId}
                              </Grid>
                              <Grid
                                item
                                container
                                alignItems="center"
                                className="createInvoiceModal__receipt_items_td"
                              >
                                <input
                                  type="text"
                                  readOnly={!isModifyUnitItem}
                                  placeholder=""
                                  value={unitItem.content || ''}
                                  onChange={e =>
                                    handleChangeUnit({
                                      invoiceIdx,
                                      id: unitIdx,
                                      type: CONTENT,
                                      value: e.target.value,
                                    })
                                  }
                                  className="createInvoiceModal__receipt_input content"
                                />
                              </Grid>
                              <Grid
                                item
                                container
                                alignItems="center"
                                justifyContent="center"
                                className="createInvoiceModal__receipt_items_td"
                              >
                                <input
                                  type="text"
                                  readOnly={!isModifyUnitItem}
                                  placeholder="0"
                                  value={unitItem.quantity || ''}
                                  maxLength={11}
                                  onChange={e =>
                                    handleChangeUnit({
                                      invoiceIdx,
                                      id: unitIdx,
                                      type: QUANTITY,
                                      value: Number(e.target.value.replace(/,/g, '')),
                                    })
                                  }
                                  className="createInvoiceModal__receipt_input quantity"
                                />
                              </Grid>
                              <Grid
                                item
                                container
                                alignItems="center"
                                justifyContent="flex-end"
                                className="createInvoiceModal__receipt_items_td"
                              >
                                <input
                                  type="text"
                                  readOnly={!isModifyUnitItem}
                                  placeholder="0"
                                  value={unitItem.unitPrice ? addCommas(unitItem.unitPrice) : ''}
                                  maxLength={11}
                                  onChange={e =>
                                    handleChangeUnit({
                                      invoiceIdx,
                                      id: unitIdx,
                                      type: UNIT_PRICE,
                                      value: Number(e.target.value.replace(/,/g, '')),
                                    })
                                  }
                                  className="createInvoiceModal__receipt_input price"
                                />
                              </Grid>
                              <Grid
                                item
                                container
                                alignItems="center"
                                justifyContent="flex-end"
                                className="createInvoiceModal__receipt_items_td"
                              >
                                &#65510; {addCommas(unitItem.unitPrice * unitItem.quantity)}
                              </Grid>
                              <Grid
                                item
                                container
                                alignItems="center"
                                className="createInvoiceModal__receipt_items_td"
                              >
                                <IconButton
                                  aria-label="cancel modal"
                                  onClick={() =>
                                    checkedModifyProject.onChange({
                                      value: `${invoiceIdx}-${unitIdx}`,
                                    })
                                  }
                                >
                                  <PencilUnderlineIcon color={color.gray_week} width={15} />
                                </IconButton>

                                <IconButton
                                  aria-label="cancel modal"
                                  onClick={() =>
                                    handleRemoveUnit({
                                      // projectIdx: invoiceItem.projectIdx,
                                      invoiceIdx,
                                      id: unitIdx,
                                    })
                                  }
                                >
                                  <TrashIcon />
                                </IconButton>
                              </Grid>
                            </Grid>
                          );
                        })}
                    </Fragment>
                  ))}

                {!!newUnitList.length &&
                  newUnitList.map((item: Unit, idx) => (
                    <Grid
                      item
                      container
                      className="createInvoiceModal__receipt_items_row"
                      data-new-id={`new-${idx}`}
                      key={idx}
                    >
                      {/* <Grid
                        item
                        container
                        alignItems="center"
                        className="createInvoiceModal__receipt_items_td"
                      >
                        {idx === newUnitList.length - 1 && (
                          <button
                            className="createInvoiceModal__receipt_items_plus_icon_box btn-reset flex-center"
                            onClick={handleAddUnit}
                          >
                            <AddIcon
                              htmlColor="white"
                              fontSize="inherit"
                              className="createInvoiceModal__receipt_items_plus_icon"
                            />
                          </button>
                        )}
                        <input
                          type="text"
                          placeholder=""
                          value={item.projectId || ''}
                          onChange={e =>
                            handleChangeUnitProjectId({
                              id: idx,
                              isNew: true,
                              projectId: e.target.value,
                            })
                          }
                          className="createInvoiceModal__receipt_input project_id"
                        />
                      </Grid> */}
                      <Grid
                        item
                        container
                        alignItems="center"
                        className="createInvoiceModal__receipt_items_td new"
                      >
                        {idx === newUnitList.length - 1 && (
                          <button
                            className="createInvoiceModal__receipt_items_plus_icon_box btn-reset flex-center"
                            onClick={handleAddUnit}
                          >
                            <AddIcon
                              htmlColor="white"
                              fontSize="inherit"
                              className="createInvoiceModal__receipt_items_plus_icon"
                            />
                          </button>
                        )}
                        <input
                          type="text"
                          placeholder="Enter content..."
                          value={item.content || ''}
                          onChange={e =>
                            handleChangeUnit({
                              id: idx,
                              isNew: true,
                              type: CONTENT,
                              value: e.target.value,
                            })
                          }
                          className="createInvoiceModal__receipt_input content new"
                        />
                      </Grid>
                      <Grid
                        item
                        container
                        alignItems="center"
                        justifyContent="center"
                        className="createInvoiceModal__receipt_items_td new"
                      >
                        <input
                          type="text"
                          placeholder="0"
                          value={item.quantity || ''}
                          maxLength={11}
                          onChange={e =>
                            handleChangeUnit({
                              id: idx,
                              isNew: true,
                              type: QUANTITY,
                              value: Number(e.target.value.replace(/,/g, '')),
                            })
                          }
                          className="createInvoiceModal__receipt_input quantity"
                        />
                      </Grid>
                      <Grid
                        item
                        container
                        alignItems="center"
                        justifyContent="flex-end"
                        className="createInvoiceModal__receipt_items_td new"
                      >
                        <input
                          type="text"
                          placeholder="0"
                          value={item.unitPrice ? addCommas(item.unitPrice) : ''}
                          maxLength={11}
                          onChange={e =>
                            handleChangeUnit({
                              id: idx,
                              isNew: true,
                              type: UNIT_PRICE,
                              value: Number(e.target.value.replace(/,/g, '')),
                            })
                          }
                          className="createInvoiceModal__receipt_input price"
                        />
                      </Grid>
                      <Grid
                        item
                        container
                        alignItems="center"
                        justifyContent="flex-end"
                        className="createInvoiceModal__receipt_items_td new"
                      >
                        &#65510; {addCommas(item.unitPrice * item.quantity)}
                      </Grid>
                      <Grid
                        item
                        container
                        alignItems="center"
                        justifyContent="flex-end"
                        className="createInvoiceModal__receipt_items_td new"
                      >
                        {/* <IconButton
                          aria-label="cancel modal"
                          onClick={() =>
                            handleModifyUnit({ id: idx, isNew: true, isModify: item.isModify })
                          }
                        >
                          <PencilUnderlineIcon color={color.gray_week} width={15} />
                        </IconButton> */}

                        <IconButton
                          aria-label="cancel modal"
                          onClick={() => handleRemoveUnit({ id: idx, isNew: true })}
                        >
                          <TrashIcon />
                        </IconButton>
                      </Grid>
                    </Grid>
                  ))}
              </Grid>

              <Grid
                container
                alignItems="center"
                justifyContent="flex-end"
                className="createInvoiceModal__receipt_total_price"
              >
                &#65510; {addCommas(totalPrice)}
              </Grid>

              <Grid
                container
                justifyContent="flex-end"
                className="createInvoiceModal__receipt_etc_row"
              >
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                  className="createInvoiceModal__receipt_etc_td"
                >
                  <CustomSpan fontColor={color.blue}>Discount</CustomSpan>
                  <div className="inline-flex-center">
                    <RemoveIcon htmlColor={color.gray_week} fontSize="small" />
                    <input
                      type="text"
                      placeholder="0"
                      maxLength={11}
                      value={discount.value ? addCommas(discount.value) : ''}
                      onChange={e => {
                        const targetValue = Number(e.target.value.replace(/,/g, ''));
                        if (isNaN(targetValue)) return;
                        discount.onChange({ value: targetValue });
                      }}
                      className="createInvoiceModal__receipt_input etc"
                    />
                  </div>
                </Grid>
              </Grid>

              <Grid
                container
                justifyContent="flex-end"
                className="createInvoiceModal__receipt_etc_row"
              >
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                  className="createInvoiceModal__receipt_etc_td"
                >
                  <CustomSpan fontColor={color.blue}>Overdue</CustomSpan>
                  <div className="inline-flex-center">
                    <AddIcon htmlColor={color.gray_week} fontSize="small" />
                    <input
                      type="text"
                      placeholder="0"
                      maxLength={11}
                      value={overdue.value ? addCommas(overdue.value) : ''}
                      onChange={e => {
                        const targetValue = Number(e.target.value.replace(/,/g, ''));
                        if (isNaN(targetValue)) return;
                        overdue.onChange({ value: targetValue });
                      }}
                      className="createInvoiceModal__receipt_input etc"
                    />
                  </div>
                </Grid>
              </Grid>

              <Grid
                container
                alignItems="center"
                justifyContent="flex-end"
                className="createInvoiceModal__receipt_final_price"
              >
                <CustomSpan fontSize={18} fontWeight={500} marginRight={100}>
                  Total
                </CustomSpan>
                <CustomSpan fontSize={21} fontWeight={700}>
                  &#65510; {addCommas(finalPrice)}
                </CustomSpan>
              </Grid>
            </div>
          </div>
        </div>
      </div>

      <StyledPlainButtonOuter backgroundColor={color.navy_blue} height={76} left={'50%'}>
        <MuiButton
          config={{
            width: '320px',
          }}
          disabled={!isValidUnitData}
          disableElevation
          variant="contained"
          onClick={handlePublishProject}
          className="xl border-radius-round inset-shadow-default projectInformation__next_btn"
        >
          {finalPrice ? <> Publish l &#65510; {addCommas(finalPrice)}</> : <>Publish</>}
        </MuiButton>
      </StyledPlainButtonOuter>
    </StyledCreateInvoiceModalContainer>
  );
}

const StyledCreateInvoiceModalContainer = styled.div`
  .createInvoiceModal__top {
    .createInvoiceModal__filter_container {
      display: flex;
      align-items: center;
      column-gap: 30px;

      .createInvoiceModal__filter_label {
        width: 330px;
        font-size: 19px;
        font-weight: 700;
      }

      .createInvoiceModal__filter_box {
        display: flex;
        justify-content: space-between;
        flex-wrap: wrap;

        .createInvoiceModal__partner_select_box {
          width: 155px;
        }

        .datePicker__box {
          margin-left: 15px;
          width: 225px;
          .ant-picker {
            /* border-color: transparent; */
            /* .ant-picker-input > input {
                font-size: 12px;
              } */
          }
        }
      }
    }
  }

  .createInvoiceModal__middle {
    margin-top: 40px;
    margin-bottom: 20px;

    .createInvoiceModal__receipt_container {
      display: flex;
      column-gap: 30px;

      .createInvoiceModal__receipt_info_box {
        width: 330px;
        .createInvoiceModal__receipt_info_card {
          height: 450px;
          padding: 0 30px;
          background-color: ${color.navy_blue};
          border-radius: 10px;
          border-bottom-right-radius: 30px;
          color: white;
          text-align: center;

          > * {
            /* padding: 23px 0 17px; */
            padding: 35px 0;
            min-height: 100px;
            &:not(:last-child) {
              border-bottom: 1px dashed white;
            }
          }
          .createInvoiceModal__receipt_info_card_partner {
            padding: 20px 0 25px;
            border-bottom: 3px solid white;
            min-height: 126px;
            .createInvoiceModal__receipt_info_card_partner_to {
              margin: 0 auto;
              width: 120px;
              height: 30px;
              border-radius: 15px;
              border: 1px solid white;
              font-size: 13px;
            }
          }
          .createInvoiceModal__receipt_info_card_order_code {
          }
          .createInvoiceModal__receipt_info_card_date {
          }
          .createInvoiceModal__receipt_info_card_email {
          }
        }
      }

      .createInvoiceModal__receipt_items_box {
        width: 830px;
        .createInvoiceModal__receipt_items_table {
          .createInvoiceModal__receipt_items_th,
          .createInvoiceModal__receipt_items_td {
            position: relative;
            height: 50px;
            white-space: nowrap;
            overflow-x: overlay;

            &:nth-child(1) {
              width: 28%;
              padding-left: 20px;
            }
            &:nth-child(2) {
              width: 28%;
            }
            &:nth-child(3) {
              width: 10%;
            }
            &:nth-child(4) {
              width: 10%;
            }
            &:nth-child(5) {
              width: 13.5%;
              padding-right: 5px;
            }
            &:nth-child(6) {
              width: 10.5%;
            }

            &.new:nth-child(1) {
              width: 56%;
              padding-left: 20px;
            }
            &.new:nth-child(2) {
              width: 10%;
            }
            &.new:nth-child(3) {
              width: 10%;
            }
            &.new:nth-child(4) {
              width: 13.5%;
              padding-right: 5px;
            }
            &.new:nth-child(5) {
              width: 10.5%;
            }
          }
        }
        .createInvoiceModal__receipt_items_td {
          font-size: 15px;
        }
        .createInvoiceModal__receipt_items_td {
          font-size: 13px;
        }
        .createInvoiceModal__receipt_items_row {
          display: flex;
        }
        .createInvoiceModal__receipt_items_thead,
        .createInvoiceModal__receipt_items_tbody {
          max-height: 357px;
          overflow-y: overlay;
        }
        .createInvoiceModal__receipt_items_thead {
          border-top: 3px solid #edf4fb;
          border-bottom: 3px solid #edf4fb;
        }
        .createInvoiceModal__receipt_items_tbody {
          .createInvoiceModal__receipt_items_row {
            border-bottom: 1px solid #edf4fb;
          }
        }

        .createInvoiceModal__receipt_items_plus_icon_box {
          margin-right: 5px;
          width: 20px;
          height: 20px;
          background-color: ${color.blue};
          border-radius: 50%;
          font-size: 18px;
        }
        .createInvoiceModal__receipt_input {
          width: 100%;
          padding: 5px;
          border: 1px solid transparent;
          font-size: 13px;

          &:read-only {
          }
          &:not(:read-only) {
            border-color: ${color.gray_week};
            border-radius: 5px;
            /* border-bottom-color: ${color.gray_week}; */
            /* padding: 5px 10px; */
          }
          &.project_id {
            width: 85%;
          }
          &.content {
            width: 95%;
            &.new {
              width: 90%;
            }
          }
          &.quantity {
            width: 42px;
            text-align: center;
          }
          &.price {
            width: 68px;
            text-align: right;
          }
          &.etc {
            margin-left: 5px;
            width: 150px;
            text-align: right;
          }
        }

        .createInvoiceModal__receipt_total_price {
          margin-bottom: 15px;
          min-height: 50px;
          font-size: 19px;
          font-weight: 700;
          padding-right: calc(10% + 5px);
          text-align: right;
        }
        .createInvoiceModal__receipt_etc_row {
          .createInvoiceModal__receipt_etc_td {
            position: relative;
            width: 386px;
            min-height: 50px;
            border-top: 1px solid #edf4fb;
            padding-left: 15px;
            padding-right: 88px;
          }
        }
        .createInvoiceModal__receipt_final_price {
          min-height: 50px;
          padding-right: calc(10% + 5px);
          border-top: 3px solid #edf4fb;
        }
      }
    }
  }
`;

export default React.memo(CreateInvoiceModalContainer);
