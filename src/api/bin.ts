import { axs } from './config/axiosConfig';
import { BASE_BIN_URL } from 'lib/setting';

const basePath = `${BASE_BIN_URL}`;

// form-data {projectCode, project}
export function uploadProjectFile(payload: { projectCode: string; project: any }) {
  return axs({ url: `${basePath}/project`, method: 'post', data: payload });
}

// "projectCode" : "20210225-babcec1d-2788-43a7-a79e-baeb5ccf7e82", "cloudFileList" : [ 188 ]
// { projectCode: string; cloudFileList: any[] }
export function deleteProjectFile(payload: object | any) {
  return axs({ url: `${basePath}/project`, method: 'delete', data: payload });
}
