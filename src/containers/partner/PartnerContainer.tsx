import { Grid, Checkbox, TextField, FormControlLabel } from '@material-ui/core';
import React, { useState, useEffect, useMemo, useCallback, useRef } from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import cx from 'classnames';
import useInput from 'lib/hooks/useInput';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';
import { PartnerActions, AppActions } from 'store/actionCreators';
import CustomMuiCheckbox from 'components/common/checkbox/CustomMuiCheckbox';
import MuiButton from 'components/common/button/MuiButton';
import MuiWrapper from 'components/common/input/MuiWrapper';
import T from 'components/common/text/T';
import { icon_magnifier, icon_round_question } from 'components/base/images';
import CustomSpan from 'components/common/text/CustomSpan';
import PartnerRequestSlick from 'components/partner/PartnerRequestSlick';
import NewPartnerModalContainer from 'containers/partner/NewPartnerModalContainer';
import UnitPriceModalContainer from 'containers/account/UnitPriceModalContainer';
import GoldStatusModalContainer from 'containers/project/GoldStatusModalContainer';

import AppModal from 'components/common/modal/AppModal';
import PlainModal from 'components/common/modal/PlainModal';
import DateConverter from 'components/common/convert/DateConverter';
import { partnerTypeList } from 'lib/mapper';
import { useShallowAppSelector } from 'store/hooks';
import { useDidUpdateEffect } from 'lib/utils';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularLoading from 'components/base/loading/CircularLoading';
import AlertModalContent from 'components/common/modal/contents/AlertModalContent';

