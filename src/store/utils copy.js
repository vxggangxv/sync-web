import { call, put } from 'redux-saga/effects';
import { createAction } from '@reduxjs/toolkit';
import { actions as appActions } from './modules/app';
import { ENV_MODE_DEV } from 'lib/setting';

export const fetchInitialState = {
  pending: null,
  success: null,
  failure: null,
};

export const fetchCurrentState = (state, currentState) => {
  if (currentState === 'init') {
    return (state = { ...fetchInitialState });
  }
  return (state = {
    ...fetchInitialState,
    [currentState]: true,
  });
};

export function createFetchAction(type) {
  const INIT = `${type}_init`;
  const REQUEST = `${type}_request`;
  const SUCCESS = `${type}_success`;
  const FAILURE = `${type}_failure`;

  return {
    // TYPE: type,
    // REQUEST,
    // SUCCESS,
    // FAILURE,
    init: createAction(INIT),
    request: createAction(REQUEST),
    success: createAction(SUCCESS),
    failure: createAction(FAILURE),
  };
}

export function fetchReducerActions(type, key, config = {}) {
  const { init = () => {}, pending = () => {}, success = () => {}, failure = () => {} } = config;
  const targetState = (str, obj, type, action) => {
    const splitArray = str.split('.');
    const targetState = str.split('.').reduce((a, c) => {
      if (splitArray[splitArray.length - 1] === c) {
        a[c] = {
          ...a[c],
          ...fetchCurrentState(a[c], type),
        };
        if (type === 'success') {
          a[c] = {
            ...a[c],
            ...fetchCurrentState(a[c], type),
            data: action.payload,
          };
        }
      }
      return a[c];
    }, obj);
    return targetState;
  };
  // console.log(key, 'key');
  // state[key] = {
  //   ...state[key],
  //   ...fetchCurrentState(state[key], 'init'),
  // };
  return {
    [type.init]: (state, action) => {
      targetState(key, state, 'init');
      init(state, action);
    },
    [type.request]: (state, action) => {
      targetState(key, state, 'pending');
      pending(state, action);
    },
    [type.success]: (state, action) => {
      targetState(key, state, 'success', action);
      success(state, action);
    },
    [type.failure]: (state, action) => {
      targetState(key, state, 'failure');
      failure(state, action);
    },
  };
}

export function createSaga(actions, key, req, config = {}) {
  const {
    apiLoading = true,
    isAlertSuccess = false,
    isAlertfailure = true,
    success = () => {},
    failure = () => {},
  } = config;
  // console.log(actions, 'actions');
  return function* ({ payload }) {
    // const payload = action?.payload;
    // console.log(payload, 'payload');
    if (apiLoading) yield put(appActions.set_api_calling_status());

    try {
      const { data } = yield call(req, payload);
      // console.log(data, 'data');
      yield put(actions[`${key}_success`](data));
      success();
      if (isAlertSuccess)
        yield put(appActions.show_toast({ type: 'success', content: 'Request Successed.' }));

      // TODO: 현재는 result가 1이 아닐경우도 error로 판별
      // if (data?.result == 1) {
      //   yield put(actions[`${key}_success`](data));
      //   success();
      //   if (isAlertSuccess)
      //     yield put(appActions.show_toast({ type: 'success', content: 'Request Successed.' }));
      // } else {
      //   yield put(actions[`${key}_failure`]({ isShow: isAlertfailure, msg: data?.msg }));
      //   failure();
      // }

      // 개발자용 redux console
      if (ENV_MODE_DEV) {
        console.group(`-- ${key}_request Redux saga`);
        console.log(` %cRequest Data :\n`, 'color:red;padding:5px;font-weight:bold', data?.payload);
        console.log(` %cResponse Data :\n`, 'color:red;padding:5px;font-weight:bold', data);
        console.groupEnd();
      }
    } catch (error) {
      yield put(actions[`${key}_failure`]({ isShow: isAlertfailure, msg: error?.message }));
      failure();

      // 실제 Error 발생시 확인
      console.group(`-- ${key}_request Redux saga error`);
      console.log(` %cPayload :\n`, 'color:red;padding:5px;font-weight:bold', error?.payload);
      console.log(` %cError :\n`, 'color:red;padding:5px;font-weight:bold', error);
      console.groupEnd();
    } finally {
      if (apiLoading) yield put(appActions.clear_api_calling_status());
      // TODO: 완료후 자동 init, 적용시 예외 key 적용 필요
      // const isExceptList = ['handleAutoLogin', 'handleUserInfo', 'handleIndicationFormat'];
      // const isExcept = isExceptList.some(item => item === tag);
      // if (!isExcept) yield put(actions[`${key}_init`]());
      // yield put(actions[`${key}_init`]());
    }
  };
}
