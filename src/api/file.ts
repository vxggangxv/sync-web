import { axs } from './config/axiosConfig';
import { BASE_API_URL } from 'lib/setting';

const basePath = `${BASE_API_URL}/file`;

export function fetchProjectFiles(id: string) {
  return axs({ url: `${basePath}/project/${id}`, method: 'get' });
}

export function fetchProjectFileUploadUrl(payload: {
  projectCode: string;
  fileGroupId: string;
  fileName: string;
  fileSize?: number;
  isShare: number;
}) {
  return axs({ url: `${basePath}/upload/project`, method: 'post', data: payload });
}

export function fetchProjectFileDownloadUrl(payload: { cloudDataIdx: number }) {
  return axs({ url: `${basePath}/download/project`, method: 'post', data: payload });
}

// "projectCode" : "20210225-babcec1d-2788-43a7-a79e-baeb5ccf7e82", "cloudFileList" : [ 188 ]
// { projectCode: string; cloudFileList: any[] }
export function deleteProjectFile(payload: { projectCode: string; cloudDataList: number[] }) {
  return axs({ url: `${basePath}/project`, method: 'delete', data: payload });
}

export function completeProjectFileUpload({
  fileType,
  data,
}: {
  fileType: string;
  data: {
    duplicateCloudDataIdx: number;
    cloudDataIdx: number;
    isSuccess: number;
  };
}) {
  return axs({ url: `${basePath}/upload/${fileType}/complete`, method: 'put', data: data });
}

export function editProjectShare(payload: {
  projectCode: string;
  cloudDataList: number[];
  isShare: number;
}) {
  return axs({ url: `${basePath}/project/share`, method: 'put', data: payload });
}
