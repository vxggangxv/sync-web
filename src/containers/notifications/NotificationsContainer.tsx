import React, { useContext, useEffect, useMemo } from 'react';
import styled from 'styled-components';
import Notifications from 'components/notifications/Notifications';
import useInput from 'lib/hooks/useInput';
import useDateInput from 'lib/hooks/useDateInput';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';
import { useDidUpdateEffect } from 'lib/utils';
import { NotificationActions } from 'store/actionCreators';
import { useShallowAppSelector } from 'store/hooks';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import { PrivateSocketContext } from 'contexts/PrivateSocketContext';

export default function NotificationsContainer() {
  const {
    notificationsData,
    fetchNotificationsSuccess,
    readNotificationsSuccess,
    deleteNotificationsSuccess,
  } = useShallowAppSelector(state => ({
    notificationsData: state.notification.notifications.data,
    fetchNotificationsSuccess: state.notification.notifications.success,
    readNotificationsSuccess: state.notification.readNotifications.success,
    deleteNotificationsSuccess: state.notification.deleteNotifications.success,
  }));
  const notificationList = notificationsData?.list;
  const pagingData = notificationsData?.pagingData;
  const page = useInput(1);
  const period = useDateInput(null);
  const keyword = useInput('');
  const checkedNotifications = useCheckSetInput(new Set([]));
  const { isChangeNewEvents } = useContext(PrivateSocketContext);

  let searchParams = useMemo(
    () => ({
      page: page.value,
      searchStartTime: period.value ? period.value[0].unix() : null,
      searchEndTime: period.value ? period.value[1].unix() : null,
      keyword: keyword.value || null,
    }),
    [page.value, period.value, keyword.value],
  );

  // SECTION: function
  const handleRead = () => {
    if (!checkedNotifications.value.size) return;
    NotificationActions.read_notifications_request({
      notificationIdArr: [...checkedNotifications.value],
    });
  };
  const handleDelete = () => {
    if (!checkedNotifications.value.size) return;
    NotificationActions.delete_notifications_request({
      notificationIdArr: [...checkedNotifications.value],
    });
  };
  const handleSearch = () => {
    console.log(searchParams);
  };

  const handleChangePage = (value: number) => {
    // TODO: request api
    // get notification list
    // { ...searchParams, page: 1}
    NotificationActions.fetch_notifications_request({ ...searchParams, page: value });
    console.log('get notification list page is', value);
    page.setValue(value);
  };

  // SECTION: DidMount
  useEffect(() => {
    NotificationActions.fetch_notifications_request(searchParams);
  }, []);

  // SECTION: DidUpdate
  useDidUpdateEffect(() => {
    // TODO: request api
    // get notification list
    // { ...searchParams, page: 1}
    NotificationActions.fetch_notifications_request({ ...searchParams, page: 1 });
    page.setValue(1);
  }, [period.value]);

  useDidUpdateEffect(() => {
    if (readNotificationsSuccess || deleteNotificationsSuccess) {
      NotificationActions.fetch_notifications_request({ ...searchParams });
      checkedNotifications.setValue(new Set([]));
    }
  }, [!!readNotificationsSuccess, !!deleteNotificationsSuccess]);

  // notification페이지에서 socket notification이 발생했을 경우 fetch요청
  // useDidUpdateEffect(() => {
  //   if (isChangeNewEvents) {
  //     EventActions.fetch_events_request(searchParams);
  //     isChangeNewEvents.setValue(false);
  //   }
  // }, [isChangeNewEvents]);

  // TEST:
  // useEffect(() => {
  //   console.log('fetchNotificationsSuccess', fetchNotificationsSuccess);
  // }, [fetchNotificationsSuccess]);
  const { isFetchSuccess } = useFetchLoading({ fetchNotificationsSuccess });
  // useEffect(() => {
  //   console.log('isFetchSuccess', isFetchSuccess);
  // }, [isFetchSuccess]);
  if (!isFetchSuccess) return null;

  return (
    <Notifications
      notificationList={notificationList}
      pagingData={pagingData}
      page={page}
      period={period}
      keyword={keyword}
      checkedNotifications={checkedNotifications}
      onSearch={handleSearch}
      onRead={handleRead}
      onDelete={handleDelete}
      onChangePage={handleChangePage}
    />
  );
}
