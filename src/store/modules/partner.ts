import { put, all, takeLatest } from 'redux-saga/effects';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchReducerActions, createFetchAction, createSaga, fetchInitialState } from 'store/utils';
import * as partnerApi from 'api/partner';
import { PartnerActions, AppActions } from 'store/actionCreators';

export const fetch_main_partners = createFetchAction('fetch_main_partners');
export const fetch_project_partners = createFetchAction('fetch_project_partners');
export const fetch_sync_partners = createFetchAction('fetch_sync_partners');
export const fetch_partner_list = createFetchAction('fetch_partner_list');
export const fetch_partner_request_list = createFetchAction('fetch_partner_request_list');
export const fetch_partner_receive_requested_list = createFetchAction(
  'fetch_partner_receive_requested_list',
);
export const fetch_partner_receive_requested_one = createFetchAction(
  'fetch_partner_receive_requested_one',
);
export const answer_receive_requested = createFetchAction('answer_receive_requested');
export const fetch_partner_search = createFetchAction('fetch_partner_search');
export const fetch_partner_detail = createFetchAction('fetch_partner_detail');
export const register_new_partner = createFetchAction('register_new_partner');
export const cancel_request_partnership = createFetchAction('cancel_request_partnership');
export const register_new_menual_partner = createFetchAction('register_new_menual_partner');
export const edit_partner_info = createFetchAction('edit_partner_info');
export const delete_partner = createFetchAction('delete_partner');
export const fetch_partner_code_search = createFetchAction('fetch_partner_code_search');

interface InitialState {
  mainPartners: object | any;
  projectPartners: object | any;
  syncPartners: object | any;
  partnerList: object | any;
  partnerRequestList: object | any;
  partnerReceiveRequestedList: object | any;
  partnerReceiveRequestedOne: object | any;
  answerReceiveRequested: object | any;
  partnerSearch: object | any;
  partnerDetail: object | any;
  newPartner: object | any;
  cancelRequestPartner: object | any;
  newMenualPartner: object | any;
  editPartnerInfo: object | any;
  deletePartner: object | any;
  partnerCodeSearch: object | any;
}

const initialState: InitialState = {
  mainPartners: { ...fetchInitialState, data: null },
  projectPartners: { ...fetchInitialState, data: null },
  syncPartners: { ...fetchInitialState, data: null },
  partnerList: { ...fetchInitialState, data: null },
  partnerRequestList: { ...fetchInitialState, data: null },
  partnerReceiveRequestedList: { ...fetchInitialState, data: null },
  partnerReceiveRequestedOne: { ...fetchInitialState, data: null },
  answerReceiveRequested: { ...fetchInitialState, data: null },
  partnerSearch: { ...fetchInitialState, data: null },
  partnerDetail: { ...fetchInitialState, data: null },
  newPartner: { ...fetchInitialState, data: null },
  cancelRequestPartner: { ...fetchInitialState, data: null },
  newMenualPartner: { ...fetchInitialState, data: null },
  editPartnerInfo: { ...fetchInitialState, data: null },
  deletePartner: { ...fetchInitialState, data: null },
  partnerCodeSearch: { ...fetchInitialState, data: null },
};

const slice = createSlice({
  name: 'partner',
  initialState,
  reducers: {
    ...fetchReducerActions(fetch_main_partners, 'mainPartners'),
    ...fetchReducerActions(fetch_project_partners, 'projectPartners'),
    ...fetchReducerActions(fetch_sync_partners, 'syncPartners'),
    ...fetchReducerActions(fetch_partner_list, 'partnerList'),
    ...fetchReducerActions(fetch_partner_request_list, 'partnerRequestList'),
    ...fetchReducerActions(fetch_partner_receive_requested_list, 'partnerReceiveRequestedList'),
    ...fetchReducerActions(fetch_partner_receive_requested_one, 'partnerReceiveRequestedOne'),
    ...fetchReducerActions(answer_receive_requested, 'answerReceiveRequested'),
    ...fetchReducerActions(fetch_partner_search, 'partnerSearch'),
    ...fetchReducerActions(fetch_partner_detail, 'partnerDetail'),
    ...fetchReducerActions(register_new_partner, 'newPartner'),
    ...fetchReducerActions(cancel_request_partnership, 'cancelRequestPartner'),
    ...fetchReducerActions(register_new_menual_partner, 'newMenualPartner'),
    ...fetchReducerActions(edit_partner_info, 'editPartnerInfo'),
    ...fetchReducerActions(delete_partner, 'deletePartner'),
    ...fetchReducerActions(fetch_partner_code_search, 'partnerCodeSearch'),
  },
});

export const actions: any = slice.actions;

export function* partnerSaga() {
  yield all([
    takeLatest(
      actions.fetch_main_partners_request,
      createSaga(actions, 'fetch_main_partners', partnerApi.fetchMainPartners, {
        isApiLoading: false,
      }),
    ),
    takeLatest(
      actions.fetch_project_partners_request,
      createSaga(actions, 'fetch_project_partners', partnerApi.fetchProjectPartners, {
        isApiLoading: false,
      }),
    ),
    takeLatest(
      actions.fetch_sync_partners_request,
      createSaga(actions, 'fetch_sync_partners', partnerApi.fetchSyncPartners, {
        isApiLoading: false,
      }),
    ),
    takeLatest(
      actions.fetch_partner_list_request,
      createSaga(actions, 'fetch_partner_list', partnerApi.fetchPartnerList),
    ),
    takeLatest(
      actions.edit_partner_info_request,
      createSaga(actions, 'edit_partner_info', partnerApi.editPartnerInfo),
    ),
    takeLatest(
      actions.delete_partner_request,
      createSaga(actions, 'delete_partner', partnerApi.deletePartner),
    ),

    takeLatest(
      actions.fetch_partner_request_list_request,
      createSaga(actions, 'fetch_partner_request_list', partnerApi.fetchPartnerRequestList),
    ),
    takeLatest(
      actions.fetch_partner_receive_requested_list_request,
      createSaga(
        actions,
        'fetch_partner_receive_requested_list',
        partnerApi.fetchPartnerReceiveRequestedList,
      ),
    ),
    takeLatest(
      // 삭제 예정
      actions.fetch_partner_receive_requested_one_request,
      createSaga(
        actions,
        'fetch_partner_receive_requested_one',
        partnerApi.fetchPartnerReceiveRequestedOne,
      ),
    ),
    takeLatest(
      actions.fetch_partner_code_search_request,
      createSaga(actions, 'fetch_partner_code_search', partnerApi.fetchPartnerCodeSearch),
    ),
    takeLatest(
      actions.answer_receive_requested_request,
      createSaga(actions, 'answer_receive_requested', partnerApi.answerReceiveRequested),
    ),
    takeLatest(
      actions.fetch_partner_search_request,
      createSaga(actions, 'fetch_partner_search', partnerApi.fetchPartnerSearch),
    ),
    takeLatest(
      actions.fetch_partner_detail_request,
      createSaga(actions, 'fetch_partner_detail', partnerApi.fetchPartnerDetail),
    ),
    takeLatest(
      actions.register_new_partner_request,
      createSaga(actions, 'register_new_partner', partnerApi.registerNewPartner),
    ),
    takeLatest(
      actions.cancel_request_partnership_request,
      createSaga(actions, 'cancel_request_partnership', partnerApi.cancelRequestPartnerShip),
    ),
    takeLatest(
      actions.register_new_menual_partner_request,
      createSaga(actions, 'register_new_menual_partner', partnerApi.registerNewMenualPartner),
    ),
  ]);
}

export default slice.reducer;
