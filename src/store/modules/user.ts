import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import storage, { keys } from 'lib/storage';
import { createFetchAction, createSaga, fetchInitialState, fetchReducerActions } from 'store/utils';
import { all, takeLatest } from '@redux-saga/core/effects';
import * as userApi from 'api/user';

export const fetch_profile = createFetchAction('fetch_profile');

interface InitialState {
  user: string | null | any;
  fetchProfile: object | any;
}

const initialState: InitialState = {
  // 최초 랜딩시 storage값 유무 확인
  user: storage.get(keys.user) || null,
  fetchProfile: { ...fetchInitialState },
};

const slice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    set_user: (state, { payload }) => {
      console.log(payload, 'payload SET_USER');
      state.user = payload;
    },
    ...fetchReducerActions(fetch_profile, 'fetchProfile', {
      success(state: any, { payload }: PayloadAction<any>) {
        console.log('payload', payload);
        const profile = payload?.profile;
        if (profile) {
          state.user = { ...profile, company: profile.name };
          const {
            userGroupIdx,
            groupCode,
            syncUid,
            email,
            profileImg,
            name,
            countryId,
            accountType,
            currencyCode,
          } = profile;
          // accountType: 1
          // address: null
          // countryId: 116
          // email: "jun@doflab.com"
          // groupCode: "211104789766HPUIBJ"
          // name: "Jun"
          // phone: "1234"
          // phonecode: 116
          // profileImg: null
          // statesId: 1983
          // userGroupIdx: 36
          let userInfo = {
            userGroupIdx,
            groupCode,
            syncUid,
            profileImg,
            email,
            name,
            company: name,
            countryId,
            accountType,
            autoLogin: true,
            currencyCode,
          };
          storage.set(keys.user, userInfo);
        }
      },
    }),
  },
});

export const actions: any = slice.actions;

export function* userSaga() {
  yield all([
    takeLatest(
      actions.fetch_profile_request,
      createSaga(actions, 'fetch_profile', userApi.fetchProfile),
    ),
  ]);
}

export default slice.reducer;
