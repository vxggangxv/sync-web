import { createAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { all, takeLatest } from 'redux-saga/effects';
import { createFetchAction, createSaga, fetchInitialState, fetchReducerActions } from 'store/utils';

import { setAuthInHeader } from 'api/config/axiosUtils';
import storage, { keys } from 'lib/storage';
import { RootState } from 'store';
import * as unitApi from 'api/unit';

interface InitialState {
  unit: object | any;
  updateUnit: object | any;
  deleteUnit: object | any;
  unitAll: object | any;
}

export const fetch_unit = createFetchAction('fetch_unit');
export const update_unit = createFetchAction('update_unit');
export const delete_unit = createFetchAction('delete_unit');
export const fetch_unit_all = createFetchAction('fetch_unit_all');

const initialState: InitialState = {
  // NOTE: 최초 랜딩시 storage값 유무 확인
  unit: { ...fetchInitialState, data: null },
  updateUnit: { ...fetchInitialState, data: null },
  deleteUnit: { ...fetchInitialState, data: null },
  unitAll: { ...fetchInitialState, data: null },
};

const slice = createSlice({
  name: 'unit',
  initialState,
  reducers: {
    ...fetchReducerActions(fetch_unit, 'unit'),
    ...fetchReducerActions(update_unit, 'updateUnit'),
    ...fetchReducerActions(delete_unit, 'deleteUnit'),
    ...fetchReducerActions(fetch_unit_all, 'unitAll'),
  },
});

export const name = slice.name;
export const actions: any = slice.actions;

export function* unitSaga() {
  yield all([
    takeLatest(actions.fetch_unit_request, createSaga(actions, 'fetch_unit', unitApi.fetchUnit)),
    takeLatest(actions.update_unit_request, createSaga(actions, 'update_unit', unitApi.updateUnit)),
    takeLatest(actions.delete_unit_request, createSaga(actions, 'delete_unit', unitApi.deleteUnit)),
    takeLatest(
      actions.fetch_unit_all_request,
      createSaga(actions, 'fetch_unit_all', unitApi.fetchUnitAll),
    ),

    // takeEvery(actions.SIGNUP_SAGA.index, handleSignUp)
    // takeEvery(actions.SIGNIN_SAGA.index, handleSignIn),
    // takeEvery(actions.SIGNOUT_SAGA.index, handleSignOut),
  ]);
}

export default slice.reducer;
