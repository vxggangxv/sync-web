import { Grid, TextField } from '@material-ui/core';
import MuiWrapper from 'components/common/input/MuiWrapper';
import React, { useState } from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import cx from 'classnames';
import { useHistory } from 'react-router-dom';
import CustomSpan from 'components/common/text/CustomSpan';
import { icon_user_circle, icon_protector } from 'components/base/images';
import { fixedNumbering } from 'lib/library';
import DateConverter from 'components/common/convert/DateConverter';
import ImgCrop from 'components/common/images/ImgCrop';
interface EmployeeProps {
  item: object | any;
  // page: object | any;
  // period: object | any;
  // checkedProjectProcess: object | any;
  // keyword: object | any;
}

function EmployeeCard({ item }: EmployeeProps) {
  const [stepFilterOpen, setStepFilterOpen] = useState(false);
  const history = useHistory();
  // const [date, setDate] = useState(null);

  // useEffect(() => {
  //   console.log('date', date);
  // }, [date]);

  return (
    <Styled.EmployeeCard data-component-name="EmployeeCard">
      <div className="employeeCard__container">
        <div className="employeeCard__content_section profile">
          <div className="employeeCard__profile_box profileImg">
            <div
              className={cx('isOnline', {
                active: !!item.isOnline,
              })}
            ></div>
            {!!item.profileImg ? (
              <ImgCrop width={52} isCircle src={item.profileImg} />
            ) : (
              <img className="profileImg__empty" src={icon_user_circle} alt="profile_image" />
            )}
            <div
              className={cx('isManager', {
                active: item.authority === 0 ? true : false,
              })}
            >
              <img src={icon_protector} />
            </div>
          </div>
          <div className="employeeCard__profile_box profile">
            <div className="employeeCard__profile">
              <CustomSpan fontSize={12} fontWeight={200} fontColor="#B5B7C1">
                {/* {item.employeeNum} */}
                {fixedNumbering(item.employeeNum, 3)}
              </CustomSpan>
            </div>
            <div className="employeeCard__profile">
              <CustomSpan fontSize={16} fontWeight={500} fontColor="#33B5E4">
                {item.postPosition}
                {/* {item.authority === 0 ? 'Manager' : 'Staff'} */}
              </CustomSpan>
            </div>
            <div className="employeeCard__profile">
              <CustomSpan fontSize={16} fontWeight={500}>
                {item.name}
              </CustomSpan>
            </div>
          </div>
        </div>
        <div className="employeeCard__content_section information">
          <div className="employeeCard__information_box assigned">
            <img className="employeeCard__icon" />
            <CustomSpan fontSize={15} fontWeight={200} marginLeft={10}>
              {item.assignedTask}
            </CustomSpan>
          </div>
          <div className="employeeCard__information_box phone">
            <img className="employeeCard__icon" />
            <CustomSpan fontSize={15} fontWeight={200} marginLeft={10}>
              {item.phone}
            </CustomSpan>
          </div>
          <div className="employeeCard__information_box emain">
            <img className="employeeCard__icon" />
            <CustomSpan fontSize={15} fontWeight={200} marginLeft={10}>
              {item.email}
            </CustomSpan>
          </div>
          <div className="employeeCard__information_box project">
            <img className="employeeCard__icon" />
            <CustomSpan fontSize={15} fontWeight={500} marginLeft={10}>
              {item.participationCount}
            </CustomSpan>
            <CustomSpan fontSize={10} fontWeight={200} marginLeft={10} fontColor="#B5B7C1">
              {/* {item.recentParticipantionDate} */}
              <DateConverter timestamp={item.recentParticipantionDate} format="YYYY-MM-DD" />
            </CustomSpan>
          </div>
        </div>
      </div>
    </Styled.EmployeeCard>
  );
}

const Styled = {
  EmployeeCard: styled.div`
    /* border: 1px solid #bababa */
    box-shadow: 0px 0px 6px rgb(0 0 0 / 16%);
    border-radius: 10px;
    width: 300px;
    height: 300px;
    padding: 20px 20px 30px;
    position: relative;

    .employeeCard__container {
      width: 100%;
      padding: 0 5px;
      &:hover {
        &:after {
          position: absolute;
          width: 100%;
          height: 100%;
          top: 0;
          left: 0;
          content: '';
          z-index: 1;
          background-color: #00a6e2;
          opacity: 0.23;
          border-radius: 10px;
          box-shadow: 0px 0px 6px rgb(0 0 0 / 16%);
        }
      }

      .employeeCard__content_section {
        &.profile {
          display: flex;
          border-bottom: 1px dashed #33b5e4;
          padding: 5px 5px 20px 5px;
        }

        &.information {
          padding: 20px 5px 0px 5px;
        }

        .employeeCard__profile_box {
          &.profileImg {
            width: 70px;
            height: 70px;
            position: relative;
            margin-right: 20px;
            .profileImg__empty {
              width: 70px;
              border: 1px solid #b5b7c1;
              border-radius: 50%;
            }
            .isOnline {
              position: absolute;
              left: 0;
              top: 0;
              width: 20px;
              height: 20px;
              border-radius: 10px;
              background-color: #54ff00;
              display: none;
              &.active {
                display: block;
              }
            }

            .isManager {
              position: absolute;
              bottom: 0;
              left: 0;
              width: 36px;
              height: 38px;
              display: none;
              &.active {
                display: block;
              }
            }
          }
          .employeeCard__profile {
            display: flex;
            align-items: center;

            &:nth-child(1) {
              height: 16px;
              margin-bottom: 2px;
            }
            &:nth-child(2) {
              height: 21px;
              margin-bottom: 10px;
            }
            &:nth-child(3) {
              height: 21px;
            }
          }
        }
        .employeeCard__information_box {
          display: flex;
          align-items: center;
          /* justify-content: center; */
          margin-bottom: 10px;
        }

        .employeeCard__icon {
          width: 25px;
          height: 25px;
          border-radius: 3px;
          background-color: #dfdfdf;
        }
      }
    }
  `,
};

export default React.memo(EmployeeCard);
