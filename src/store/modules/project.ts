import { all, takeLatest } from 'redux-saga/effects';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchReducerActions, createFetchAction, createSaga, fetchInitialState } from 'store/utils';
import * as projectApi from 'api/project';
import { FileActions, ProjectActions } from 'store/actionCreators';
import store from 'store';

const init_project = createFetchAction('init_project');
const fetch_projects = createFetchAction('fetch_projects');
const fetch_project = createFetchAction('fetch_project');
const edit_project = createFetchAction('edit_project');
// const delete_project = createFetchAction('delete_project');
const edit_timeline = createFetchAction('edit_timeline');
const fetch_rework_projects = createFetchAction('fetch_rework_projects');
const fetch_rework_project = createFetchAction('fetch_rework_project');
const fetch_project_files = createFetchAction('fetch_project_files');
const fetch_project_histories = createFetchAction('fetch_project_histories');
const create_project_history = createFetchAction('create_project_history');
const create_project_sync = createFetchAction('create_project_sync');
const edit_project_sync = createFetchAction('edit_project_sync');

interface InitialState {
  initProject: object | any;
  projects: object | any;
  project: object | any;
  editProject: object | any;
  // deleteProject: object | any;
  editTimeline: object | any;
  reworkProjects: object | any;
  reworkProject: object | any;
  projectFiles: object | any;
  projectHistories: object | any;
  createProjectHistory: object | any;
  createProjectSync: object | any;
  editProjectSync: object | any;
}

const initialState: InitialState = {
  initProject: { ...fetchInitialState, data: null },
  projects: { ...fetchInitialState, data: null },
  project: { ...fetchInitialState, data: null },
  editProject: { ...fetchInitialState },
  // deleteProject: { ...fetchInitialState },
  editTimeline: { ...fetchInitialState },
  reworkProjects: { ...fetchInitialState, data: null },
  reworkProject: { ...fetchInitialState, data: null },
  projectFiles: { ...fetchInitialState, data: null },
  projectHistories: { ...fetchInitialState, data: null },
  createProjectHistory: { ...fetchInitialState, data: null },
  createProjectSync: { ...fetchInitialState },
  editProjectSync: { ...fetchInitialState },
};

const slice = createSlice({
  name: 'project',
  initialState,
  reducers: {
    ...fetchReducerActions(init_project, 'initProject'),
    ...fetchReducerActions(fetch_projects, 'projects'),
    ...fetchReducerActions(fetch_project, 'project', {
      success: (state: any, { payload }: PayloadAction<any>) => {
        console.log('fetch project action', payload);
        const { fileList, hasNewFile } = payload;
        state.projectFiles.data = {
          ...state.projectFiles.data,
          fileList,
          hasNewFile,
        };
      },
    }),
    ...fetchReducerActions(edit_project, 'editProject'),
    // ...fetchReducerActions(delete_project, 'deleteProject'),
    ...fetchReducerActions(edit_timeline, 'editTimeline'),
    ...fetchReducerActions(fetch_rework_projects, 'reworkProjects'),
    ...fetchReducerActions(fetch_rework_project, 'reworkProject'),
    ...fetchReducerActions(fetch_project_files, 'projectFiles'),
    ...fetchReducerActions(fetch_project_histories, 'projectHistories'),
    ...fetchReducerActions(create_project_history, 'createProjectHistory'),
    ...fetchReducerActions(create_project_sync, 'createProjectSync'),
    ...fetchReducerActions(edit_project_sync, 'editProjectSync'),
  },
});

export const actions: any = slice.actions;

const handleCreateProjectHistory = () => {
  console.log('handleCreateProjectHistory');
  createSaga(actions, 'create_project_history', projectApi.createProjectHistory, {
    success() {
      ProjectActions.fetch_project_histories_request({
        projectCode: store.getState().project.project.projectCode,
        page: 1,
      });
    },
  });
};
export function* projectSaga() {
  yield all([
    takeLatest(
      actions.init_project_request,
      createSaga(actions, 'init_project', projectApi.initProject),
    ),
    takeLatest(
      actions.fetch_projects_request,
      createSaga(actions, 'fetch_projects', projectApi.fetchProjects),
    ),
    takeLatest(
      actions.fetch_project_request,
      createSaga(actions, 'fetch_project', projectApi.fetchProject, {
        success(data: any) {
          FileActions.set_project_files(data);
        },
      }),
    ),
    takeLatest(
      actions.edit_project_request,
      createSaga(actions, 'edit_project', projectApi.editProject),
    ),
    // takeLatest(
    //   actions.delete_project_request,
    //   createSaga(actions, 'delete_project', projectApi.deleteProject),
    // ),
    takeLatest(
      actions.edit_timeline_request,
      createSaga(actions, 'edit_timeline', projectApi.editTimeline),
    ),
    takeLatest(
      actions.fetch_rework_projects_request,
      createSaga(actions, 'fetch_rework_projects', projectApi.fetchReworkProjects),
    ),
    takeLatest(
      actions.fetch_rework_project_request,
      createSaga(actions, 'fetch_rework_project', projectApi.fetchReworkProject),
    ),
    takeLatest(
      actions.fetch_project_files_request,
      createSaga(actions, 'fetch_project_files', projectApi.fetchProjectFiles),
    ),
    takeLatest(
      actions.fetch_project_histories_request,
      createSaga(actions, 'fetch_project_histories', projectApi.fetchProjectHistories),
    ),
    takeLatest(
      actions.create_project_history_request,
      createSaga(actions, 'create_project_history', projectApi.createProjectHistory, {
        success() {
          ProjectActions.fetch_project_histories_request({
            id: store.getState().project.project?.data?.projectInfo?.projectCode,
            data: { page: 1 },
          });
        },
      }),
    ),
    takeLatest(
      actions.create_project_sync_request,
      createSaga(actions, 'create_project_sync', projectApi.createProjectSync),
    ),
    takeLatest(
      actions.edit_project_sync_request,
      createSaga(actions, 'edit_project_sync', projectApi.editProjectSync),
    ),
  ]);
}

export default slice.reducer;
