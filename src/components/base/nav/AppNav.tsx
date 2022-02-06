import cx from 'classnames';
import { cutUrl } from 'lib/library';
import { navigation, pageUrl } from 'lib/mapper';
import React, { Fragment, useEffect } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import { color } from 'styles/utils';
import {
  icon_forward_thin,
  icon_facebook,
  icon_instagram,
  icon_linkedin,
  icon_youtube,
} from 'components/base/images';
import { headerHeight } from '../header/AppHeader';
import { useShallowAppSelector } from 'store/hooks';

const AppNav = () => {
  const {
    newNotificationData: { newNotificationList },
  } = useShallowAppSelector(state => ({
    newNotificationData: state.notification.newNotifications.data || {},
  }));
  const { pathname } = useLocation();

  return (
    <Styled.AppNav data-component-name="AppNav">
      <h1 className="sr-only">메인 메뉴</h1>

      <ul className="appNav__menu_list">
        {navigation.map((item, idx) => {
          const isCurrentPath = `${cutUrl(pathname)}` === item.path.slice(1);
          const hasNewNotification = newNotificationList?.find(
            (notiItem: any) => notiItem.category === item.text.toUpperCase(),
          );

          return (
            <li key={idx} className={cx('appNav__menu_item', { active: isCurrentPath })}>
              <NavLink to={item.path} className="appNav__link">
                <img src={item.icon} className="appNav__link_img" />
                {item.text}
                {!!newNotificationList?.length && !!hasNewNotification && (
                  <span className="appNav__new_icon">N</span>
                )}
              </NavLink>
            </li>
          );
        })}
      </ul>

      <div className="appNav__bottom">
        {/* <div>
          <button className="btn-reset appNav__help" onClick={() => isOpenHelpModal.setValue(true)}>
            <img src={help_speech_bubble} alt="support icon" />
          </button>
        </div> */}

        <div className="appNav__sns_box">
          <div className="appNav__sns_icon_box facebook">
            <a href="https://www.facebook.com/doflab/" target="_blank" rel="noopener noreferrer">
              <img className="appNav__sns_icon" src={icon_facebook} alt="sns icon" />
            </a>
          </div>
          <div className="appNav__sns_icon_box instagram">
            <a href="https://www.instagram.com/dof_inc/" target="_blank" rel="noopener noreferrer">
              <img className="appNav__sns_icon" src={icon_instagram} alt="sns icon" />
            </a>
          </div>
          <div className="appNav__sns_icon_box linkedin">
            <a
              href="https://www.linkedin.com/company/dof-inc."
              target="_blank"
              rel="noopener noreferrer"
            >
              <img className="appNav__sns_icon" src={icon_linkedin} alt="sns icon" />
            </a>
          </div>
          <div className="appNav__sns_icon_box youtube">
            <a href="https://www.youtube.com/c/DOFinc" target="_blank" rel="noopener noreferrer">
              <img className="appNav__sns_icon" src={icon_youtube} alt="sns icon" />
            </a>
          </div>
        </div>

        <div>
          <Link to={pageUrl.auth.signOut} className="appNav__logout">
            로그아웃
          </Link>
        </div>
      </div>
    </Styled.AppNav>
  );
};

const Styled = {
  AppNav: styled.nav`
    z-index: 1;
    position: relative;
    margin-top: -${headerHeight}px;
    width: 210px;
    height: calc(100% + ${headerHeight}px);
    min-height: ${window.innerHeight}px;
    padding-top: 35px;
    padding-bottom: 65px;
    background: #17288a;
    background: -moz-linear-gradient(top, #17288a 0%, #17288a 30%, #00a4e3 100%);
    background: -webkit-linear-gradient(top, #17288a 0%, #17288a 30%, #00a4e3 100%);
    background: linear-gradient(to bottom, #17288a 0%, #17288a 30%, #00a4e3 100%);

    .appNav__menu_list {
      padding-left: 10px;
      .appNav__menu_item {
        position: relative;
        padding: 8px 10px;
        font-size: 14px;
        color: white;
        &:not(:first-child) {
          margin-top: 1px;
        }
        &:nth-child(3),
        &:nth-child(6) {
          margin-top: 25px;
        }
        &:hover,
        &.active {
          background: white;
          border-top-left-radius: 15px;
          border-bottom-left-radius: 15px;
          color: ${color.navy_blue};
        }
      }
      .appNav__division {
        display: flex;
        align-items: center;
        margin-top: 35px;
        font-size: 15px;
        color: #fff;
        &.dot {
          &:before {
            content: '';
            display: inline-block;
            width: 15px;
            height: 2px;
            margin-right: 9px;
            background-color: #fff;
          }
        }
      }
      .appNav__link {
        display: flex;
        align-items: center;
        .appNav__link_img {
          margin-right: 17px;
          /* width: 45px;
          height: 45px; */
          /* background-color: ${color.navy_blue}; */
          /* border: 1px solid #fff; */
          /* border-radius: 8px; */
        }
        .appNav__link_arrow {
          position: absolute;
          right: 9px;
        }
        .appNav__new_icon {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: 10px;
          width: 20px;
          height: 20px;
          background-color: ${color.blue};
          border-radius: 50%;
          font-size: 13px;
          color: white;
          font-weight: 500;
        }
      }
    }

    .appNav__bottom {
      position: absolute;
      bottom: 60px;
      padding: 0 25px;
      .appNav__help {
        position: relative;
        right: -35px;
      }
      .appNav__sns_box {
        display: flex;
        justify-content: space-between;
        margin-top: 70px;
        .appNav__sns_icon_box {
          &:not(:first-child) {
            margin-left: 10px;
          }
          .appNav__sns_icon {
            width: 32px;
            border: 1px solid white;
            border-radius: 50%;
          }
        }
      }
      .appNav__logout {
        display: block;
        margin-top: 30px;
        text-decoration: underline;
        color: white;
      }
    }
  `,
};

export default AppNav;
