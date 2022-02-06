import { put, all, takeLatest } from 'redux-saga/effects';
import { createSlice } from '@reduxjs/toolkit';
import { fetchReducerActions, createFetchAction, createSaga, fetchInitialState } from 'store/utils';
import * as notificationApi from 'api/notification';

export const fetch_new_notifications = createFetchAction('fetch_new_notifications');
export const fetch_official_notifications = createFetchAction('fetch_official_notifications');
export const fetch_main_notifications = createFetchAction('fetch_main_notifications');
export const fetch_notifications = createFetchAction('fetch_notifications');
export const read_notifications = createFetchAction('read_notifications');
export const delete_notifications = createFetchAction('delete_notifications');

interface InitialState {
  newNotifications: object | any;
  officialNotifications: object | any;
  mainNotifications: object | any;
  notifications: object | any;
  readNotifications: object | any;
  deleteNotifications: object | any;
}

const initialState: InitialState = {
  newNotifications: { ...fetchInitialState, data: null },
  officialNotifications: { ...fetchInitialState, data: null },
  mainNotifications: { ...fetchInitialState, data: null },
  notifications: { ...fetchInitialState, data: null },
  readNotifications: { ...fetchInitialState },
  deleteNotifications: { ...fetchInitialState },
};

const slice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    ...fetchReducerActions(fetch_new_notifications, 'newNotifications'),
    ...fetchReducerActions(fetch_official_notifications, 'officialNotifications'),
    ...fetchReducerActions(fetch_main_notifications, 'mainNotifications'),
    ...fetchReducerActions(fetch_notifications, 'notifications'),
    ...fetchReducerActions(read_notifications, 'readNotifications'),
    ...fetchReducerActions(delete_notifications, 'deleteNotifications'),
  },
});

export const actions: any = slice.actions;

export function* notificationSaga() {
  yield all([
    takeLatest(
      actions.fetch_new_notifications_request,
      createSaga(actions, 'fetch_new_notifications', notificationApi.fetchNewNotificationsCount),
    ),
    takeLatest(
      actions.fetch_official_notifications_request,
      createSaga(
        actions,
        'fetch_official_notifications',
        notificationApi.fetchOfficialNotifications,
      ),
    ),
    takeLatest(
      actions.fetch_main_notifications_request,
      createSaga(actions, 'fetch_main_notifications', notificationApi.fetchMainNotifications, {
        isApiLoading: false,
      }),
    ),
    takeLatest(
      actions.fetch_notifications_request,
      createSaga(actions, 'fetch_notifications', notificationApi.fetchNotifications),
    ),
    takeLatest(
      actions.read_notifications_request,
      createSaga(actions, 'read_notifications', notificationApi.readNotifications),
    ),
    takeLatest(
      actions.delete_notifications_request,
      createSaga(actions, 'delete_notifications', notificationApi.deleteNotifications),
    ),
  ]);
}

export default slice.reducer;
