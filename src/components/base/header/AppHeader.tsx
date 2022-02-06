import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import { NavLink, Link, useLocation, useHistory } from 'react-router-dom';
import {
  icon_alert_bubble,
  icon_bell,
  icon_speech_bubble,
  icon_user_circle,
  logo,
} from 'components/base/images';
import { navigation, pageUrl } from 'lib/mapper';
import { isLogInSelector } from 'store/modules/auth';
import LogoSyncText from '../images/LogoSyncText';
import ImgCrop from 'components/common/images/ImgCrop';
import { useShallowAppSelector } from 'store/hooks';
import { color } from 'styles/utils';
import { cutUrl } from 'lib/library';
import CustomSpan from 'components/common/text/CustomSpan';
import VerticalSlider from 'components/common/slider/VerticalSlider';
import { AuthActions, NotificationActions } from 'store/actionCreators';
import { useDidUpdateEffect } from 'lib/utils';
import queryString from 'query-string';
import storage from 'lib/storage';

function AppHeader() {
  const {
    language,
    isLogIn,
    user,
    newNotificationData: { newNotificationCount },
    officialNotifications,
    signInUrl,
    signInUrlSuccess,
    signUpUrl,
    signUpUrlSuccess,
  } = useShallowAppSelector(state => ({
    language: state.base.language,
    isLogIn: isLogInSelector(state),
    user: state.user.user,
    newNotificationData: state.notification.newNotifications.data || {},
    officialNotifications: state.notification.officialNotifications.data?.list,
    signInUrl: state.auth.signInAuth.data?.connectUrl,
    signInUrlSuccess: state.auth.signInAuth.success,
    signUpUrl: state.auth.signUpAuth.data?.connectUrl,
    signUpUrlSuccess: state.auth.signUpAuth.success,
  }));

  const location = useLocation();
  const { pathname, search, state } = location as { pathname: string; search: string; state: any };
  const queryParse = queryString.parse(search);
  const from = state?.hasOwnProperty('from') ? state.from : { pathname };
  // NOTE: ErrorContainer 에서 returnPath 넘겨줬을 경우, PrivateRoute에서 from을 넘겨줬을경우
  const returnPath = queryParse?.returnPath || from.pathname;
  const currentPath = cutUrl(pathname);
  const isShowOfficialNotifications = !['project', 'home'].includes(currentPath);
  const isExceptedProjectPage = [
    pageUrl.project.create,
    pageUrl.project.edit,
    pageUrl.project.detail,
  ].includes(pathname);
  const history = useHistory();
  const alarmCountRef = useRef<null | any>(null);
  const [alarmCountHeight, setAlarmCountHeight] = useState(0);

  // SECTION: function
  // TODO: 해당 페이지 등록
  // const handleToggleNav = (path: string) => {
  //   history.push(`/${path}`);
  // };

  const handleConnectAuth = (type: string) => {
    const submitData = {
      return_url: window.location.protocol + '//' + window.location.host + '/home',
      failure_url: window.location.protocol + '//' + window.location.host + '/home',
    };
    // console.log('submitData _____________________ ', submitData);
    if (type === 'signIn') {
      AuthActions.sign_in_auth_request(submitData);
    }
    if (type === 'signUp') {
      AuthActions.sign_up_auth_request(submitData);
    }
  };

  const handleSignOut = () => history.push(pageUrl.auth.signOut);

  // TEST:
  // useEffect(() => {
  //   console.log('history', history);
  // }, []);

  // SECTION: DidMount

  useLayoutEffect(() => {
    if (!!alarmCountRef.current) {
      setAlarmCountHeight(alarmCountRef.current.clientWidth || 0);
    }
  }, [alarmCountRef.current]);

  useEffect(() => {
    if (isShowOfficialNotifications) {
      NotificationActions.fetch_official_notifications_request({
        language: language.toUpperCase(),
      });
    }
  }, [isShowOfficialNotifications]);

  // SECTION: DidUpdate
  // returhPath 저장 후 이동
  useDidUpdateEffect(() => {
    if (signInUrlSuccess) {
      // console.log('loginUrlSuccess _____ >> ', connectUrl);
      window.location.href = signInUrl;
      storage.set('returnPath', returnPath);
    }
  }, [signInUrlSuccess === true]);

  useDidUpdateEffect(() => {
    if (signUpUrlSuccess) {
      // console.log('loginUrlSuccess _____ >> ', connectUrl);
      window.location.href = signUpUrl;
      storage.set('returnPath', returnPath);
    }
  }, [signUpUrlSuccess === true]);

  useEffect(() => {
    console.log('officialNotifications', officialNotifications);
  }, [officialNotifications]);

  return (
    <Styled.AppHeader data-component-name="AppHeader" isExceptedProjectPage={isExceptedProjectPage}>
      <header className="header">
        <div className="header__title_box">
          <h1>
            {/* <Link to="/" className="header__logo_box">
            <img src={logo} alt="Logo" className="header__logo" />
            <LogoSyncText />
          </Link> */}
            <span className="sr-only">DOF Sync</span>
          </h1>
          {/* TODO: 공지사항 위로 올라가기 기능 추가 */}
          {isShowOfficialNotifications && (
            <div className="header__notice">
              <img src={icon_speech_bubble} alt="speech icon" className="header__notice_icon" />
              <div className="header__notice_list">
                {/* TODO: data 연동 */}
                <VerticalSlider data={officialNotifications} />
              </div>
            </div>
          )}
        </div>
        <div className="header__menu_container">
          {/* {!isExceptedProjectPage && (
            <div className="header__toggle_menu">
              <ul className="header__toggle_menu_list">
                {['Store', 'Notifications'].map((item, idx) => {
                  const itemIndex = item.toLowerCase();
                  return (
                    <li
                      className={cx('header__toggle_menu_item', {
                        active: currentPath === itemIndex,
                      })}
                      key={idx}
                      onClick={() => handleToggleNav(itemIndex)}
                    >
                      <span className="header__toggle_menu_item_mark"></span>
                      {item}
                    </li>
                  );
                })}
              </ul>
            </div>
          )} */}
          <div className="header__auth_menu">
            <ul className="header__menu_list auth">
              {isLogIn ? (
                <li
                  className={cx('header__menu_item sign cursor-pointer', {
                    active: pathname === pageUrl.auth.signOut,
                  })}
                  onClick={handleSignOut}
                >
                  Logout
                  {/* <NavLink to={pageUrl.auth.signOut} className="header__link">
                    Logout
                  </NavLink> */}
                </li>
              ) : (
                <li
                  className={cx('header__menu_item sign cursor-pointer', {
                    active: pathname === pageUrl.auth.signIn,
                  })}
                  onClick={() => handleConnectAuth('signIn')}
                >
                  Login
                  {/* <NavLink to={pageUrl.auth.signIn} className="header__link">
                    Login
                  </NavLink> */}
                </li>
              )}
              <li className="header__menu_item alarm">
                <NavLink to={pageUrl.notifications.index} className="header__link_alarm">
                  <img src={icon_alert_bubble} alt="notifications" className="header__alarm_icon" />
                  {!!newNotificationCount && (
                    <span
                      className="header__alarm_count"
                      ref={alarmCountRef}
                      style={{
                        height: `${alarmCountHeight}px`,
                      }}
                    >
                      {newNotificationCount}
                    </span>
                  )}
                </NavLink>
              </li>
              <li className="header__menu_item account">
                <NavLink to={`/@${user?.userCode}`} className="header__link_account">
                  {user?.profileImg ? (
                    <ImgCrop width={52} isCircle src={user.profileImg} />
                  ) : (
                    <img src={icon_user_circle} alt="account" />
                  )}
                </NavLink>
                {/* <p className="header__account_name">
                  디오에프연구소
                  <br />
                  jun@doflab.com
                </p> */}
              </li>
            </ul>
          </div>
        </div>
      </header>
    </Styled.AppHeader>
  );
}

