import React from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import { NavLink, Link, useLocation, useHistory } from 'react-router-dom';
import { icon_user_circle, logo } from 'components/base/images';
import { navigation, pageUrl } from 'lib/mapper';
import { isLogInSelector } from 'store/modules/auth';
import LogoSyncText from '../images/LogoSyncText';
import ImgCrop from 'components/common/images/ImgCrop';
import { useShallowAppSelector } from 'store/hooks';
import { color } from 'styles/utils';
import { cutUrl } from 'lib/library';

function AppHeader() {
  const { isLogIn, user } = useShallowAppSelector(state => ({
    isLogIn: isLogInSelector(state),
    user: state.user.user,
  }));

  const { pathname } = useLocation();
  const currentPath = cutUrl(pathname);
  const isExceptedProjectPage = [pageUrl.project.create, pageUrl.project.detail].includes(pathname);
  const history = useHistory();

  // SECTION: function
  // TODO: 해당 페이지 등록
  const handleToggleNav = (path: string) => {
    history.push(`/${path}`);
  };

  return (
    <Styled.AppHeader data-component-name="AppHeader">
      <header className="header">
        <h1>
          {/* <Link to="/" className="header__logo_box">
            <img src={logo} alt="Logo" className="header__logo" />
            <LogoSyncText />
          </Link> */}
          <span className="sr-only">DOF Sync</span>
        </h1>
        {/* <nav className="header__main_menu">
          <h1 className="sr-only">메인 메뉴</h1>
          <ul className="header__menu_list">
            {navigation.map((item, idx) => (
              <li key={idx} className={cx('header__menu_item', { active: pathname === item.path })}>
                <NavLink to={item.path} className="header__link">
                  {item.text}
                </NavLink>
              </li>
            ))}
          </ul>
        </nav> */}
        <div className="header__menu_container">
          {!isExceptedProjectPage && (
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
          )}
          <div className="header__auth_menu">
            <ul className="header__menu_list auth">
              {isLogIn ? (
                <li
                  className={cx('header__menu_item sign', {
                    active: pathname === pageUrl.auth.signOut,
                  })}
                >
                  <NavLink to={pageUrl.auth.signOut} className="header__link">
                    Logout
                  </NavLink>
                </li>
              ) : (
                <li
                  className={cx('header__menu_item sign', {
                    active: pathname === pageUrl.auth.signIn,
                  })}
                >
                  <NavLink to={pageUrl.auth.signIn} className="header__link">
                    Login
                  </NavLink>
                </li>
              )}
              <li className="header__menu_item account">
                <p className="header__account_name">
                  디오에프연구소
                  <br />
                  jun@doflab.com
                </p>
                <NavLink to={`/@${user?.userCode}`} className="header__link_account">
                  {user?.profileImg ? (
                    <ImgCrop width={52} isCircle src={user.profileImg} />
                  ) : (
                    <img src={icon_user_circle} alt="account" />
                  )}
                </NavLink>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </Styled.AppHeader>
  );
}

const Styled = {
  AppHeader: styled.div`
    position: relative;
    .header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      position: relative;
      width: 100%;
      height: 110px;
      padding-left: 260px;
      padding-right: 50px;
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
        margin-left: 10px;
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
          text-align: right;
          margin-right: 20px;
          line-height: 1.3;
        }
      }
      .header__link {
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
