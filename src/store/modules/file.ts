import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { all, put, takeLatest } from 'redux-saga/effects';
import {
  createFetchAction,
  createSaga,
  fetchInitialState,
  fetchReducerActions,
  uploadFileProgress,
} from 'store/utils';
import { BASE_API_URL } from 'lib/setting';
import { AppActions, BinActions, FileActions, ProjectActions } from 'store/actionCreators';
import * as fileApi from 'api/file';
import * as projectApi from 'api/project';
import { v4 as uuid } from 'uuid';
import moment from 'moment';
import store from 'store';
import { projectEventType } from 'lib/mapper';
import { AxiosResponse } from 'axios';

const fetch_project_files = createFetchAction('fetch_project_files');
const upload_project_file = createFetchAction('upload_project_file');
const delete_project_file = createFetchAction('delete_project_file');
const complete_project_file_upload = createFetchAction('complete_project_file_upload');
const edit_project_share = createFetchAction('edit_project_share');

interface InnitialState {
  projectSyncCloudData: object | any;
  projectFiles:
    | {
        data: {
          fileData: {
            groupFileList: any[];
            partnerFileList: any[];
          };
        };
      }
    | any;
  uploadProjectFile: object | any;
  deleteProjectFile: object | any;
  completeProjectFileUpload: object | any;
  editProjectShare: object | any;
}

const initialState: InnitialState = {
  projectSyncCloudData: null,
  projectFiles: { ...fetchInitialState, data: null },
  uploadProjectFile: { ...fetchInitialState },
  deleteProjectFile: { ...fetchInitialState },
  completeProjectFileUpload: { ...fetchInitialState },
  editProjectShare: { ...fetchInitialState },
};

const slice = createSlice({
  name: 'file',
  initialState,
  reducers: {
    set_project_sync_cloudData: (state: any, { payload }: PayloadAction<any>) => {
      state.projectSyncCloudData = payload;
    },
    set_project_files: (state: any, { payload }: PayloadAction<any>) => {
      state.projectFiles.data = payload;
    },
    ...fetchReducerActions(fetch_project_files, 'projectFiles'),
    ...fetchReducerActions(upload_project_file, 'uploadProjectFile'),
    ...fetchReducerActions(delete_project_file, 'deleteProjectFile'),
    ...fetchReducerActions(complete_project_file_upload, 'completeProjectFileUpload'),
    ...fetchReducerActions(edit_project_share, 'editProjectShare'),
  },
});

export const actions: any = slice.actions;

// export async function requestApi(request: Promise<any>) {
//   try {
//     const response = await request;
//     return response.data;
//     // return [response.data, null];
//   } catch (error) {
//     AppActions.show_toast({ type: 'error', message: (error as { message: string })?.message });
//     // return [null, error]
//   }
// }

