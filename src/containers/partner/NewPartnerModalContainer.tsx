import React, { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { Grid, TextField } from '@material-ui/core';
import styled, { css } from 'styled-components';
import { color } from 'styles/utils';
import cx from 'classnames';
import useInput from 'lib/hooks/useInput';
import { useDidUpdateEffect } from 'lib/utils';

import T from 'components/common/text/T';
import PartnerModalRequest from 'components/partner/PartnerModalRequest';
import PartnerModalSearch from 'components/partner/PartnerModalSearch';
import PartnerModalInput from 'components/partner/PartnerModalInput';
import AlertModalContent from 'components/common/modal/contents/AlertModalContent';

import useFileInput from 'lib/hooks/useFileInput';
import {
  icon_magnifier,
  icon_round_exclamation,
  icon_round_question,
  find_magnifier,
  note_pencil_in_circle,
  find_magnifier_circle,
} from 'components/base/images';

import { useShallowAppSelector } from 'store/hooks';
import { PartnerActions, AppActions, UtilActions } from 'store/actionCreators';

import MuiWrapper from 'components/common/input/MuiWrapper';
import CustomSpan from 'components/common/text/CustomSpan';

interface ParternModalProps {
  detailPartnerGroupCode?: {
    value: string | null;
    onChange: (e: any) => void;
    setValue: (value: string) => void;
  };
  minor?: {
    value: string | null;
    onChange: (e: any) => void;
    setValue: (value: string) => void;
  };
  major?: {
    value: string | null;
    onChange: (e: any) => void;
    setValue: (value: string) => void;
  };

  receivedRequestGroupCode?: number | null;
  prevPartnerStateProp?: number | null;
  onClosePartnerModal: () => void;
}

/**
 * @param {ParternModalProps} { selectedPartner }
 * @return {*}
 */
function NewPartnerModalContainer({
  major,
  minor,
  detailPartnerGroupCode,
  receivedRequestGroupCode,
  prevPartnerStateProp,
  onClosePartnerModal,
}: ParternModalProps) {
  const {
    user,
    fetchPartnerSearch,
    fetchPartnerSearchSuccess,
    fetchPartnerDetail,
    fetchPartnerDetailSuccess,
    registerNewParterSuccess,
    registerNewMenualParter,
    registerNewMenualParterSuccess,
    answerReceiveRequestedSuccess,
    answerReceiveRequestedFailure,
    editPartnerInfoSuccess,
    deletePartnerSuccess,
    fetchPartnerCodeSearch,
    fetchPartnerCodeSearchSuccess,
    fetchCountryList,
    fetchRegionList,
    fetchCurrencyList,
  } = useShallowAppSelector(state => ({
    user: state.user.user,
    fetchPartnerSearch: state.partner.partnerSearch.data,
    fetchPartnerSearchSuccess: state.partner.partnerSearch.success,
    fetchPartnerDetail: state.partner.partnerDetail.data,
    fetchPartnerDetailSuccess: state.partner.partnerDetail.success,
    registerNewParterSuccess: state.partner.newPartner.success,
    registerNewMenualParter: state.partner.newMenualPartner.data,
    registerNewMenualParterSuccess: state.partner.newMenualPartner.success,
    answerReceiveRequestedSuccess: state.partner.answerReceiveRequested.success,
    answerReceiveRequestedFailure: state.partner.answerReceiveRequested.failure,
    editPartnerInfoSuccess: state.partner.editPartnerInfo.success,
    deletePartnerSuccess: state.partner.deletePartner.success,
    fetchPartnerCodeSearch: state.partner.partnerCodeSearch.data,
    fetchPartnerCodeSearchSuccess: state.partner.partnerCodeSearch.success,
    fetchCountryList: state.util.countryList.data,
    fetchRegionList: state.util.regionList.data,
    fetchCurrencyList: state.util.currencyList.data,
  }));

  const currencyList = fetchCurrencyList?.currencyList;

  const partnerSearchList = fetchPartnerSearch?.list;
  const partnerSearchListPagingData = partnerSearchList?.pagingData;
  const hasMorePartnerSearchList =
    partnerSearchListPagingData?.page < partnerSearchListPagingData?.totalPage;
  const searchPage = useInput(1);
  const partnerDetail = fetchPartnerDetail?.partnerInfo;

  const countryList = fetchCountryList?.countryList;
  const regionList = fetchRegionList?.regionList;

  const partnerCodeSearch = fetchPartnerCodeSearch?.userInfo;
  const newMenualPartnerGroupIdx = registerNewMenualParter?.manualPartnerInfo.groupCode;

  const [partnerSearchListStack, setPartnerSearchListStack] = useState<object[]>([]);

  const modalWidth = useInput(0);
  const modalHeight = useInput(0);
  const paddingBottom = useInput(0);

  const [isAcceptPartner, setIsAcceptPartner] = useState(false);
  const keyword = useInput('');
  const prevKeyword = useInput('');
  const partnerCurrency = useInput('');
  const partnerType = useInput('');

  // partner data list
  const userGroupIdx = useInput('');
  const nickName = useInput('');
  const type = useInput('');
  const phone = useInput('');
  const phoneCode = useInput('');
  const email = useInput('');
  const fax = useInput('');
  const tel = useInput('');
  const address = useInput('');
  const currency = useInput('');
  const accountType = useInput('');
  const partnerShipIdx = useInput('');
  const counrty = useInput('');
  const region = useInput('');

  const partnerDataList = {
    userGroupIdx,
    nickName,
    type,
    phone,
    phoneCode,
    email,
    fax,
    tel,
    address,
    counrty,
    currency,
    accountType,
    region,
  };

  const profileFileRef = useRef<null | any>(null);
  const [profileFilePreview, setProfileFilePreview] = useState<object | any>(null);
  const profileFile = useFileInput({
    file: null,
    name: '',
  });
  const [isDeleteProfileImg, setIsDeleteProfileImg] = useState(false);
  const deleteProfileImg = useInput('');

  const majorClassify = useInput('');
  const minorClassify = useInput('');

  const alreadyPartner = useInput(0);
  const receivedRequest = useInput(0);
  const selectedPartnerData = useInput('');

  const prevPartnerState = useInput(null);
  const [isSubmitAnswerData, setIsSubmitAnswerData] = useState<object | any>(null);

  const isSearchValue = useInput(true);
  const [isMenualUser, setIsMenualUser] = useState(false);

  useEffect(() => {
    majorClassify.setValue(major?.value);
    minorClassify.setValue(minor?.value);
    UtilActions.fetch_country_list_request();
    UtilActions.fetch_currency_list_request();
  }, []);

  const classifyList = [
    {
      main: 'search',
      sub: [
        { value: 'default', modalStyle: { width: 550, height: 590, padding: 0 } },
        { value: 'exist', modalStyle: { width: 550, height: 590, padding: 0 } },
        { value: 'empty', modalStyle: { width: 550, height: 590, padding: 28 } },
      ],
    },
    {
      main: 'request',
      sub: [
        { value: 'received', modalStyle: { width: 550, height: 428, padding: 28 } },
        { value: 'waiting', modalStyle: { width: 550, height: 428, padding: 28 } },
        { value: 'new', modalStyle: { width: 550, height: 428, padding: 28 } },
      ],
    },

    {
      main: 'input',
      sub: [
        { value: 'detail', modalStyle: { width: 550, height: 590, padding: 28 } },
        { value: 'new', modalStyle: { width: 957, height: 590, padding: 28 } },
        { value: 'edit', modalStyle: { width: 957, height: 590, padding: 28 } },
      ],
    },
  ];

  const accountTypeList = [
    { id: 0, type: 'group' },
    { id: 1, type: 'private' },
    { id: 2, type: 'manual' },
  ];

  const partnerShipState = [
    { state: 0, value: '', text: 'normal', icon: '' },
    { state: 1, value: 'Partner', text: 'partner', icon: '' },
    { state: 2, value: 'Rejected', text: 'rejected', icon: icon_round_exclamation },
    { state: 3, value: 'Received', text: 'received', icon: '' },
    { state: 4, value: 'Waiting', text: 'waiting', icon: icon_round_question },
  ];

  const noticeList = [
    {
      isMenualUser: false,
      title: 'Partner disconnect',
      mainText: '파트너 관계를 끊겠습니까?',
      subText:
        '파트너 끊기를 하여도 상대측에 알림이 가지 않습니다.\n다만, 이후 해당 파트너와 프로젝트 작업을 진행하실 수 없습니다.\n파트너 끊기를 하여도 상대측에 알림이 가지 않습니다.',
    },
    {
      isMenualUser: true,
      title: 'Partner disconnect',
      mainText: '파트너 정보를 삭제하시겠습니까?',
      subText: '해당 정보는 [OK] 버튼 클릭시 영구 삭제됩니다.',
    },
  ];

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

  const alertDisconnectPartner = (targetData: any) => {
    AppActions.add_popup({
      isOpen: true,
      isCloseIcon: true,
      width: 570,
      title: '',
      content: (
        <AlertModalContent
          title={noticeList.find(i => i.isMenualUser === targetData.isMenual)?.title}
          mainText={noticeList.find(i => i.isMenualUser === targetData.isMenual)?.mainText}
          subText={noticeList.find(i => i.isMenualUser === targetData.isMenual)?.subText}
        />
      ),
      onClick() {
        const submitData = {
          accountType: targetData.accountType,
          partnershipIdx: targetData.partnershipIdx,
          userGroupIdx: targetData.userGroupIdx,
        };
        PartnerActions.delete_partner_request(submitData);
      },
      onCancel() {
        return;
      },
    });
  };

  useDidUpdateEffect(() => {
    if (fetchPartnerSearchSuccess) {
      if (searchPage.value === 1) {
        setPartnerSearchListStack(partnerSearchList);
        // setPartnerListStack(testPartnerList);
      } else {
        setPartnerSearchListStack(draft => [...draft, ...partnerSearchList]);
        // setPartnerListStack(draft => [...draft, ...testPartnerList]);
      }
    }
  }, [!!fetchPartnerSearchSuccess]);

  useEffect(() => {
    if (!!majorClassify.value && !!minorClassify.value) {
      const classifiedStyle = classifyList
        .find(i => i.main === majorClassify.value)
        ?.sub.find(i => i.value === minorClassify.value)?.modalStyle;
      modalWidth.setValue(classifiedStyle?.width);
      // modalHeight.setValue(classifiedStyle?.height);
      paddingBottom.setValue(classifiedStyle?.padding);
    }
  }, [majorClassify.value, minorClassify.value]);

  useEffect(() => {
    if (!!detailPartnerGroupCode?.value) {
      // 파트너리스트에서 선택해서 진입한 경우,
      alreadyPartner.setValue(detailPartnerGroupCode.value);
    }
  }, [detailPartnerGroupCode?.value]);

  useDidUpdateEffect(() => {
    if (fetchPartnerSearchSuccess) {
      if (partnerSearchList?.length > 0) {
        majorClassify.setValue('search');
        minorClassify.setValue('exist');
      } else {
        majorClassify.setValue('search');
        minorClassify.setValue('empty');
      }
    }
  }, [fetchPartnerSearchSuccess]);

  useEffect(() => {
    if (!!receivedRequestGroupCode && !!prevPartnerStateProp) {
      // received request 수락 클릭
      receivedRequest.setValue(receivedRequestGroupCode);
      prevPartnerState.setValue(prevPartnerStateProp);
      isSearchValue.setValue(false);
      majorClassify.setValue('request');
      minorClassify.setValue('received');
    }
  }, [receivedRequestGroupCode]);

  useDidUpdateEffect(() => {
    if (!!receivedRequest.value) {
      // 요청받은 파트너쉽idx가 존재하는 경우 유저 검색
      PartnerActions.fetch_partner_code_search_request(receivedRequest.value);
    }
  }, [receivedRequest.value]);

  useDidUpdateEffect(() => {
    if (!!fetchPartnerCodeSearchSuccess) {
      // 그룹코드 서칭을 통해, 사용자 정보 수집
      // state => 0: normal, 1: partner, 2:reject, 3:received, 4: request
      if (prevPartnerState.value !== partnerCodeSearch.state) {
        // 현재 state와 prev state 가 다른경우, 팝업
        alertOffTheTableRequestPartner();
        if (!!keyword.value) {
          console.log('fasdfsafsafsafsafs');
          PartnerActions.fetch_partner_search_request({ keyword: keyword.value });
        }
      } else if (
        partnerShipState.find(i => i.state === partnerCodeSearch.state)?.text === 'normal'
      ) {
        // new
        majorClassify.setValue('request');
        minorClassify.setValue('new');
        selectedPartnerData.setValue(partnerCodeSearch);
      } else if (
        partnerShipState.find(i => i.state === partnerCodeSearch.state)?.text === 'partner'
      ) {
        // Already Partner
        majorClassify.setValue('input');
        minorClassify.setValue('detail');
        alreadyPartner.setValue(partnerCodeSearch.groupCode);
      } else if (
        partnerShipState.find(i => i.state === partnerCodeSearch.state)?.text === 'received'
      ) {
        // Received Request
        majorClassify.setValue('request');
        minorClassify.setValue('received');
        selectedPartnerData.setValue(partnerCodeSearch);
      } else if (
        partnerShipState.find(i => i.state === partnerCodeSearch.state)?.text === 'waiting'
      ) {
        // Request Waiting
        majorClassify.setValue('request');
        minorClassify.setValue('waiting');
        selectedPartnerData.setValue(partnerCodeSearch);
      } else if (
        partnerShipState.find(i => i.state === partnerCodeSearch.state)?.text === 'rejected'
      ) {
        majorClassify.setValue('request');
        minorClassify.setValue('new');
        selectedPartnerData.setValue(partnerCodeSearch);
      } else {
        console.log('________________________________________ [ ERROE] ____');
      }
    }
  }, [fetchPartnerCodeSearchSuccess]);

  useDidUpdateEffect(() => {
    // 검색어 없는경우 초기 상태로
    if (!keyword.value) {
      majorClassify.setValue('search');
      minorClassify.setValue('default');
    }
  }, [keyword.value]);

  useEffect(() => {
    if (!!alreadyPartner.value) {
      // 선택 된 파트너가 존재하는 경우,
      PartnerActions.fetch_partner_detail_request({ groupCode: alreadyPartner.value });
    }
  }, [alreadyPartner.value]);

  useDidUpdateEffect(() => {
    if (fetchPartnerDetailSuccess) {
      isSearchValue.setValue(false);
      nickName.setValue(partnerDetail.name === null ? '' : partnerDetail.name);
      type.setValue(partnerDetail.partnerType === null ? '' : partnerDetail.partnerType);
      phone.setValue(partnerDetail.phone === null ? '' : partnerDetail.phone);
      phoneCode.setValue(partnerDetail.phonecode === null ? '' : partnerDetail.phonecode);
      email.setValue(partnerDetail.email === null ? '' : partnerDetail.email);
      fax.setValue(partnerDetail.fax === null ? '' : partnerDetail.fax);
      tel.setValue(partnerDetail.tel === null ? '' : partnerDetail.tel);
      address.setValue(partnerDetail.address === null ? '' : partnerDetail.address);
      profileFile.setValue(partnerDetail.profileImg === null ? '' : partnerDetail.profileImg);
      currency.setValue(partnerDetail.currency === null ? '' : partnerDetail.currency);
      accountType.setValue(partnerDetail.accountType === null ? '' : partnerDetail.accountType);
      partnerShipIdx.setValue(
        partnerDetail.partnershipIdx === null ? '' : partnerDetail.partnershipIdx,
      );
      userGroupIdx.setValue(partnerDetail.userGroupIdx === null ? '' : partnerDetail.userGroupIdx);
      counrty.setValue(partnerDetail.countryId === null ? '' : partnerDetail.countryId);
      region.setValue(partnerDetail.statesId === null ? '' : partnerDetail.statesId);

      majorClassify.setValue('input');
      minorClassify.setValue('detail');

      if (!!partnerDetail.accountType) {
        setIsMenualUser(
          accountTypeList.find((i: any) => i.id === partnerDetail.accountType)?.type === 'manual',
        );
      } else {
        //accountType.value가 없는 경우, new로 간주
        setIsMenualUser(true);
      }
    }
  }, [fetchPartnerDetailSuccess]);

  useDidUpdateEffect(() => {
    if (answerReceiveRequestedSuccess) {
      if (isAcceptPartner) {
        alreadyPartner.setValue(isSubmitAnswerData.reqGroupCode);
      } else {
        onClosePartnerModal();
      }
    }
  }, [answerReceiveRequestedSuccess]);

  useDidUpdateEffect(() => {
    if (answerReceiveRequestedFailure) {
      alertOffTheTableRequestPartner();
      onClosePartnerModal();
    }
  }, [answerReceiveRequestedFailure]);

  useDidUpdateEffect(() => {
    if (registerNewParterSuccess) {
      onClosePartnerModal();
    }
  }, [registerNewParterSuccess]);

  useDidUpdateEffect(() => {
    if (registerNewMenualParterSuccess) {
      alreadyPartner.setValue(newMenualPartnerGroupIdx);
      majorClassify.setValue('input');
      minorClassify.setValue('detail');
    }
  }, [registerNewMenualParterSuccess]);

  useDidUpdateEffect(() => {
    if (deletePartnerSuccess) {
      onClosePartnerModal();
    }
  }, [deletePartnerSuccess]);

  useDidUpdateEffect(() => {
    if (editPartnerInfoSuccess) {
      majorClassify.setValue('input');
      minorClassify.setValue('detail');
    }
  }, [editPartnerInfoSuccess]);

  useEffect(() => {
    if (!!counrty.value) {
      UtilActions.fetch_country_region_list_request({ country: counrty.value });
    }
  }, [counrty.value]);

  const handleFetchParterList = () => {
    // setPartnerListStack(draft => [...draft, ...partnerList]);
    searchPage.setValue((draft: number) => draft + 1);
    const submitData = {
      page: searchPage.value + 1,
    };
    // PartnerActions.fetch_partner_search_request({ keyword: keyword.value });
  };

  const handleSearchParter = () => {
    if (!!keyword.value) {
      PartnerActions.fetch_partner_search_request({ keyword: keyword.value });
    }
  };

  const handleSelectPartnerSearchList = (selected: any) => {
    prevPartnerState.setValue(selected.state);
    prevKeyword.setValue(keyword.value);
    PartnerActions.fetch_partner_code_search_request(selected.groupCode);
  };

  const handleSubmitAnswerReceivedRequest = (data: any) => {
    if (data.state === 1) {
      setIsAcceptPartner(true);
    } else {
      setIsAcceptPartner(false);
    }

    const submitData = {
      partnershipIdx: data.partnershipIdx,
      reqGroupCode: data.groupCode,
      reqEmail: data.email,
      state: data.state,
      partnerType: data.partnerType,
      // currency: data.partnerCurrency,
      // currency: 'KRW',
      currency: !!user?.currencyCode ? user?.currencyCode : 'USD',
      userGroupIdx: data.userGroupIdx,
    };
    setIsSubmitAnswerData(submitData);
    PartnerActions.answer_receive_requested_request(submitData);
  };

  const handleSubmitPartnerData = (data: any) => {
    if (minorClassify.value === 'edit') {
      let submitData = {};

      if (accountTypeList.find((i: any) => i.id === accountType.value)?.type === 'manual') {
        submitData = {
          accountType: accountType.value,
          partnershipIdx: partnerShipIdx.value,
          // userGroupIdx: isPartnerGroupIdx,
          // userGroupIdx: alreadyPartner.value,
          userGroupIdx: userGroupIdx.value,
          partnerType: data.type,
          tel: data.tel,
          fax: data.fax,
          currency: data.currency,
          email: data.email,
          phonecode: !data.phoneCode ? null : data.phoneCode,
          name: data.nickName,
          phone: data.phone,
          address: data.address,
          countryId: !data.country ? null : data.country,
          statesId: !data.region ? null : data.region,
          // countryId: null,
        };
      } else {
        submitData = {
          email: data.email,
          accountType: accountType.value,
          // partnershipIdx: isPartnerGroupIdx,
          partnershipIdx: partnerShipIdx.value,
          partnerType: data.type,
          tel: data.tel,
          fax: data.fax,
          currency: data.currency,
        };
      }

      PartnerActions.edit_partner_info_request(submitData);
    }

    if (minorClassify.value === 'new') {
      const submitData = {
        partnerType: data.type,
        email: data.email,
        name: data.nickName,
        tel: data.tel,
        phone: data.phone,
        fax: data.fax,
        address: data.address,
        currency: data.currency,
        countryId: !data.country ? null : data.country,
        phonecode: !data.phoneCode ? null : data.phoneCode,
        statesId: !data.region ? null : data.region,
      };
      PartnerActions.register_new_menual_partner_request(submitData);
    }
  };

  const handleSubmitRegisterNewPartner = (data: any) => {
    const submitData = {
      resGroupIdx: data.userGroupIdx,
      resUserEmail: data.email,
      resGroupCode: data.groupCode,
      partnerType: data.partnerType,
      // currency: user?.currencyCode,
      currency: !!user?.currencyCode ? user?.currencyCode : 'USD',
    };
    PartnerActions.register_new_partner_request(submitData);
  };

  const handleClickGoToBack = () => {
    PartnerActions.fetch_partner_search_request({ keyword: prevKeyword.value });
  };

  const handleDeletePartner = () => {
    const partnerData = {
      accountType: accountType.value,
      partnershipIdx: partnerShipIdx.value,
      userGroupIdx: alreadyPartner.value,
      nickName: nickName.value,
      isMenual: isMenualUser,
    };
    alertDisconnectPartner(partnerData);
  };

  const handleClickRegisterPartner = () => {
    majorClassify.setValue('input');
    minorClassify.setValue('new');
    isSearchValue.setValue(false);
    setIsMenualUser(true);
  };

  return (
    <StyledPartnerModal
      data-component-name="NewPartnerModal"
      modalHeight={modalHeight.value}
      modalWidth={modalWidth.value}
      paddingBottom={paddingBottom.value}
    >
      {useMemo(
        () =>
          majorClassify.value === 'input' && (
            <div className="newPartnerModal__container_input_icon">
              <img src={!!isMenualUser ? note_pencil_in_circle : find_magnifier_circle} />
            </div>
          ),
        [isMenualUser, majorClassify.value],
      )}
      <div className="newPartnerModal__container_wrapper">
        <div className="newPartnerModal__container">
          {useMemo(
            () => (
              <div
                className={cx('newPartnerModal__searchbar_wrapper', {
                  isSearchbar: !!isSearchValue.value ? true : false,
                })}
              >
                <Grid container className="newPartnerModal__searchbar_box">
                  <Grid item className="partnerModalSearch__search_image">
                    <img src={find_magnifier} />
                  </Grid>
                  <Grid item className="partnerModalSearch__search_box">
                    <CustomSpan fontSize={14} fontWeight={500}>
                      <T>A. Sync ID / Nick name</T>
                    </CustomSpan>
                    <MuiWrapper
                      className="partnerModalSearch__search_bar_wrapper"
                      config={{
                        borderColor: 'transparent',
                        activeBorderColor: 'transparent',
                        hoverBorderColor: 'transparent',
                      }}
                    >
                      <>
                        <TextField
                          className="radius-md partnerModalSearch__search_bar"
                          variant="outlined"
                          fullWidth
                          placeholder="Sync ID, E-mail"
                          value={keyword?.value || ''}
                          onChange={keyword?.onChange}
                          onKeyPress={e => e.key === 'Enter' && handleSearchParter()}
                        />
                        <button
                          className="btn-reset partnerModalSearch__search_btn"
                          onClick={handleSearchParter}
                        >
                          <img src={icon_magnifier} alt="search" />
                        </button>
                      </>
                    </MuiWrapper>
                  </Grid>
                </Grid>
              </div>
            ),
            [isSearchValue.value, keyword.value],
          )}
          {useMemo(
            () =>
              majorClassify.value === 'search' && (
                <PartnerModalSearch
                  majorCategory={majorClassify}
                  minorCategory={minorClassify}
                  isSearchValue={isSearchValue}
                  partnerSearchList={partnerSearchList}
                  partnerShipState={partnerShipState}
                  onClickRegisterPartner={handleClickRegisterPartner}
                  onSelectPartnerSearchList={handleSelectPartnerSearchList}
                />
              ),
            [majorClassify.value, minorClassify.value, partnerSearchList, keyword.value],
          )}

          {useMemo(
            () =>
              majorClassify.value === 'request' && (
                <PartnerModalRequest
                  selectedPartnerData={selectedPartnerData.value}
                  majorData={majorClassify}
                  minorData={minorClassify}
                  partnerType={partnerType}
                  isSearchValue={isSearchValue}
                  partnerCurrency={partnerCurrency}
                  onClickGoToBack={handleClickGoToBack}
                  onSubmitAnswerReceivedRequest={handleSubmitAnswerReceivedRequest}
                  onSubmitRegisterNewPartner={handleSubmitRegisterNewPartner}
                />
              ),
            [majorClassify.value, minorClassify.value, selectedPartnerData.value],
          )}

          {useMemo(
            () =>
              majorClassify.value === 'input' && (
                <PartnerModalInput
                  majorData={majorClassify}
                  minorData={minorClassify}
                  countryList={countryList}
                  regionList={regionList}
                  accountTypeList={accountTypeList}
                  partnerDataList={partnerDataList}
                  currencyList={currencyList}
                  onSubmitPartnerData={handleSubmitPartnerData}
                  onDeletePartner={handleDeletePartner}
                />
              ),
            [majorClassify.value, minorClassify.value, partnerDataList],
          )}
        </div>
      </div>
    </StyledPartnerModal>
  );
}

const StyledPartnerModal = styled.section<{
  modalHeight: number;
  modalWidth: number;
  paddingBottom: number;
}>`
  position: relative;
  .newPartnerModal__container_input_icon {
    position: absolute;
    top: 0;
    right: 50px;
    transform: translate(0, -50%);
    z-index: 200;
  }
  .newPartnerModal__container_wrapper {
    max-height: 590px;
    overflow: hidden;

    .newPartnerModal__container {
      width: ${({ modalWidth }) => modalWidth && modalWidth + 'px'};
      /* height: ${({ modalHeight }) => modalHeight && modalHeight + 'px'}; */
      /* height: 100%; */
      /* width: auto;
      height: auto; */
      /* padding-bottom: ${({ paddingBottom }) => paddingBottom && paddingBottom + 'px'}; */
      /* transition: width 0.5s, height 0.5s, padding 0.5s, transform 0.5s; */
      transition: width 0.3s, height 0.3s, transform 0.3s;
      /* border-radius: 15px 15px 0 0; */
      border-radius: 15px;
      padding: 30px 30px 0 30px;
      /* padding: 30px; */
      background-color: #ffffff;
      /* display: inline-table; */

      .newPartnerModal__searchbar_wrapper {
        width: 100%;
        display: none;
        height: 0px;
        /* height: 0px;
        transition: height 0.3s, transform 0.3s; */
        &.isSearchbar {
          margin-bottom: 30px;
          height: 110px;
          display: inline-block;
        }
        /* width: 490px; */
        .newPartnerModal__searchbar_box {
          justify-content: space-between;
          align-items: center;
          padding-bottom: 30px;
          border-bottom: 1px dashed #b5b7c1;
          background-color: #ffffff;
        }
        .partnerModalSearch__search_image {
          width: 80px;
          height: 80px;
          img {
            width: 80px;
            height: 80px;
          }
          margin-right: 20px;
          /* width: 64px;
            text-align: end; */
        }
        .partnerModalSearch__search_box {
          width: calc(100% - 100px);
          column-gap: 15px;
          display: flex;
          flex-direction: column;
          row-gap: 15px;
          padding-top: 5px;
          .partnerModalSearch__search_bar_wrapper {
            /* width: 430px; */
            height: 40px;
            position: relative;
            /* margin-left: 15px; */
            .MuiInputBase-root {
              background-color: #f4f5fa;
            }
            .partnerModalSearch__search_btn {
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
      }
    }
  }
`;

export default React.memo(NewPartnerModalContainer);
