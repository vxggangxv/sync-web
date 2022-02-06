import { createAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { all, takeLatest } from 'redux-saga/effects';
import { createFetchAction, createSaga, fetchInitialState, fetchReducerActions } from 'store/utils';

import { setAuthInHeader } from 'api/config/axiosUtils';
import storage, { keys } from 'lib/storage';
import { RootState } from 'store';
import * as employeeApi from 'api/employee';

interface InitialState {
  employeeList: object | any;
  registerEmployee: object | any;
  updateEmployee: object | any;
  deleteEmployee: object | any;
}

export const fetch_employee_list = createFetchAction('fetch_employee_list');
export const register_employee = createFetchAction('register_employee');
export const update_employee = createFetchAction('update_employee');
export const delete_employee = createFetchAction('delete_employee');

const initialState: InitialState = {
  // NOTE: 최초 랜딩시 storage값 유무 확인
  employeeList: { ...fetchInitialState, data: null },
  registerEmployee: { ...fetchInitialState, data: null },
  updateEmployee: { ...fetchInitialState, data: null },
  deleteEmployee: { ...fetchInitialState, data: null },
};

const slice = createSlice({
  name: 'employee',
  initialState,
  reducers: {
    ...fetchReducerActions(fetch_employee_list, 'employeeList'),
    ...fetchReducerActions(register_employee, 'registerEmployee'),
    ...fetchReducerActions(update_employee, 'updateEmployee'),
    ...fetchReducerActions(delete_employee, 'deleteEmployee'),
  },
});

export const name = slice.name;
export const actions: any = slice.actions;

export function* employeeSaga() {
  yield all([
    takeLatest(
      actions.fetch_employee_list_request,
      createSaga(actions, 'fetch_employee_list', employeeApi.fetchEmployeeList),
    ),
    takeLatest(
      actions.register_employee_request,
      createSaga(actions, 'register_employee', employeeApi.registerEmployee),
    ),
    takeLatest(
      actions.update_employee_request,
      createSaga(actions, 'update_employee', employeeApi.updateEmployee),
    ),
    takeLatest(
      actions.delete_employee_request,
      createSaga(actions, 'delete_employee', employeeApi.deleteEmployee),
    ),

    // takeEvery(actions.SIGNUP_SAGA.index, handleSignUp)
    // takeEvery(actions.SIGNIN_SAGA.index, handleSignIn),
    // takeEvery(actions.SIGNOUT_SAGA.index, handleSignOut),
  ]);
}

export default slice.reducer;