function PartnerContainer() {
  const {
    user,
    fetchPartnerList,
    fetchPartnerListSuccess,
    fetchPartnerRequestList,
    fetchPartnerRequestListSuccess,
    fetchPartnerReceiveRequested,
    fetchPartnerReceiveRequestedSuccess,
    fetchReceivedRequestOne,
    fetchReceivedRequestOneSuccess,
    answerReceiveRequestedSuccess,
    answerReceiveRequestedFailure,
    cancelRequestPartnerSuccess,
  } = useShallowAppSelector(state => ({
    user: state.user.user,
    fetchPartnerList: state.partner.partnerList.data,
    fetchPartnerListSuccess: state.partner.partnerList.success,
    fetchPartnerRequestList: state.partner.partnerRequestList.data,
    fetchPartnerRequestListSuccess: state.partner.partnerRequestList.success,
    fetchPartnerReceiveRequested: state.partner.partnerReceiveRequestedList.data,
    fetchPartnerReceiveRequestedSuccess: state.partner.partnerReceiveRequestedList.success,
    fetchReceivedRequestOne: state.partner.partnerReceiveRequestedOne.data,
    fetchReceivedRequestOneSuccess: state.partner.partnerReceiveRequestedOne.success,
    answerReceiveRequestedSuccess: state.partner.answerReceiveRequested.success,
    answerReceiveRequestedFailure: state.partner.answerReceiveRequested.failure,
    cancelRequestPartnerSuccess: state.partner.cancelRequestPartner.success,
  }));

  const partners = fetchPartnerList?.list;
  const partnerListPagingData = fetchPartnerList?.pagingData;
  const hasMorePartnerList = partnerListPagingData?.page < partnerListPagingData?.totalPage;
  const partnerRequestList = fetchPartnerRequestList?.list;
  const receiveRequested = fetchPartnerReceiveRequested?.list;
  const receivedRequestOne = fetchReceivedRequestOne?.list[0];

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalType, setModalType] = useState(null);
  const checkPartner = useCheckSetInput(new Set([]));
  const checkPartnerType = useCheckSetInput(new Set([]));
  const checkAll = useInput(false);

  const receivedRequestGroupCode = useInput('');
  const [prevPartnerStateProp, setPrevPartnerStateProp] = useState<number | null>(null);
  const detailPartnerGroupCode = useInput('');

  const keyword = useInput('');

  const page = useInput(1);
  const partnerRequestListPage = useInput(1);
  const receiveRequestedPage = useInput(1);
  const [partnerListStack, setPartnerListStack] = useState<object[]>([]);

  const majorClassify = useInput('');
  const minorClassify = useInput('');

  const [isSubmitAnswerData, setIsSubmitAnswerData] = useState<object | any>(null);

  const alertOffTheTableRequestPartner = () => {
    AppActions.add_popup({
      isOpen: true,
      isCloseIcon: true,
      width: 660,
      title: '',
      content: (
        <AlertModalContent
          title="Partner request"
          mainText="해당 파트너신청은 유효하지 않습니다."
          subText=""
        />
      ),
      onClick() {
        return;
      },
      onCancel() {
        return;
      },
    });
  };

  let submitPartnerListParams = useMemo(
    () => ({
      keyword: keyword.value,
      page: page.value,
      partnerType: [...checkPartnerType.value]?.join('%'),
    }),
    [page.value, checkPartnerType.value, keyword.value],
  );

  const submitPartnerRequest = {
    page: partnerRequestListPage.value,
  };
  const submitReceiveRequested = {
    page: receiveRequestedPage.value,
  };
  useDidUpdateEffect(() => {
    if (!isModalOpen) {
      PartnerActions.fetch_partner_list_request(submitPartnerListParams);
      PartnerActions.fetch_partner_request_list_request(submitPartnerRequest);
      PartnerActions.fetch_partner_receive_requested_list_request();
    }
  }, [isModalOpen]);

  useDidUpdateEffect(() => {
    if (!cancelRequestPartnerSuccess) {
      PartnerActions.fetch_partner_request_list_request(submitPartnerRequest);
      checkAll.setValue(false);
      checkPartner.setValue(new Set([]));
    }
  }, [cancelRequestPartnerSuccess]);

  useEffect(() => {
    PartnerActions.fetch_partner_list_request(submitPartnerListParams);
    PartnerActions.fetch_partner_request_list_request(submitPartnerRequest);
    PartnerActions.fetch_partner_receive_requested_list_request();
  }, []);

  const handleSearchPartner = () => {
    setPartnerListStack([]);
    page.setValue(1);
    const submitData = {
      keyword: keyword.value,
      page: 1,
      partnerType: [...checkPartnerType.value]?.join('%'),
    };
    PartnerActions.fetch_partner_list_request(submitData);
  };

  const handleCheckPartnerType = (index: number) => {
    checkPartnerType.onChange({ value: index });
    handleSearchPartner();
  };

  const handleOpenModalPopup = (type: string | any, selected: object | any) => {
    // type :: 0 => UnitPrice , 1 => Employee, 2 => Product
    setModalType(type);
    setIsModalOpen(true);
  };

  const handleCheckAll = (value: boolean) => {
    checkPartner.setValue(new Set([]));
    if (value) {
      partnerRequestList.forEach((item: any) => {
        checkPartner.onChange({ value: item.partnershipIdx });
      });
      // checkAll.setValue(false);
    }
    checkAll.setValue(!value);
  };

  const handleCheckStandByPartner = (partnershipCode: number | any) => {
    checkPartner.onChange({ value: partnershipCode });
  };

  useDidUpdateEffect(() => {
    if (partnerRequestList.length === checkPartner.value.size) {
      // console.log('here???????');
      checkAll.setValue(true);
    } else {
      checkAll.setValue(false);
    }
  }, [checkPartner.value, checkAll.value]);

  const handleFetchParterList = () => {
    // setPartnerListStack(draft => [...draft, ...partnerList]);
    page.setValue((draft: number) => draft + 1);
    const submitData = {
      keyword: keyword.value,
      page: page.value + 1,
      partnerType: [...checkPartnerType.value]?.join('%'),
    };
    PartnerActions.fetch_partner_list_request(submitData);
  };

  const handleClosePartnerModal = () => {
    receivedRequestGroupCode.setValue('');
    setIsModalOpen(false);
    majorClassify.setValue('');
    minorClassify.setValue('');
  };

  const handleClickReceiveRequest = (partner: any, answer: any) => {
    // accountType: 1
    // email: "kmlee@doflab.com"
    // enrollDate: 1640847192
    // groupCode: "211217176097XQOHD7"
    // name: "kmlee"
    // partnershipIdx: 78
    // state: 0
    // userGroupIdx: 69

    if (!!answer) {
      // 수락
      setPrevPartnerStateProp(3);
      handleOpenModalPopup('newPartner', {});
      receivedRequestGroupCode.setValue(partner.groupCode);
      detailPartnerGroupCode.setValue('');
      // majorClassify.setValue('request');
      // minorClassify.setValue('received');
    } else {
      // 거절
      const submitData = {
        partnershipIdx: partner.partnershipIdx,
        reqGroupCode: partner.groupCode,
        reqEmail: partner.email,
        state: 2,
        partnerType: partner.value,
        currency: user?.currencyCode,
      };

      // setIsSubmitAnswerData(submitData);
      PartnerActions.answer_receive_requested_request(submitData);

      // PartnerActions.fetch_partner_receive_requested_one_request({
      //   partnershipIdx: partner.partnershipIdx,
      // });

      // PartnerActions.answer_receive_requested_request(submitData);
    }
  };

  const handleCancelRequestPartnerShip = () => {
    // console.log('handleCancelRequestPartnerShip ______________ ', checkPartner.value);
    const submitData = {
      partnershipCodeArr: [...checkPartner.value],
    };
    // const submitData = {
    //   partnershipIdxArr: [...checkPartner.value],
    // };
    PartnerActions.cancel_request_partnership_request(submitData);
  };

  useDidUpdateEffect(() => {
    if (answerReceiveRequestedSuccess) {
      // PartnerActions.fetch_partner_receive_requested_request(submitReceiveRequested);
      PartnerActions.fetch_partner_receive_requested_list_request();
    }
  }, [!!answerReceiveRequestedSuccess]);

  useDidUpdateEffect(() => {
    if (answerReceiveRequestedFailure) {
      alertOffTheTableRequestPartner();
      PartnerActions.fetch_partner_receive_requested_list_request();
    }
  }, [answerReceiveRequestedFailure]);

  useDidUpdateEffect(() => {
    if (fetchPartnerListSuccess) {
      if (page.value === 1) {
        setPartnerListStack(partners);
        // setPartnerListStack(testPartnerList);
      } else {
        setPartnerListStack(draft => [...draft, ...partners]);
        // setPartnerListStack(draft => [...draft, ...testPartnerList]);
      }
    }
  }, [!!fetchPartnerListSuccess]);

  const modalList = [
    // {
    //   type: 'unitPrice',
    //   title: 'Unit Price',
    //   component: <UnitPriceModalContainer modifyUnitPriceKeyCode={''} />,
    //   width: 1160,
    //   padding: '0 0 28px',
    //   backgroundColor: 'transparent',
    // },
    {
      type: 'newPartner',
      title: 'New Partner',
      component: (
        <NewPartnerModalContainer
          major={majorClassify}
          minor={minorClassify}
          prevPartnerStateProp={prevPartnerStateProp}
          detailPartnerGroupCode={detailPartnerGroupCode}
          receivedRequestGroupCode={receivedRequestGroupCode.value}
          onClosePartnerModal={handleClosePartnerModal}
          // alertOffTheTableRequestPartner={alertOffTheTableRequestPartner}
        />
      ),
      width: 'auto',
      padding: 0,
      backgroundColor: 'transparent',
    },
    {
      type: 'goldStatus',
      title: 'Gold Status',
      component: <GoldStatusModalContainer />,
      width: 1280,
      padding: '30px 35px 25px',
      borderRadius: '8px',
      headerCenterText: {
        text: 'Dof_project_123(project name)',
        width: 325,
      },
    },
  ];

  return (
    <StyledPartner data-component-name="Partner">
      {useMemo(() => {
        const findData = modalList.find(item => item.type === modalType);
        return (
          <PlainModal
            isOpen={isModalOpen}
            onClose={handleClosePartnerModal}
            width={findData?.width}
          >
            <AppModal
              title={findData?.title}
              content={findData?.component}
              headerCenterText={findData?.headerCenterText?.text}
              headerCenterTextStyle={{ width: findData?.headerCenterText?.width }}
              contentCardStyle={{
                padding: findData?.padding,
                borderRadius: findData?.borderRadius,
                backgroundColor: findData?.backgroundColor,
              }}
              isCloseIcon={true}
              onClick={handleClosePartnerModal}
              onCancel={handleClosePartnerModal}
              hideButton={true}
            />
          </PlainModal>
        );
        // }, [isModalOpen, modalType, majorClassify.value, minorClassify.value])}
      }, [isModalOpen, modalType])}
      <h1 className="sr-only">Patner</h1>
      <Grid container className="partner__container">
        <Grid item className="partner__received_list_wrapper">
          {useMemo(
            () => (
              <section>
                <h1 className="partner__content_title received_partner">
                  <CustomSpan fontSize={25} fontWeight={700} fontColor="#00A4E3">
                    <T>Received partner request</T>
                  </CustomSpan>
                </h1>
                <CustomSpan fontSize={12} fontWeight={400}>
                  <T>신규 파트너 요청을 수락해주세요.</T>
                </CustomSpan>
                <div className="partner__request_list_wrapper">
                  {receiveRequested?.length > 0 ? (
                    <PartnerRequestSlick
                      receiveRequest={receiveRequested}
                      onClickPartnerRequest={handleClickReceiveRequest}
                    />
                  ) : (
                    <div className="received_partner_is_empty">
                      <div className="received_partner_is_empty_image"></div>
                      <div className="received_partner_is_empty_text">
                        <T>{'Work on various projects \nwith your new partner.'}</T>
                      </div>
                    </div>
                  )}
                </div>
              </section>
            ),
            [receiveRequested],
          )}
        </Grid>
        <Grid item className="partner__contacts_wrapper">
          <section>
            <h1 className="partner__contacts_title contacts">
              <CustomSpan fontSize={25} fontWeight={700} fontColor="#00A4E3">
                <T>Sent partner request</T>
              </CustomSpan>
            </h1>

            <div className="partner__contacts_list_wrapper">
              <div className="partner__contacts_button_box">
                {checkPartner.value.size > 0 && (
                  <MuiButton
                    className="partner_delete_button"
                    disableElevation
                    onClick={handleCancelRequestPartnerShip}
                  >
                    <CustomSpan fontSize={15} fontWeight={200} fontColor="#B5B7C1">
                      <T>X Request Cancel</T>
                    </CustomSpan>
                  </MuiButton>
                )}
                <MuiButton
                  className="add_partner_button"
                  variant="contained"
                  disableElevation
                  onClick={() => {
                    handleOpenModalPopup('newPartner', {});
                    detailPartnerGroupCode.setValue('');
                    majorClassify.setValue('search');
                    minorClassify.setValue('default');
                  }}
                >
                  <CustomSpan fontSize={13} fontWeight={500}>
                    <T>+ Partner</T>
                  </CustomSpan>
                </MuiButton>
              </div>
              <div className="partner__contacts_list">
                <div className="partner__contacts_table">
                  <div className="partner__contacts_table_head">
                    <Grid container className="partner__contacts_table_row">
                      <Grid item className="contacts_table_row_item">
                        <Checkbox
                          color="primary"
                          // disabled={true}
                          checked={checkAll.value}
                          value={checkAll.value}
                          icon={<div className="custom_checkbox"></div>}
                          onChange={() => {
                            handleCheckAll(!checkAll.value);
                            // checkAll.setValue(!checkAll.value);
                          }}
                        />
                      </Grid>
                      <Grid item className="contacts_table_row_item">
                        <CustomSpan fontSize={15} fontWeight={200} fontColor="#B5B7C1">
                          <T>No.</T>
                        </CustomSpan>
                      </Grid>
                      <Grid item className="contacts_table_row_item">
                        <T>Type</T>
                      </Grid>
                      <Grid item className="contacts_table_row_item">
                        <T>Partner Name</T>
                      </Grid>

                      <Grid item className="contacts_table_row_item">
                        <T>Request Date</T>
                      </Grid>
                    </Grid>
                  </div>

                  {useMemo(
                    () => (
                      <div className="partner__contacts_table_body_wrapper">
                        {partnerRequestList?.length > 0 ? (
                          <div className="partner__contacts_table_body">
                            {partnerRequestList.map((item: any, index: number) => (
                              <Grid
                                container
                                className="partner__contacts_table_row"
                                key={index}
                                onClick={e => {
                                  // handleCheckStandByPartner(item.partnershipIdx);
                                  handleCheckStandByPartner(item.partnershipCode);
                                }}
                              >
                                <Grid item className="contacts_table_row_item">
                                  <MuiWrapper>
                                    <Checkbox
                                      // checked={checkPartner?.value?.has(item.partnershipIdx)}
                                      checked={checkPartner?.value?.has(item.partnershipCode)}
                                      // value={item.partnershipIdx}
                                      color="primary"
                                      icon={<div className="custom_checkbox"></div>}
                                      onChange={e => {
                                        // e.stopPropagation();
                                        // e.preventDefault();
                                        // handleCheckStandByPartner(item.partnershipIdx);
                                      }}
                                      onClick={e => {
                                        // e.stopPropagation();
                                      }}
                                    />
                                  </MuiWrapper>
                                </Grid>
                                <Grid item className="contacts_table_row_item">
                                  <CustomSpan fontSize={15} fontColor="#B5B7C1">
                                    {index + 1}
                                  </CustomSpan>
                                </Grid>
                                <Grid item className="contacts_table_row_item ">
                                  {partnerTypeList.find(i => i.id === item.partnerType)?.text}
                                </Grid>
                                <Grid container item className="contacts_table_row_item ">
                                  <Grid item className="under_line">
                                    {item.name}
                                  </Grid>
                                  {/* <Grid item className="request_status">
                                    <img
                                      className="request_status_icon"
                                      src={icon_round_question}
                                    />
                                    Waiting
                                  </Grid> */}
                                </Grid>

                                <Grid item className="contacts_table_row_item">
                                  <CustomSpan fontSize={15} fontColor="#b5b7c1">
                                    <DateConverter
                                      timestamp={item.enrollDate}
                                      format="MMM.DD.YYYY"
                                    />
                                  </CustomSpan>
                                </Grid>
                              </Grid>
                            ))}
                          </div>
                        ) : (
                          <div className="partner__contacts_not_exist_partner_box">
                            <div className="partner__contacts_not_exist_image_box"></div>
                            <div className="partner__contacts_not_exist_text_box">
                              <div className="partner__contacts_not_exist_text">
                                <p>
                                  <CustomSpan fontSize={26} fontWeight={500} fontColor="#17288A">
                                    Maximize your profits
                                  </CustomSpan>
                                </p>
                                <p>
                                  <CustomSpan
                                    fontStyle="italic"
                                    fontSize={22}
                                    fontWeight={200}
                                    fontColor="#17288A"
                                  >
                                    with
                                  </CustomSpan>
                                  <CustomSpan fontSize={26} fontWeight={500} fontColor="#17288A">
                                    {' '}
                                    various partners.
                                  </CustomSpan>
                                </p>
                              </div>
                              <MuiButton
                                className="not_exist_add_partner_button"
                                variant="contained"
                                disableElevation
                                onClick={() => {
                                  handleOpenModalPopup('newPartner', {});
                                  detailPartnerGroupCode.setValue('');
                                  majorClassify.setValue('write');
                                  minorClassify.setValue('new');
                                }}
                              >
                                <CustomSpan fontSize={16} fontWeight={800}>
                                  {'+ Partner >'}
                                </CustomSpan>
                              </MuiButton>
                            </div>
                          </div>
                        )}
                      </div>
                    ),
                    [partnerRequestList, checkPartner.value, checkAll.value],
                  )}
                </div>
              </div>
            </div>
          </section>
        </Grid>
        <Grid item xs={12} className="partner__list_wrapper">
          <section>
            <h1 className="partner__content_title sr-only">
              <T>Partner List</T>
            </h1>
            <div className="partner__list_search_options">
              <div className="partner__list_search_option_checkBox">
                {partnerTypeList.map((item, index) => (
                  <FormControlLabel
                    key={index}
                    className="checkbox_control_label"
                    control={
                      <Checkbox
                        checked={checkPartnerType.value.has(index)}
                        onChange={() => {
                          handleCheckPartnerType(index);
                        }}
                        className="checkbox_control_checkbox"
                        name={item.text}
                        color="primary"
                        icon={<div className="custom_checkbox"></div>}
                      />
                    }
                    label={
                      <CustomSpan fontSize={13} fontWeight={400}>
                        {item.text}
                      </CustomSpan>
                    }
                  />
                ))}
              </div>

              {useMemo(
                () => (
                  <MuiWrapper
                    className="partner__list_search_options_searchBar"
                    config={{
                      borderColor: 'transparent',
                      activeBorderColor: 'transparent',
                      hoverBorderColor: 'transparent',
                    }}
                  >
                    <>
                      <TextField
                        className="radius-md"
                        variant="outlined"
                        fullWidth
                        placeholder="Step, Project ID, Project Name, Partner"
                        value={keyword.value || ''}
                        onChange={keyword.onChange}
                        onKeyPress={e => e.key === 'Enter' && handleSearchPartner()}
                      />
                      <button
                        className="btn-reset partner__list_search_btn"
                        onClick={handleSearchPartner}
                      >
                        <img src={icon_magnifier} alt="search" />
                      </button>
                    </>
                  </MuiWrapper>
                ),
                [keyword.value],
              )}
            </div>
            <div className="partner__list_table">
              <div className="partner__list_head">
                <Grid container className="partner__list_row">
                  <Grid item className="partner__list_row_item">
                    <span className="sr-only">no</span>
                  </Grid>
                  <Grid item className="partner__list_row_item">
                    <span className="sr-only">partner image</span>
                  </Grid>
                  <Grid item className="partner__list_row_item">
                    <span className="sr-only">sync type</span>
                  </Grid>
                  <Grid item className="partner__list_row_item">
                    <T>Nick Name</T>
                  </Grid>
                  <Grid item className="partner__list_row_item">
                    <T>Sync ID</T>
                  </Grid>
                  <Grid item className="partner__list_row_item">
                    <T>Type</T>
                  </Grid>
                  <Grid item className="partner__list_row_item alignCenter">
                    <T>Gold Hold</T>
                  </Grid>
                  <Grid item className="partner__list_row_item alignCenter">
                    <T>Unit Price</T>
                  </Grid>
                  <Grid item className="partner__list_row_item">
                    <T>Modified Date</T>
                  </Grid>
                </Grid>
              </div>
              {useMemo(
                () => (
                  <div className="partner__list_body_wrapper">
                    <InfiniteScroll
                      className="partner__list_body"
                      dataLength={partnerListStack?.length}
                      next={handleFetchParterList}
                      hasMore={hasMorePartnerList}
                      loader={
                        <div className="infinite-scroll-loading">
                          <CircularLoading />
                        </div>
                      }
                      height={526}
                      scrollThreshold={0.95}
                    >
                      {partnerListStack?.map((item: any, index: number) => {
                        return (
                          <Grid container className="partner__list_row" key={index}>
                            <Grid item className="partner__list_row_item">
                              {index + 1}
                            </Grid>
                            <Grid item className="partner__list_row_item">
                              <img
                                className="partner__image"
                                // src={item.profileImg}
                              />
                            </Grid>
                            <Grid item className="partner__list_row_item ">
                              <CustomSpan fontSize={13} fontWeigth={400} fontColor="#00A4E3">
                                {/* 0 : 회사, 1 : 개인회원가입, 2 : 직접추가 */}
                                {item.accountType === 2 ? `Personal` : `Sync`}
                              </CustomSpan>
                            </Grid>
                            <Grid
                              item
                              className="partner__list_row_item under_line cursor_pointer"
                              onClick={() => {
                                handleOpenModalPopup('newPartner', {});
                                setPrevPartnerStateProp(1);
                                detailPartnerGroupCode.setValue(item.groupCode);
                                majorClassify.setValue('input');
                                minorClassify.setValue('detail');
                              }}
                            >
                              {item.name}
                            </Grid>
                            <Grid
                              item
                              className="partner__list_row_item cursor_pointer"
                              onClick={() => {
                                handleOpenModalPopup('newPartner', {});
                                detailPartnerGroupCode.setValue(item.groupCode);
                                majorClassify.setValue('input');
                                minorClassify.setValue('detail');
                              }}
                            >
                              {item.email}
                            </Grid>
                            <Grid item className="partner__list_row_item">
                              {partnerTypeList.find(i => i.id === item.partnerType)?.text}
                            </Grid>
                            <Grid item className="partner__list_row_item alignCenter">
                              <MuiWrapper className="row_item_btn_wrapper">
                                <MuiButton
                                  className="row_item_btn"
                                  variant="outlined"
                                  color="default"
                                  disableElevation
                                  onClick={() => handleOpenModalPopup('goldStatus', {})}
                                >
                                  <CustomSpan fontSize={15} fontWeight={300}>
                                    Modify
                                  </CustomSpan>
                                </MuiButton>
                              </MuiWrapper>
                            </Grid>
                            <Grid item className="partner__list_row_item alignCenter">
                              <MuiWrapper className="row_item_btn_wrapper">
                                <MuiButton
                                  className="row_item_btn"
                                  variant="outlined"
                                  color="default"
                                  disableElevation
                                  onClick={() => handleOpenModalPopup('unitPrice', {})}
                                >
                                  <CustomSpan fontSize={15} fontWeight={300}>
                                    Modify
                                  </CustomSpan>
                                </MuiButton>
                              </MuiWrapper>
                            </Grid>
                            <Grid item className="partner__list_row_item">
                              <DateConverter timestamp={item.modifyDate} format="MMM.DD.YYYY" />
                            </Grid>
                          </Grid>
                        );
                      })}
                    </InfiniteScroll>
                  </div>
                ),
                [partnerListStack],
              )}
            </div>
          </section>
        </Grid>
      </Grid>
    </StyledPartner>
  );
}