// createSaga
function* handleUploadProjectFile({ payload }: any) {
  const { company, projectCode, project: files, isShare = 1, syncPartnerId } = payload;
  const fileGroupId = moment().unix() + uuid();
  console.log('handleUploadProjectFile payload----------------------------------', payload);
  // console.log('fileGroupId', fileGroupId);

  if (!files?.length) return;
  try {
    let filesContent = '';
    let cloudDataList: number[] | any = [];

    // 성공 후 파일 로드 시점issue로 인해 await 이후 실행
    const excuteAfterReponse = (item: any, filesContent: string) => {
      const createHistoryData = {
        projectCode,
        type: projectEventType.fileUpload,
        params: {
          content: `${company}${filesContent}`,
        },
      };

      FileActions.fetch_project_files_request(projectCode);
      ProjectActions.create_project_history_request(createHistoryData);
    };

    files.forEach(async (item: any, idx: number) => {
      console.log('item', item);
      const formPayload: any = new FormData();
      // formPayload.append('project', item.file);
      const isLast = idx === files.length - 1;
      const progressId = uuid();

      const uploadData = {
        projectCode,
        fileGroupId,
        fileName: item.file.name,
        fileSize: item.file.size,
        isShare,
      };
      // TEST:
      // if (idx === 0) {
      //   uploadData.fileName = null;
      // }

      console.log('uploadData', uploadData);

      // const data = requestApi(fileApi.fetchProjectFileUploadUrl(uploadData));
      let projectFileUploadUrlData = null;
      try {
        const response = await fileApi.fetchProjectFileUploadUrl(uploadData);
        // console.log('data', data);
        projectFileUploadUrlData = response.data;
        // data = responseData;
      } catch (error) {
        const errorData = error as { message: string; response: any };
        const message = errorData?.response?.data?.msg || errorData.message;
        const status = errorData?.response?.status;
        AppActions.add_upload_file_progress({
          id: progressId,
          file: item.file,
          progress: 0,
          status: 0,
          error: { status, message },
        });
      }

      if (!projectFileUploadUrlData) return;
      const { signedUrl, cloudDataIdx } = projectFileUploadUrlData;

      if (typeof signedUrl === 'string') {
        await uploadFileProgress({
          id: progressId,
          file: item.file,
          url: signedUrl,
          method: 'put',
          async success() {
            // BinActions.upload_project_file_success();
            console.log('handleUploadProjectFile success');
            await fileApi.completeProjectFileUpload({
              fileType: 'project',
              data: {
                duplicateCloudDataIdx: item.cloudDataIdx,
                cloudDataIdx,
                isSuccess: 1,
              },
            });
            cloudDataList = [...cloudDataList, cloudDataIdx];
            filesContent = filesContent + `, ${item.file?.name}`;

            if (isLast) {
              excuteAfterReponse(item, filesContent);
              if (syncPartnerId) {
                console.log('reqiest createProjectSync');
                console.log('cloudDataList', cloudDataList);
                try {
                  await projectApi.createProjectSync({
                    projectCode,
                    partnerGroupIdx: syncPartnerId,
                    cloudDataList,
                  });
                  // api호출 후 store 성공으로 변경
                  ProjectActions.create_project_sync_success();
                } catch (error) {
                  AppActions.show_toast({
                    type: 'error',
                    message: (error as { message: string })?.message,
                  });
                }
              }
            }
          },
          async failure() {
            console.log('handleUploadProjectFile failure');
            await fileApi.completeProjectFileUpload({
              fileType: 'project',
              data: {
                duplicateCloudDataIdx: item.cloudDataIdx,
                cloudDataIdx,
                isSuccess: 0,
              },
            });
            // if (isLast) {
            //   excuteAfterReponse(item);
            // }
          },
          finish() {
            console.log('handleUploadProjectFile finish');
          },
        });
      }
    });
  } catch (error) {
    // console.log(error);
    AppActions.show_toast({ type: 'error', message: (error as { message: string })?.message });
  }
}

// function* handleEditPortfolioFile({ payload }) {
//   const { deletePortfolio, portfolio: files, userCode } = payload;
//   console.log('handleEditPortfolioFile payload', payload);

//   if (files.length) {
//     files.forEach(async file => {
//       const formPayload = new FormData();
//       formPayload.append('deletePortfolio', deletePortfolio);
//       formPayload.append('portfolio', file);

//       uploadFileProgress({
//         file,
//         url: `${BASE_BIN_URL}/portfolio`,
//         formPayload,
//         config: {
//           headers: {
//             'x-access-token': store.getState().auth.accessToken,
//           },
//         },
//         success() {
//           BinActions.upload_project_file_success();
//         },
//         finish() {
//           ProjectActions.fetch_portfolio_request({ userCode });
//         },
//       });
//     });
//   }
// }

export function* fileSaga() {
  yield all([
    takeLatest(
      actions.fetch_project_files_request,
      createSaga(actions, 'fetch_project_files', fileApi.fetchProjectFiles),
    ),
    takeLatest(actions.upload_project_file_request, handleUploadProjectFile),
    takeLatest(
      actions.delete_project_file_request,
      createSaga(actions, 'delete_project_file', fileApi.deleteProjectFile),
    ),
    takeLatest(
      actions.complete_project_file_upload_request,
      createSaga(actions, 'complete_project_file_upload', fileApi.completeProjectFileUpload),
    ),
    takeLatest(
      actions.edit_project_share_request,
      createSaga(actions, 'edit_project_share', fileApi.editProjectShare),
    ),
  ]);
}

export default slice.reducer;

// config: {
//   headers: {
//     'Content-Type': 'multipart/form-data',
//   },
// },
// formPayload,
// config: {
//   headers: {
//     'x-access-token': store.getState().auth.accessToken,
//     projectCode,
//     cloudDataIdx: item.cloudDataIdx,
//   },
// },
