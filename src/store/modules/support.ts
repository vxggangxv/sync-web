import { createAction, createSelector, createSlice } from '@reduxjs/toolkit';
import { all, takeLatest } from 'redux-saga/effects';
import { createFetchAction, createSaga, fetchInitialState, fetchReducerActions } from 'store/utils';

import { setAuthInHeader } from 'api/config/axiosUtils';
import storage, { keys } from 'lib/storage';
import { RootState } from 'store';
import * as supportApi from 'api/support';

interface InitialState {
  faqList: object | any;
  qnaList: object | any;
  updateQna: object | any;
  // unitAll: object | any;
}

export const fetch_faq_list = createFetchAction('fetch_faq_list');
export const fetch_qna_list = createFetchAction('fetch_qna_list');
export const update_qna = createFetchAction('update_qna');
// export const fetch_unit_all = createFetchAction('fetch_unit_all');

const initialState: InitialState = {
  // NOTE: 최초 랜딩시 storage값 유무 확인
  faqList: { ...fetchInitialState, data: null },
  qnaList: { ...fetchInitialState, data: null },
  updateQna: { ...fetchInitialState, data: null },
  // unitAll: { ...fetchInitialState, data: null },
};

const slice = createSlice({
  name: 'support',
  initialState,
  reducers: {
    ...fetchReducerActions(fetch_faq_list, 'faqList'),
    ...fetchReducerActions(fetch_qna_list, 'qnaList'),
    ...fetchReducerActions(update_qna, 'updateQna'),
    // ...fetchReducerActions(fetch_unit_all, 'unitAll'),
  },
});

export const name = slice.name;
export const actions: any = slice.actions;

export function* supportSaga() {
  yield all([
    takeLatest(
      actions.fetch_faq_list_request,
      createSaga(actions, 'fetch_faq_list', supportApi.fetchFaqList),
    ),
    takeLatest(
      actions.fetch_qna_list_request,
      createSaga(actions, 'fetch_qna_list', supportApi.fetchQnaList),
    ),
    takeLatest(actions.update_qna_request, createSaga(actions, 'update_qna', supportApi.updateQna)),
    // takeLatest(actions.update_qna_request, createSaga(actions, 'update_qna', supportApi.updateQna)),

    // takeLatest(actions.delete_unit_request, createSaga(actions, 'delete_unit', supportApi.deleteUnit)),

    // takeEvery(actions.SIGNUP_SAGA.index, handleSignUp)
    // takeEvery(actions.SIGNIN_SAGA.index, handleSignIn),
    // takeEvery(actions.SIGNOUT_SAGA.index, handleSignOut),
  ]);
}

export default slice.reducer;
