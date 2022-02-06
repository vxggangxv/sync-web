import { icon_alert_bubble, icon_magnifier } from 'components/base/images';
import MuiPagination from 'components/common/pagination/MuiPagination';
import CustomSpan from 'components/common/text/CustomSpan';
import React, { useState } from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import cx from 'classnames';
import CustomDatePicker from 'components/common/input/CustomDatePicker';
import MuiWrapper from 'components/common/input/MuiWrapper';
import { Grid, TextField } from '@material-ui/core';
import CustomMuiCheckbox from 'components/common/checkbox/CustomMuiCheckbox';
import useRadioInput from 'lib/hooks/useRadioInput';
import useCheckOneInput from 'lib/hooks/useCheckOneInput';
import { useTranslation } from 'react-i18next';
import moment from 'moment';
import MuiButton from 'components/common/button/MuiButton';
import { useDidUpdateEffect } from 'lib/utils';

interface Notification {
  category: string;
  enrollDate: number;
  fromEmail: string;
  fromName: string;
  isRead: number; // 0, 1
  modifyDate: number | null; // unixstamp, null
  title: string;
  type: string;
  _id: string;
}

interface NotificationsProps {
  notificationList: Notification[];
  pagingData: object | any;
  page: { value: number; onChange: (e: any) => void; setValue: React.Dispatch<number> };
  period: { value: Date | null; onChange: (e: any) => void; setValue: React.Dispatch<Date> };
  keyword: { value: string; onChange: (e: any) => void; setValue: React.Dispatch<string> };
  checkedNotifications: { value: any; onChange: (e: any) => void; setValue: React.Dispatch<any> };
  onSearch: () => void;
  onRead: () => void;
  onDelete: () => void;
  onChangePage: (value: number) => void;
}

const Notifications = ({
  notificationList,
  pagingData,
  page,
  period,
  keyword,
  checkedNotifications,
  onSearch,
  onRead,
  onDelete,
  onChangePage,
}: NotificationsProps) => {
  // TODO: list _id parsing, return item._id
  // const listIdData = Array.from({ length: 10 }).map((item, idx) => idx);
  const listIdData = notificationList?.map(item => item._id) || [];

  const checkedNotificationsAll = useCheckOneInput(false);
  const { t } = useTranslation();

  // SECTION: function
  const handleCheckNotificationsAll = (e: any) => {
    const checkedValue = e.target.checked;
    checkedNotificationsAll.onChange(e);

    if (checkedValue) {
      // TODO: pasing id list
      checkedNotifications.setValue(new Set([...listIdData]));
    } else {
      checkedNotifications.setValue(new Set([]));
    }
  };

  // SECTION: DidUpdate
  // 리스트 체크박스 변경 됐을 경우 checkAll 변경, if check all
  useDidUpdateEffect(() => {
    if (
      [...checkedNotifications.value].length &&
      [...checkedNotifications.value].length === notificationList.length
    ) {
      checkedNotificationsAll.setValue(true);
    } else {
      checkedNotificationsAll.setValue(false);
    }
  }, [checkedNotifications.value]);

  return (
    <StyledNotifications data-component-name="Notifications">
      <div className="notifications__title_container">
        <div className="notifications__title_box">
          <img src={icon_alert_bubble} alt="dollar icon" width={60} />
          <h2>
            <CustomSpan fontSize={26} fontWeight={500}>
              Notifications
            </CustomSpan>
          </h2>
        </div>
        <div className="notifications__title_btn_box">
          <MuiButton
            config={{
              width: 130,
            }}
            className="notifications__new_invoice_btn md "
            variant="outlined"
            color="primary"
            onClick={onRead}
          >
            Read
          </MuiButton>
          <MuiButton
            config={{
              width: 130,
            }}
            className="notifications__new_invoice_btn md "
            variant="outlined"
            color="primary"
            onClick={onDelete}
          >
            Delete
          </MuiButton>
        </div>
      </div>

      <div className="notifications__content_container">
        <div className="notifications__filter_box">
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
          <MuiWrapper
            className="notifications__search_wrapper sm"
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
                placeholder="Search..."
                value={keyword.value || ''}
                onChange={keyword.onChange}
                onKeyPress={e => e.key === 'Enter' && onSearch()}
              />
              <button className="btn-reset notifications__search_btn" onClick={onSearch}>
                <img src={icon_magnifier} alt="search" />
              </button>
            </>
          </MuiWrapper>
        </div>

        <div className="notifications__table_container">
          <table className="notifications__table">
            <colgroup>
              <col />
              <col />
              <col />
              <col />
              <col />
              <col />
              <col />
            </colgroup>

            <thead>
              <tr>
                <th>
                  <CustomMuiCheckbox
                    checked={checkedNotificationsAll.value}
                    onChange={handleCheckNotificationsAll}
                    padding={0}
                  />
                </th>
                <th>
                  <CustomSpan fontColor={color.gray_week}>No.</CustomSpan>
                </th>
                <th></th>
                <th>Email</th>
                <th>Name</th>
                <th>Content</th>
                <th>Date</th>
              </tr>
            </thead>

            <tbody>
              {!!notificationList?.length &&
                notificationList.map((item, idx) => (
                  <tr key={item._id} className={cx({ unactive: item.isRead })}>
                    <td>
                      <CustomMuiCheckbox
                        checked={checkedNotifications.value.has(item._id)}
                        onChange={() => checkedNotifications.onChange({ value: item._id })}
                        padding={0}
                      />
                    </td>
                    <td>
                      <CustomSpan fontColor={color.gray_week}>{idx + 1}</CustomSpan>
                    </td>
                    <td>mark</td>
                    <td>{item.fromEmail}</td>
                    <td>{item.fromName}</td>
                    <td>
                      <Grid container alignItems="center" justifyContent="space-between">
                        <Grid item xs={10}>
                          {t(`NOTIFICATION_EVENT_TYPE_${item.type}`)}
                        </Grid>
                        <Grid item xs={2}>
                          <MuiButton
                            config={{
                              width: 130,
                            }}
                            className="notifications__new_invoice_btn sm"
                            variant="outlined"
                            color="primary"
                            // onClick={onDelete}
                          >
                            Accept
                          </MuiButton>
                        </Grid>
                      </Grid>
                    </td>
                    <td>
                      <CustomSpan fontColor={color.gray_week}>
                        {moment(moment.unix(item.enrollDate)).format('YY.MM.DD HH:mm')}
                      </CustomSpan>
                    </td>
                  </tr>
                ))}
              {/* {Array.from({ length: 10 }).map((item, idx) => (
                // <tr key={item._id} className={cx({unactive: !!item.isRead})}>
                <tr key={idx} className={cx({ unactive: true })}>
                  <td>
                    <CustomMuiCheckbox
                      checked={checkedNotifications.value.has(idx)}
                      onChange={() => checkedNotifications.onChange({ value: idx })}
                      padding={0}
                    />
                  </td>
                  <td>
                    <CustomSpan fontColor={color.gray_week}>{idx + 1}</CustomSpan>
                  </td>
                  <td>mark</td>
                  <td>20210715-XXXX-XXXX</td>
                  <td>웃는내일치과</td>
                  <td>
                    item . notificationTitle
                  </td>
                  <td>
                    <CustomSpan fontColor={color.gray_week}>
                      {moment().format('YY.MM.DD HH:mm')}
                    </CustomSpan>
                  </td>
                </tr>
              ))} */}
            </tbody>
          </table>

          <MuiPagination
            config={{
              justifyContent: 'center',
            }}
            count={pagingData?.totalPage}
            // count={5}
            page={page.value}
            onChange={(e: any, value: number) => onChangePage(value)}
          />
        </div>
      </div>
    </StyledNotifications>
  );
};

