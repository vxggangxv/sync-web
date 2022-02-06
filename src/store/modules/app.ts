import { createAction, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, delay, put, takeEvery } from 'redux-saga/effects';

interface InitialState {
  landing: boolean;
  apiCalling: boolean;
  toasts: object[] | any[];
  popups: object[] | any[];
  fileProgress: object[] | any[];
}

const initialState: InitialState = {
  // 초기 랜딩중일 경우 true, false일 경우 화면 랜딩 완료
  landing: true,
  // api통신 pending, success, failure에 따른 자동 loading show
  apiCalling: false,
  toasts: [],
  // dialog: undefined,
  popups: [],
  // { id, file, progress, status } - status: 0, 1, 3
  // status - 0: 초기값, 1: 성공, 2: 요청 후 실패
  fileProgress: [
    // { id: 1, file: { name: 'sample1' }, progress: 50, status: 0, error?: { status, message } },
    // { id: 2, file: { name: 'sample2' }, progress: 50, status: 0, error?: { status, message } },
    // { id: 3, file: { name: 'sample3' }, progress: 50, status: 0, error?: { status, message } },
  ],
};

// Popups id
let _pid = 0;

const slice = createSlice({
  name: 'app',
  initialState,
  reducers: {
    exit_landing: state => {
      state.landing = false;
    },
    set_api_calling_status: state => {
      state.apiCalling = true;
    },
    clear_api_calling_status: state => {
      state.apiCalling = false;
    },
    show_toast: (state, action) => {},
    add_toast: (state, { payload }) => {
      state.toasts = state.toasts.concat(payload);
    },
    remove_toast: (state, { payload }) => {
      // console.log(payload, 'payload');
      const toastId = payload.id;
      // console.log(toastId, 'toastId');
      state.toasts = state.toasts.filter(item => item.id !== toastId);
    },
    remove_toasts: (state, { payload }) => {
      state.toasts = [];
    },
    // e.g. PayloadAction
    add_popup: (state, { payload }: PayloadAction<object>) => {
      const nextId = _pid + 1;
      _pid = nextId;
      const config = payload;
      state.popups = state.popups.concat({ id: nextId, config });
    },
    set_popup: (state, { payload }) => {
      const { id, isOpen } = payload;
      state.popups.find(item => item.id === id).config.isOpen = isOpen;
    },
    remove_popup_delay: () => {},
    remove_popup: (state, { payload }) => {
      state.popups = state.popups.filter(item => item.id !== payload.id);
    },
    remove_popups: (state, { payload }) => {
      state.popups = [];
    },
    add_upload_file_progress: (state, { payload }) => {
      // console.log(payload, 'add_upload_file_progress payload');
      state.fileProgress = state.fileProgress.concat(payload);
    },
    set_upload_file_progress: (state, { payload }) => {
      // console.log(payload, 'set_upload_file_progress payload');
      const { id, progress, error } = payload;
      const currentFile = state.fileProgress.find(item => item.id === id);
      if (currentFile) {
        currentFile.progress = progress;
        if (error) currentFile.error = error;
      }
    },
    remove_upload_file_progress: (state, { payload }) => {
      if (payload?.type === 'all') {
        state.fileProgress = [];
      } else {
        state.fileProgress = state.fileProgress.filter(item => item.id !== payload.id);
      }
    },
    upload_file_progress_success: (state, { payload }) => {
      // console.log(payload, 'upload_file_progress_success payload');
      // console.log(
      //   state.fileProgress.find(item => item.id === payload.id),
      //   'state.fileProgress.find(item => item.id === payload.id)',
      // );
      const currentFile = state.fileProgress.find(item => item.id === payload.id);
      if (currentFile) currentFile.status = 1;
    },
    upload_file_progress_failure: (state, { payload }) => {
      console.log(payload, 'failure_upload_file_progress payload');
      const currentFile = state.fileProgress.find(item => item.id === payload.id);
      if (currentFile) {
        currentFile.status = 2;
        currentFile.progress = 0;
      }
    },
    // download_file_success: () => {},
    // download_file_failure: () => {},
  },
});

export const actions = slice.actions;

function* handleRequest(action: any) {
  // console.log('handleRequest');
  // yield put(actions.set_api_calling_status());
}

function* handleSuccess(action: any) {
  // yield put(actions.clear_api_calling_status());
  // yield put(actions.show_toast('Request Completed.'));
}

function* handleFailure(action: any) {
  const { payload } = action;
  // yield put(actions.clear_api_calling_status());
  const isShow = payload?.isShow;
  const status = payload?.status;
  let message = payload?.message;
  // message = message ? message : 'Request Failed.';
  message = message ? message : 'Fail.';
  if (isShow) yield put(actions.show_toast({ status, type: 'error', message }));
  // message: '데이터를 불러오기에 실패했습니다.'
}

// 토스트 아이디로 사용한다
let _tid = 0;

// { message: '', type: '', eventType: 'default', isAutoRemove: true }
/**
 * @param {!string} messge
 * @param {!string} type
 * @param {!string} [eventType = 'default']
 * @param {!boolan} [isAutoRemove = true]
 * @param {?string} okText - eventType byProject 에서 사용, project용 알림에서만 적용
 * @param {?number} delay
 */
function* handleShowToast(action: ReturnType<typeof actions.show_toast>) {
  // console.log('handleShowToast');
  const nextId = _tid + 1;
  _tid = nextId;

  // 기본 값 정의
  let config = {
    eventType: 'default',
    isAutoRemove: true,
    delay: 2000,
    okText: 'Ok',
  };
  config = {
    ...config,
    ...action.payload,
  };

  // TEMP:
  console.log('handleShowToast config', config);
  const id = nextId;

  // 토스트를 상태에 추가한다
  yield put(actions.add_toast({ id, config }));

  // 초 대기한다, 250 - animation transition seconds
  yield delay(config.delay + 750);

  // 토스트를 상태에서 제거한다
  if (config.isAutoRemove) yield put(actions.remove_toast({ id }));
}

// onExit 사용을 위한 delay 및, isOpen 연결 설정
// id, isOpen: false 필수
function* handleRemovePopupDelay({ payload }: any) {
  const { id, isOpen } = payload;

  yield put(actions.set_popup({ id, isOpen }));
  // yield delay(225);
  yield delay(250);
  yield put(actions.remove_popup({ id }));
}

export function* appSaga() {
  yield all([
    takeEvery((action: any) => {
      if (typeof action.type === 'string') {
        return action.type.endsWith('_request');
      }
    }, handleRequest),
    takeEvery((action: any) => {
      if (typeof action.type === 'string') {
        return action.type.endsWith('_success');
      }
    }, handleSuccess),
    takeEvery((action: any) => {
      if (typeof action.type === 'string') {
        return action.type.endsWith('_failure');
      }
    }, handleFailure),
    takeEvery(actions.show_toast.type, handleShowToast),
    takeEvery(actions.remove_popup_delay.type, handleRemovePopupDelay),
  ]);
}

export default slice.reducer;
