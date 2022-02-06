import { call, put } from 'redux-saga/effects';
import { CaseReducer, createAction } from '@reduxjs/toolkit';
import { actions as appActions } from './modules/app';
import { ENV_MODE_DEV } from 'lib/setting';
import axios, { Method } from 'axios';
import { AppActions } from 'store/actionCreators';
// import { AppActions, AuthActions, UserActions } from 'store/actionCreators';
// import storage, { deleteCookie, getCookie, keys, setCookie, setSessionCookie } from 'lib/storage';
// @ts-ignore
import { v4 as uuid } from 'uuid';
import fileDownload from 'js-file-download';

export interface ResponseGenerator {
  config?: any;
  data?: any;
  headers?: any;
  request?: any;
  status?: number;
  statusText?: string;
}

export const fetchInitialState = {
  pending: null,
  success: null,
  failure: null,
};

export const fetchCurrentState = (state = {}, currentState = '') => {
  if (currentState === 'init') {
    return (state = { ...fetchInitialState });
  }
  return (state = {
    ...fetchInitialState,
    [currentState]: true,
  });
};

export function createFetchAction(type = '') {
  const INIT = `${type}_init`;
  const REQUEST = `${type}_request`;
  const SUCCESS = `${type}_success`;
  const FAILURE = `${type}_failure`;
  const CLEAR = `${type}_clear`;

  return {
    // TYPE: type,
    // REQUEST,
    // SUCCESS,
    // FAILURE,
    init: createAction(INIT),
    request: createAction(REQUEST),
    success: createAction(SUCCESS),
    failure: createAction(FAILURE),
    clear: createAction(CLEAR),
  };
}

