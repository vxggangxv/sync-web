import { put, all } from 'redux-saga/effects';
import { createAction, createSlice } from '@reduxjs/toolkit';

interface InitialState {
  responseStatus: number | null;
  responseError: object | any;
  language: string;
}

const initialState: InitialState = {
  // router에 error 연결(e.g serverError : 500)
  responseStatus: null,
  // responseStatus: 401,
  // TODO: 차후 error toasty또는 popup과 연결 예정
  responseError: {
    isShow: false,
    message: null,
    data: null,
  },
  language: 'en',
  // language: 'ko',
};

// 팝업 아이디로 사용한다
let _pid = 0;

const slice = createSlice({
  name: 'base',
  initialState,
  reducers: {
    response_status: (state, { payload }) => {
      // DEBUG: 필요
      state.responseStatus = payload;
    },
    response_error: (state, { payload }) => {
      // DEBUG: 필요
      state.responseError.message = payload.message;
      state.responseError.data = payload;
    },
    language_change: (state, { payload }) => {
      state.language = payload;
    },
  },
});

export const actions = slice.actions;

// saga
export function* baseSaga() {
  yield all([]);
}

export default slice.reducer;