const StyledNotifications = styled.div`
  margin-bottom: 100px;
  padding: 40px 0 50px;
  height: 100%;
  background-color: white;
  border-radius: 15px;
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.16);

  .notifications__title_container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 30px;

    .notifications__title_box {
      display: flex;
      align-items: center;
      img {
        margin-right: 30px;
      }
    }
    .notifications__title_btn_box {
      button + button {
        margin-left: 15px;
      }
    }
  }

  .notifications__content_container {
    margin-top: 50px;
    padding: 0 30px;

    .notifications__filter_box {
      display: flex;
      column-gap: 15px;

      .datePicker__box {
        width: 225px;
        .ant-picker-input {
          width: 65px;
        }
      }

      .notifications__search_wrapper {
        position: relative;
        width: 350px;
        .MuiInputBase-root {
          background-color: #f4f5fa;
        }
        .notifications__search_btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: 0;
          top: 0;
          width: 32px;
          height: 32px;
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
          background-color: ${color.navy_blue};
          img {
            width: 18px;
          }
        }
      }
    }

    .notifications__table_container {
      margin-top: 20px;

      .muiPagination {
        margin-top: 30px;
      }

      .notifications__table {
        width: 100%;
        table-layout: fixed;

        col {
          &:nth-child(1) {
            width: 4%;
          }
          &:nth-child(2) {
            width: 4%;
          }
          &:nth-child(3) {
            width: 5%;
          }
          &:nth-child(4) {
            width: 13%;
          }
          &:nth-child(5) {
            width: 14%;
          }
          &:nth-child(6) {
            width: 65%;
          }
          &:nth-child(7) {
            width: 10%;
          }
        }

        th,
        td {
          padding: 0 10px;
          vertical-align: middle;
          text-align: left;
          white-space: nowrap;
          text-overflow: ellipsis;
          overflow: hidden;
          &:nth-child(1),
          &:nth-child(2),
          &:nth-child(3),
          &:nth-child(7) {
            text-align: center;
          }
          /* &:nth-child(5),
          &:nth-child(6) {
            text-align: left;
            text-overflow: ellipsis;
            white-space: nowrap;
            overflow: hidden;
          } */
        }
        th {
          background-color: #f4f5fa;
          font-size: 15px;
          font-weight: 500;

          &:first-child {
            border-top-left-radius: 5px;
            border-bottom-left-radius: 5px;
          }
          &:last-child {
            border-top-right-radius: 5px;
            border-bottom-right-radius: 5px;
          }
        }
        td {
          font-size: 13px;
        }

        tr {
        }

        thead {
          tr {
            height: 40px;
          }
        }
        tbody {
          tr {
            height: 60px;
            &.unactive {
              background-color: #f0f0f0;
            }
          }
        }
      }
    }
  }
`;

export default React.memo(Notifications);