interface Config {
  init?: CaseReducer;
  pending?: CaseReducer;
  success?: CaseReducer;
  failure?: CaseReducer;
}
interface FetchReducerActions {
  [key: string]: CaseReducer;
}
export function fetchReducerActions(
  type: object | any,
  key = '',
  config = {},
  isRestful = false, // data를 store module파일에서 관리하고 싶을 경우.
): FetchReducerActions {
  const { init, pending, success, failure } = config as Config;
  const targetState = (str = '', obj = {}, type = '', action: object | any = {}) => {
    const splitArray = str.split('.');
    const targetState = str.split('.').reduce((a: object | any, c) => {
      if (splitArray[splitArray.length - 1] === c) {
        a[c] = {
          ...a[c],
          ...fetchCurrentState(a[c], type),
        };
        if (type === 'success') {
          a[c] = {
            ...a[c],
            data: action?.payload,
            error: null,
          };
        }
        if (type === 'failure') {
          a[c] = {
            ...a[c],
            data: null,
            error: action?.payload,
          };
        }
        // clear : data null 만드는 함수
        if (type === 'clear') {
          a[c] = {
            ...a[c],
            data: null,
            error: null,
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
      if (init) init(state, action);
    },
    [type.request]: (state, action) => {
      targetState(key, state, 'pending');
      if (pending) pending(state, action);
    },
    [type.success]: (state, action) => {
      if (isRestful) {
        targetState(key, state, 'success');
      } else {
        targetState(key, state, 'success', action);
      }
      // targetState(key, state, 'success', action);
      if (success) success(state, action);
    },
    [type.failure]: (state, action) => {
      targetState(key, state, 'failure', action);
      if (failure) failure(state, action);
    },
    [type.clear]: (state, action) => {
      targetState(key, state, 'clear');
      // clear(state, action);
      // common(state, action);
    },
  };
}

export function createSaga(actions: any, key: string, req: any, config = {}) {
  const {
    isApiLoading = true,
    isAlertSuccess = false,
    isAlertfailure = true,
    success = () => {},
    failure = () => {},
  } = config as {
    isApiLoading?: boolean;
    isAlertSuccess?: boolean;
    isAlertfailure?: boolean;
    success?: (data: any) => void;
    failure?: (error: any) => void;
  };
  // console.log(actions, 'actions');
  return function* ({ payload }: any) {
    // const payload = action?.payload;
    // console.log(payload, 'payload');
    if (isApiLoading) yield put(appActions.set_api_calling_status());

    try {
      const response: ResponseGenerator = yield call(req, payload);
      let data = response.data;
      const responseStatus = data?.status || response.status;
      data.status = responseStatus;

      yield put(actions[`${key}_success`](data));
      if (success) success(data);
      if (isAlertSuccess)
        yield put(appActions.show_toast({ type: 'success', message: 'Request Successed.' }));

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
      yield put(
        actions[`${key}_failure`]({
          isShow: isAlertfailure,
          message: (error as { message: string })?.message,
        }),
      );
      if (failure) failure(error);

      // 실제 Error 발생시 확인
      console.group(`-- ${key}_request Redux saga error`);
      // @ts-ignore
      console.log(` %cPayload :\n`, 'color:red;padding:5px;font-weight:bold', error?.payload);
      console.log(` %cError :\n`, 'color:red;padding:5px;font-weight:bold', error);
      console.groupEnd();
    } finally {
      if (isApiLoading) yield put(appActions.clear_api_calling_status());
      // TODO: 완료후 자동 init, 적용시 예외 key 적용 필요
      // const isExceptList = ['handleAutoLogin', 'handleUserInfo', 'handleIndicationFormat'];
      // const isExcept = isExceptList.some(item => item === tag);
      // if (!isExcept) yield put(actions[`${key}_init`]());
      yield put(actions[`${key}_init`]());
    }
  };
}

// 업로드 Progress 표시
export async function uploadFileProgress(props: any) {
  const {
    id: idProp = '',
    file = null,
    url = '',
    method = '',
    formPayload = null,
    config = {},
    success = () => {},
    failure = () => {},
    finish = () => {},
  } = props;
  const id = idProp || uuid();
  console.log('uploadFileProgress config', config);
  console.log('uploadFileProgress formPayload', formPayload);

  try {
    AppActions.add_upload_file_progress({ id, file, progress: 0, status: 0 });
    await axios({
      url,
      method,
      ...config,
      data: file,
      onUploadProgress: response => {
        const { loaded, total } = response;
        const progress = Math.floor((loaded / total) * 100);
        // console.log('response', response);
        // console.log('progress', progress);
        AppActions.set_upload_file_progress({ id, progress });
      },
    });
    AppActions.upload_file_progress_success({ id });
    success();
  } catch (error) {
    const errorData = error as { message: string; response: any };
    const message = errorData?.response?.data?.msg || errorData.message;
    const status = errorData?.response?.status;

    console.log('error', error);
    AppActions.upload_file_progress_failure({
      id,
      isShow: true,
      status,
      message,
    });
    failure();
  } finally {
    console.log('finish');
    finish();
  }
}

// File stream download
export async function downloadFile({
  url = '',
  name = '',
  config = {},
  success = () => {},
  failure = () => {},
  finish = () => {},
}) {
  try {
    const response = await axios({
      url,
      method: 'get',
      responseType: 'blob',
      // responseType: 'stream',
      ...config,
      onDownloadProgress: response => {
        // console.log(response.currentTarget.responseHeaders['Content-Length']);
        // console.log(response.currentTarget.response.length);
        // const total = parseFloat(progressEvent.currentTarget.responseHeaders['Content-Length'])
        // const current = progressEvent.currentTarget.response.length
        // onProgress: response => {
        const { loaded, total } = response;
        const progress = Math.floor((loaded / total) * 100);
        console.log(response, 'response');
        // 브라우저(사이트)에서 윈도우 시스템에 접근 할 수 없다.
        console.log('onDownloadProgress', progress);
        // AppActions.set_upload_file_progress({ id, progress });
      },
    });
    console.log(response, 'response');
    fileDownload(response.data, name);
    success();
  } catch (error) {
    // console.log(error);
    // console.log(error.message);
    const {
      response = {},
      request = '',
      message = '',
    } = error as { response: object; request: string; message: string };
    const {
      data = null,
      status = null,
      headers = null,
    } = response as { data: any; status: any; headers: any };

    // AppActions.download_file_failure({
    //   isShow: true,
    //   status,
    //   message,
    // });
    AppActions.show_toast({ status, type: 'error', message });
    failure();
  } finally {
    console.log('finish');
    finish();
  }
}

// export function signOutProccess() {
//   deleteCookie(keys.sign_in_token);
//   deleteCookie(keys.remember_user_token);
//   storage.remove(keys.user);
//   UserActions.set_user(null);
//   AuthActions.set_access_token(null);
//   // persist 삭제
//   storage.remove(`persist:${keys.persist}`);
//   sessionStorage.removeItem(`persist:${keys.persist}`);
// }
