import React, { useCallback, useEffect } from 'react';
import MainHome from 'components/home/MainHome';
import { useShallowAppSelector } from 'store/hooks';
import queryString from 'query-string';
import { useHistory, useLocation } from 'react-router';
import useInput from 'lib/hooks/useInput';
import { T } from 'components/common/text';
import { AppActions, AuthActions, UserActions } from 'store/actionCreators';
import { useTranslation } from 'react-i18next';
import storage, { keys, setCookie, setSessionCookie } from 'lib/storage';
import { useDidUpdateEffect } from 'lib/utils';
import { isLogInSelector } from 'store/modules/auth';

export default function MainHomeContainer() {
  const { isLogIn, fetchUserProfile, fetchUserProfileSuccess, editLegalAgreementSuccess } =
    useShallowAppSelector(state => ({
      isLogIn: isLogInSelector(state),
      fetchUserProfile: state.user.fetchProfile,
      fetchUserProfileSuccess: state.user.fetchProfile.success,
      editLegalAgreementSuccess: state.auth.editLegalAgreement.success,
    }));

  const userInfoData = fetchUserProfile.data?.profile;
  const { t } = useTranslation();
  const location = useLocation();
  const history = useHistory();
  const queryParse = queryString.parse(location.search);
  const accessToken = queryParse?.accessToken;
  const isExtraInfo = !!Number(queryParse?.isExtraInfo);
  const isFailure = !!queryParse?.failure;
  const isOpenLegalPopup = useInput(false);

  const loginFailurePopup = useCallback(() => {
    history.replace(location.pathname);

    AppActions.add_popup({
      isOpen: true,
      type: 'alert',
      title: <T>GLOBAL_ALERT</T>,
      content: t('ALARM_LOGIN_FAILURE'),
      isTitleDefault: true,
      isContentDefault: true,
      onClick() {
        // window.history.replaceState('', '', window.location.href.split('?')[0]);
        // history.replace(location.pathname);
        return;
      },
    });
  }, []);

  const handleEditLegalAgreement = () => {
    console.log('handleEditLegalAgreement');
    let sevice_policy_arr = [
      {
        terms_type: 'privacy',
        is_agreement: 1,
      },
      {
        terms_type: 'terms',
        is_agreement: 1,
      },
    ];

    let submitData = {
      accessToken,
      policy: JSON.stringify(sevice_policy_arr),
    };
    console.log('submitData', submitData);

    AuthActions.edit_legal_agreement_request(submitData);
  };

  const handleSetUser = () => {
    console.log('handleSetUser');
    setSessionCookie(keys.sign_in_token, accessToken);
    setCookie(keys.remember_user_token, accessToken, { 'max-age': 3600 * 6 });
    AuthActions.set_access_token(accessToken);
    UserActions.fetch_profile_request();

    // history.replace(location.pathname);
  };

  useEffect(() => {
    // console.log(storage.get(keys.user)?.autoLogin);
    // UserActions.fetch_profile_request();
    if (Object.keys(queryParse).length > 0) {
      //queryParse 존재 여부 확인
      if (!!isFailure) {
        loginFailurePopup();
      } else if (!!accessToken) {
        // 토큰 있으면 로그인
        // console.log('Token 있음 _________ ', accessToken);
        // console.log('isExtraInfo ___________________________ ', isExtraInfo);
        if (!!isExtraInfo) {
          // isOpenLegalPopup.setValue(true);
          // history.replace(location.pathname);
          handleEditLegalAgreement();
        } else {
          handleSetUser();
        }
        // window.history.replaceState('', '', window.location.href.split('?')[0]);
      } else {
        // console.log('잘못된 쿼리스트링 => url replace');
        loginFailurePopup();
        // window.history.replaceState('', '', window.location.href.split('?')[0]);
      }
    }
  }, []);

  useDidUpdateEffect(() => {
    if (editLegalAgreementSuccess) {
      handleSetUser();
    }
  }, [editLegalAgreementSuccess === true]);

  // login 완료되는 시점 returnPath 이동
  useDidUpdateEffect(() => {
    if (isLogIn) {
      const returnPath = storage.get('returnPath');
      storage.remove('returnPath');
      history.push(returnPath);
    }
  }, [isLogIn]);

  // TEMP: edit legal agreement, 차후 실제 적용에 맞게 변경

  useEffect(() => {
    // actions.FETCH_TESTS_SAGA();
    // actions.FETCH_TEST_SAGA(1);
  }, []);

  return <MainHome />;
  // return <MainHome isOpenLegalPopup={isOpenLegalPopup} accessToken={accessToken} />;
}
