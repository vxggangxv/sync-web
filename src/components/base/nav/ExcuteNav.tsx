import React from 'react';
import styled from 'styled-components';
import {
  icon_app_face,
  icon_app_scan_i,
  icon_app_scan,
  icon_app_match,
  icon_app_smile,
  icon_app_milling,
  icon_bridge_people,
} from 'components/base/images';
import CustomSpan from 'components/common/text/CustomSpan';
import CustomText from 'components/common/text/CustomText';
import { color } from 'styles/utils';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { Link } from 'react-router-dom';

const ExcuteNav = () => {
  const appList = [
    {
      name: 'FaceApp',
      icon: icon_app_face,
    },
    {
      name: 'WiT',
      icon: icon_app_scan_i,
    },
    {
      name: 'ScanApp',
      icon: icon_app_scan,
    },
    {
      name: 'MatchApp',
      icon: icon_app_match,
    },
    {
      name: 'SmileApp',
      icon: icon_app_smile,
    },
    {
      name: 'CAD',
      icon: '',
    },
    {
      name: 'CAM',
      icon: '',
    },
    {
      name: 'Milling',
      icon: icon_app_milling,
    },
  ];

  return (
    <Styled.ExcuteNav data-component-name="ExcuteNav">
      <h2 className="sr-only">Excute App</h2>

      <div className="excuteNav__content_container">
        <div className="excuteNav__app_menu">
          <ul className="excuteNav__app_menu_list">
            {appList.map((item, idx) => (
              <li className="excuteNav__app_menu_item" key={idx}>
                <div className="excuteNav__app_menu_item_name_box">
                  <p>
                    <CustomSpan fontSize={11}>{item.name}</CustomSpan>
                  </p>
                  <p>
                    <Link to="">
                      <CustomSpan
                        fontSize={11}
                        fontColor={color.blue}
                        style={{
                          textDecoration: 'underline',
                        }}
                      >
                        Install{' '}
                        <ArrowForwardIcon
                          fontSize="inherit"
                          className="excuteNav__app_menu_item_install_icon"
                        />
                      </CustomSpan>
                    </Link>
                  </p>
                </div>
                <div className="excuteNav__app_menu_item_icon_box">
                  <button className="btn-reset">
                    {!!item.icon && <img src={item.icon} alt="app icon" />}
                  </button>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="excuteNav__bridge_share_box">
          <button className="btn-reset excuteNav__bridge_share_btn">
            <span className="excuteNav__bridge_share_start">
              <img src={icon_bridge_people} alt="bridge start icon" />
              <CustomSpan fontSize={16} fontColor="white" fontWeight={500} fontStyle="italic">
                Start
              </CustomSpan>
            </span>
          </button>
          <CustomText
            fontSize={11}
            fontColor={color.navy_blue}
            fontStyle="italic"
            marginTop={5}
            style={{ textAlign: 'center' }}
          >
            anytime &amp; anywhere !
          </CustomText>
        </div>
      </div>
    </Styled.ExcuteNav>
  );
};

const Styled = {
  ExcuteNav: styled.aside`
    padding-top: 100px;
    width: 160px;
    height: 100%;
    .excuteNav__content_container {
      height: 100%;
      background-color: #eff1f8;
      border-top-left-radius: 24px;
      box-shadow: inset 1px 1px 3px 0.5px rgba(0, 0, 0, 0.16);
    }
    .excuteNav__app_menu {
      .excuteNav__app_menu_list {
        padding-top: 12px;
        .excuteNav__app_menu_item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 12px 30px 12px 17px;
          &:not(:first-child) {
            border-top: 1px solid rgba(178, 190, 221, 0.5);
          }
          &:first-child {
            /* border-top: 2px solid rgba(178, 190, 221, 0.75); */
          }
          .excuteNav__app_menu_item_name_box {
            min-width: 60px;
            line-height: 1.1;
            .excuteNav__app_menu_item_install_icon {
              position: relative;
              bottom: -4px;
              transform: rotate(45deg);
              font-size: 13px;
            }
          }
          .excuteNav__app_menu_item_icon_box {
          }
        }
      }
    }
    .excuteNav__bridge_share_box {
      padding-top: 18px;
      border-top: 2px solid rgba(178, 190, 221, 0.75);
      .excuteNav__bridge_share_btn {
        position: relative;
        padding-top: 25px;
        &:after {
          content: 'DOF Bridge';
          font-size: 10px;
          position: absolute;
          bottom: 30px;
          left: 74px;
        }
        .excuteNav__bridge_share_start {
          display: inline-flex;
          align-items: flex-end;
          height: 24px;
          padding: 0px 28px 4px 15px;
          background-color: ${color.navy_blue};
          border-top-right-radius: 12px;
          border-bottom-right-radius: 12px;
          img {
            margin-right: 10px;
          }
        }
      }
    }
  `,
};

export default React.memo(ExcuteNav);

/* border-top: 2px solid #b2bedd; */
