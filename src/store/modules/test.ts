import { put, all, takeLatest } from 'redux-saga/effects';
import { createSlice } from '@reduxjs/toolkit';
import { fetchReducerActions, createFetchAction, createSaga, fetchInitialState } from 'store/utils';
import * as testApi from 'api/test';

export const fetch_tests = createFetchAction('fetch_tests');
export const fetch_test = createFetchAction('fetch_test');

interface InitialState {
  tests: object;
  test: object;
  obj: object;
}

const initialState: InitialState = {
  tests: {
    ...fetchInitialState,
    data: null,
  },
  test: {
    ...fetchInitialState,
    data: null,
  },
  obj: {
    list: {
      item: {
        ...fetchInitialState,
        data: null,
      },
    },
  },
};

const slice = createSlice({
  name: 'test',
  initialState,
  reducers: {
    ...fetchReducerActions(fetch_tests, 'fetch_tests'),
    ...fetchReducerActions(fetch_test, 'fetch_test'),
  },
});

export const actions: any = slice.actions;

// saga
// function* handleFetchTests() {
//   try {
//     yield put(actions.fetch_tests_sucess());
//   } catch (err) {
//     yield put(actions.fetch_tests_failure());
//   } finally {
//     // yield put();
//   }
// }

// function* handleFetchTest() {
//   try {
//     yield put(actions.fetch_test_sucess());
//   } catch (err) {
//     yield put(actions.fetch_test_failure());
//   }
// }

export function* testSaga() {
  yield all([
    takeLatest(actions.fetch_tests_request, createSaga(actions, 'fetch_tests', testApi.fetchTests)),
    takeLatest(
      actions.fetch_test_request,
      createSaga(actions, 'fetch_test', testApi.fetchTestById),
    ),
  ]);
}

export default slice.reducer;
