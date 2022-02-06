import { put, all, takeLatest } from 'redux-saga/effects';
import { createSlice } from '@reduxjs/toolkit';
import { fetchReducerActions, createFetchAction, createSaga, fetchInitialState } from 'store/utils';
import * as dashbaordApi from 'api/dashboard';

export const fetch_schedule = createFetchAction('fetch_schedule');
export const fetch_project_graph = createFetchAction('fetch_project_graph');

interface InitialState {
  schedule: object | any;
  projectGraph: object | any;
}

const initialState: InitialState = {
  schedule: { ...fetchInitialState, data: null },
  projectGraph: { ...fetchInitialState, data: null },
};

const slice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    ...fetchReducerActions(fetch_schedule, 'schedule'),
    ...fetchReducerActions(fetch_project_graph, 'projectGraph'),
  },
});

export const actions: any = slice.actions;

export function* dashboardSaga() {
  yield all([
    takeLatest(
      actions.fetch_schedule_request,
      createSaga(actions, 'fetch_schedule', dashbaordApi.fetchSchedule),
    ),
    takeLatest(
      actions.fetch_project_graph_request,
      createSaga(actions, 'fetch_project_graph', dashbaordApi.fetchProjectGraph),
    ),
  ]);
}

export default slice.reducer;