const StyledPartner = styled.section<{}>`
  .under_line {
    text-decoration: underline;
  }
  .cursor_pointer {
    &:hover {
      cursor: pointer;
    }
  }
  .custom_checkbox {
    width: 20px;
    height: 20px;
    border: 1px solid #e5e7ed;
    border-radius: 4px;
  }
  .partner__container {
    justify-content: space-between;
    row-gap: 60px;
    .partner__contacts_title {
      &.contacts {
        margin-left: 23px;
      }
    }
    .partner__received_list_wrapper {
      width: 524px;
      height: 510px;
      border-radius: 15px;
      box-shadow: 0px 0px 6px rgb(0 0 0 / 16%);
      padding: 20px 30px 40px;
      .partner__content_title {
        margin-bottom: 20px;
      }
      .partner__request_list_wrapper {
        width: 100%;
        padding: 0 27px;
        height: 350px;
        margin-top: 35px;
        .received_partner_is_empty {
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: 20px;
          /* justify-content: center; */
          .received_partner_is_empty_image {
            width: 210px;
            height: 210px;
            border: 1px solid #b5b7c1;
          }
          .received_partner_is_empty_text {
            margin-top: 55px;
            text-align: center;
            color: #b5b7c1;
            line-height: 29px;
            font-size: 19px;
            font-style: italic;
          }
        }
      }
    }
    .partner__contacts_wrapper {
      width: 1048px;
      height: 510px;
      border-radius: 15px;
      box-shadow: 0px 0px 6px rgb(0 0 0 / 16%);
      padding: 20px 20px 0 12px;
      .partner__contacts_list_wrapper {
        position: relative;
        height: 450px;
        .partner__contacts_button_box {
          position: absolute;
          top: -35px;
          right: 0;
          z-index: 1;
          .partner_delete_button {
            display: inline-flex;
            justify-content: center;
            align-items: center;
            width: 178px;
            height: 40px;
            border-radius: 20px;
          }
          .add_partner_button {
            width: 178px;
            height: 40px;
            border-radius: 20px;
            background-color: #00a4e3;
            box-shadow: inset 3px 3px 6px rgb(0 0 0 / 16%);
          }
        }

        .partner__contacts_list {
          position: absolute;
          top: 0;
          left: 0;
          z-index: 10;
          width: 100%;
          background-color: #ffffff;
          margin-top: 20px;
          .partner__contacts_table {
            height: 100%;
            .partner__contacts_table_head {
              width: 100%;
              height: 40px;
              border-radius: 5px;
              background-color: #edf4fb;
              /* padding-right: 11px; */
              .partner__contacts_table_row {
                font-weight: 500;
                height: 40px;
                font-size: 15px;
              }
            }
            .partner__contacts_table_body_wrapper {
              overflow-y: overlay;
              background: white;
              padding-right: 16px;
              margin-right: -16px;
              height: 390px;

              position: relative;
              .partner__contacts_not_exist_partner_box {
                /* padding: 40px 0 0 313px; */
                /* margin: 40px 156px 0 0; */
                margin-top: 40px;
                margin-left: 310px;
                width: 550px;
                height: 295px;
                /* background-color: red; */
                /* width: 100%; */
                /* height: 100%; */
                position: relative;
                display: flex;
                justify-content: flex-end;
                .partner__contacts_not_exist_image_box {
                  position: absolute;
                  top: 0;
                  left: 0;
                  z-index: 10;
                  width: 274px;
                  height: 274px;
                  border: 1px solid #707070;
                  background-color: #ffffff;
                }
                .partner__contacts_not_exist_text_box {
                  position: absolute;
                  right: 0;
                  bottom: 0;
                  width: 340px;
                  height: 140px;
                  z-index: 5;
                  .partner__contacts_not_exist_text {
                    margin-bottom: 24px;
                    p {
                      line-height: 34px;
                      text-align: right;
                    }
                  }
                  .not_exist_add_partner_button {
                    width: 214px;
                    height: 40px;
                    border-radius: 20px;
                    background-color: ${color.navy_blue};
                  }
                }
              }
              .partner__contacts_table_body {
                font-size: 16px;
                width: 100%;
                height: 100%;
                /* padding-right: 11px; */

                .partner__contacts_table_row {
                  height: 58px;
                  border-bottom: 1px solid #edf4fb;
                  &:last-child {
                    border-bottom: none;
                  }
                }
              }
            }
            .partner__contacts_table_row {
              width: 100%;
              align-items: center;
              .contacts_table_row_item {
                font-size: 15px;
                font-weight: 400;
                &:nth-child(1) {
                  font-weight: 200;
                  width: 6%;
                  text-align: center;
                }
                &:nth-child(2) {
                  width: 7%;
                }
                &:nth-child(3) {
                  width: 16%;
                }

                &:nth-child(4) {
                  width: 54%;
                  justify-content: space-between;
                  .request_status {
                    color: #b5b7c1;
                    display: flex;
                    align-items: center;
                    margin-right: 50px;
                    .request_status_icon {
                      margin-right: 10px;
                    }
                  }
                }
                &:nth-child(5) {
                  width: 17%;
                }
              }
            }
          }
        }
      }
    }
    .partner__list_wrapper {
      padding-top: 40px;
      padding-bottom: 120px;
      border-top: 5px solid #f4f5fa;
      width: 100%;
      .partner__list_search_options {
        display: flex;
        align-items: center;
        column-gap: 20px;
        .partner__list_search_option_checkBox {
          border-radius: 5px;
          display: flex;
          align-items: center;
          padding: 0 30px;
          background-color: #f4f5fa;
          .checkbox_control_label {
            /* width: 42px; */
            margin-right: 20px;
            &:last-child {
              margin-right: 0;
            }
            .checkbox_control_checkbox {
              width: 42px;
              height: 42px;
            }
          }
        }
        .partner__list_search_options_datePicker {
          width: 272px;
        }
        .partner__list_search_options_searchBar {
          width: 550px;
          height: 40px;
          position: relative;
          .MuiInputBase-root {
            background-color: #f4f5fa;
          }
          .partner__list_search_btn {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            right: 0;
            top: 0;
            width: 40px;
            height: 40px;
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
            background-color: ${color.navy_blue};
          }
        }
      }
      .partner__list_table {
        margin-top: 25px;
        width: 100%;

        .partner__list_head {
          border-radius: 10px 10px 0 0;
          box-shadow: inset 0 3px 3px rgb(0 0 0 / 16%);
          padding-bottom: 10px;
          margin-bottom: -10px;
          background-color: #17288a;
          .partner__list_row {
            height: 58px;
            .partner__list_row_item {
              font-size: 20px;
              color: #ffffff;
              font-weight: 400;
            }
          }
        }
        .partner__list_body_wrapper {
          background-color: #ffffff;
          padding: 17px 0;
          box-shadow: 0 0 10px rgb(0 0 0 / 16%);
          border-radius: 10px;
          .partner__list_body {
            /* width: 100%; */
            height: 526px;
            overflow-y: overlay;

            .partner__list_row {
              border-bottom: 1px solid #e7e8f2;
              padding: 20px 0;
              position: relative;
              &:nth-child(1) {
                padding: 5px 0 20px 0;
              }
              &:last-child {
                padding: 20px 0 5px 0;
                border-bottom: none;
              }
              .partner__list_row_item {
                font-size: 16px;
                color: #303030;
                font-weight: 400;
              }
            }
          }
        }

        .partner__list_row {
          align-items: center;

          .partner__list_row_item {
            display: flex;
            align-items: center;
            &.alignCenter {
              justify-content: center;
            }
            .partner__image {
              width: 70px;
              height: 70px;
              border-radius: 5px;
              background-color: #e8e8e8;
            }
            .row_item_btn_wrapper {
              display: flex;
              justify-content: center;
              align-items: center;
              .row_item_btn {
                width: 140px;
                height: 30px;
                border-radius: 18px;
                &:hover {
                  background-color: #ffffff;
                  border: 1px solid ${color.blue};
                  color: ${color.blue};
                }
              }
            }
            &:nth-child(1) {
              width: 80px;
              padding-left: 50px;
              justify-content: center;
            }
            &:nth-child(2) {
              width: 100px;
              /* padding-right: 5px; */
              justify-content: center;
            }
            &:nth-child(3) {
              width: 70px;
              justify-content: center;
            }
            &:nth-child(4) {
              width: 200px;
            }
            &:nth-child(5) {
              width: 300px;
            }
            &:nth-child(6) {
              width: 250px;
            }
            &:nth-child(7) {
              width: 200px;
            }
            &:nth-child(8) {
              width: 200px;
            }
            &:nth-child(9) {
              /* width: 194px; */
              width: 178px;
            }
          }
        }
      }
    }
  }
`;

export default React.memo(PartnerContainer);