export const headerHeight = 120;

const Styled = {
  AppHeader: styled.div<{ isExceptedProjectPage: boolean }>`
    position: relative;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      width: 100%;
      height: ${headerHeight}px;
      padding-left: 260px;
      padding-right: 50px;
      /* padding-top: ${({ isExceptedProjectPage }) => isExceptedProjectPage && '15px'}; */
      /* background-color: #fff; */
      /* border-bottom: 1px solid #ddd; */
    }
    .header {
      /* position: fixed;
      top: 0;
      left: 0; */
      /* text-align: center; */
      display: flex;
      align-items: center;
    }
    .header__logo_box {
      display: flex;
      align-items: center;
      .header__logo {
        margin-right: 25px;
      }
    }
    .header__notice {
      display: flex;
      align-items: center;
      position: relative;
      width: 1070px;
      padding: 10px 35px;
      background-color: #edf4fb;
      border-radius: 25px;
      .header__notice_icon {
        margin-right: 25px;
      }
      .header__notice_list {
        width: calc(100% - 50px);
        height: 17px;
        .header__notice_item {
          height: 17px;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
        }
      }
    }
    .header__menu_container {
      display: flex;
      align-items: center;
    }
    .header__menu_list {
      display: flex;
      align-items: center;
    }
    .header__menu_item {
      &:not(:first-of-type) {
        margin-left: 20px;
      }
      &.active {
        text-decoration: underline;
      }
      &.sign {
        margin-right: 10px;
      }
      &.account {
        display: flex;
        align-items: center;
        .header__account_name {
          text-align: left;
          margin-left: 20px;
          line-height: 1.3;
        }
      }
      .header__link {
      }
      .header__link_alarm {
        display: inline-block;
        position: relative;
        top: 3px;
        .header__alarm_icon {
        }
        .header__alarm_count {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: -7px;
          right: -5px;
          padding: 3px;
          min-width: 22px;
          min-height: 22px;
          background-color: ${color.blue};
          border-radius: 50%;
          font-size: 12px;
          font-weight: 500;
          color: white;
          letter-spacing: -0.5px;
        }
      }
      .header__link_account {
        display: inline-block;
        background-color: #fff;
        border-radius: 50%;
        box-shadow: 0 0px 6px 1px rgba(0, 0, 0, 0.16);
        overflow: hidden;
        padding: 0;
        line-height: 0;
        img {
          width: 52px;
        }
      }
    }
    .header__auth_menu {
    }
    .header__toggle_menu {
      margin-right: 35px;
      .header__toggle_menu_list {
        display: flex;
        align-items: center;
        .header__toggle_menu_item {
          display: flex;
          align-items: center;
          height: 40px;
          padding-right: 25px;
          border: 1px solid ${color.navy_blue};
          border-radius: 20px;
          font-size: 13px;
          &:not(:first-child) {
            margin-left: 25px;
          }
          .header__toggle_menu_item_mark {
            display: inline-flex;
            margin-right: 20px;
            width: 40px;
            height: 40px;
            border-radius: 20px;
            background-color: ${color.navy_blue};
          }
          &.active {
            flex-direction: row-reverse;
            padding-right: 0;
            padding-left: 25px;
            .header__toggle_menu_item_mark {
              margin-right: 0px;
              margin-left: 20px;
            }
          }
        }
      }
    }
  `,
};

export default AppHeader;
