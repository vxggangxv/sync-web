import {
  CaseReducer,
  CaseReducerWithPrepare,
  createAction,
  createSelector,
  createSlice,
} from '@reduxjs/toolkit';
import { setAuthInHeader } from 'api/config/axiosUtils';
import storage, { deleteCookie, getCookie, keys } from 'lib/storage';
import { all, takeLatest } from 'redux-saga/effects';
import { RootState } from 'store';
import { createFetchAction, createSaga, fetchInitialState, fetchReducerActions } from 'store/utils';
import * as authApi from 'api/auth';
import { any } from 'prop-types';
import { AuthActions, UserActions } from 'store/actionCreators';

// auth
export const sign_in_auth = createFetchAction('sign_in_auth');
export const sign_up_auth = createFetchAction('sign_up_auth');
export const edit_legal_agreement = createFetchAction('edit_legal_agreement');
export const edit_auth_profile = createFetchAction('edit_auth_profile');
export const edit_auth_password = createFetchAction('edit_auth_password');

export const accessToken = storage.get(keys.user)?.autoLogin
  ? getCookie(keys.remember_user_token)
  : getCookie(keys.sign_in_token) || null;

interface InitialState {
  accessToken: string | any;
  recentLogin: string[] | any;
  signUp: object | any;
  signIn: object | any;
  signOut: object | any;
  signInAuth: object | any;
  signUpAuth: object | any;
  editLegalAgreement: object | any;
  editAuthProfile: object | any;
  editAuthPassword: object | any;
}

const initialState: InitialState = {
  // NOTE: 최초 랜딩시 storage값 유무 확인
  accessToken,
  recentLogin: getCookie(keys.resent_login)?.split(',') || [],
  // privateSocket: null,
  signUp: { ...fetchInitialState },
  signIn: { ...fetchInitialState },
  signOut: { ...fetchInitialState },
  signInAuth: { ...fetchInitialState },
  signUpAuth: { ...fetchInitialState },
  editLegalAgreement: { ...fetchInitialState },
  editAuthProfile: { ...fetchInitialState },
  editAuthPassword: { ...fetchInitialState },
};

const slice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    set_access_token: (state, { payload }) => {
      // console.log('set_access_token', payload);
      state.accessToken = payload;
      setAuthInHeader(payload);
    },
    sign_up: () => {},
    sign_in: (state, { payload }) => {
      // DEBUG: 백엔드 연결 후 테스트 필요
      // console.log(payload, 'payload signIn');
      // const { token, user } = payload;
      // if (!token) return;
      // state.accessToken = token;
      // setAuthInHeader(token);
      // storage.set(keys.token, token);
      // storage.set(keys.user, user);
    },
    sign_out: (state, { payload }) => {
      // DEBUG: 백엔드 연결 후 테스트 필요
      // state.accessToken = null;
      // setAuthInHeader(null);
      // // storage.clear();
      // storage.remove(keys.token);
      // storage.remove(keys.user);
      // storage.remove(`persist:${keys.persist}`);
      // sessionStorage.removeItem(`persist:${keys.persist}`);
    },
    //
    ...fetchReducerActions(sign_in_auth, 'signInAuth'),
    ...fetchReducerActions(sign_up_auth, 'signUpAuth'),
    ...fetchReducerActions(edit_legal_agreement, 'editLegalAgreement'),
    ...fetchReducerActions(edit_auth_profile, 'editAuthProfile'),
    ...fetchReducerActions(edit_auth_password, 'editAuthPassword'),
  },
});

export const name = slice.name;
export const actions: any = slice.actions;

// createSelector
export const accessTokenSelector = (state: RootState) => state.auth.accessToken;
export const isAuthenticatedSelector = createSelector(accessTokenSelector, item => !!item);
export const logInSelector = (state: RootState) => ({
  accessToken: state.auth.accessToken,
  user: state.user.user,
});
export const isLogInSelector = createSelector(logInSelector, item => {
  return !!item.accessToken && !!item.user;
});

export function signOut() {
  deleteCookie(keys.sign_in_token);
  deleteCookie(keys.remember_user_token);
  storage.remove(keys.user);
  UserActions.set_user(null);
  AuthActions.accessToken = null;
  // persist 삭제
  storage.remove(`persist:${keys.persist}`);
  sessionStorage.removeItem(`persist:${keys.persist}`);
}

// function* handleSignUp (action) {}

// function* handleSignIn (action) {}

// function* handleSignOut (action) {}

export function* authSaga() {
  yield all([
    takeLatest(
      actions.sign_in_auth_request,
      createSaga(actions, 'sign_in_auth', authApi.signInAuth),
    ),
    takeLatest(
      actions.sign_up_auth_request,
      createSaga(actions, 'sign_up_auth', authApi.signUpAuth),
    ),
    takeLatest(
      actions.edit_legal_agreement_request,
      createSaga(actions, 'edit_legal_agreement', authApi.editLegalAgreement),
    ),
    takeLatest(
      actions.edit_auth_profile_request,
      createSaga(actions, 'edit_auth_profile', authApi.editAuthProfile),
    ),
    takeLatest(
      actions.edit_auth_password_request,
      createSaga(actions, 'edit_auth_password', authApi.editAuthPassword),
    ),
  ]);
}

export default slice.reducer;
