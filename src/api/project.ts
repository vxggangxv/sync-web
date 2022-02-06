import { axs } from './config/axiosConfig';
import { BASE_API_URL } from 'lib/setting';

const basePath = `${BASE_API_URL}/project`;

export function initProject() {
  return axs({ url: `${basePath}/init`, method: 'get' });
}

// ?page=1&keyword&stages=1%6&startDate&endDate
export function fetchProjects(payload: object | any) {
  return axs({ url: `${basePath}`, method: 'get', params: payload });
}

// projectCode
export function fetchProject(id: string) {
  return axs({ url: `${basePath}/${id}`, method: 'get' });
}

// projectCode
export function editProject(payload: object | any) {
  return axs({ url: `${basePath}`, method: 'post', data: payload });
}

// projectCode
// export function deleteProject(payload: object | any) {
//   return axs({ url: `${basePath}`, method: 'delete', data: payload });
// }

export function editTimeline(payload: { projectCode: string; stage: number }) {
  return axs({ url: `${basePath}/timeline`, method: 'put', data: payload });
}

// ?page=1&keyword&stages=0%6&startDate&endDate
export function fetchReworkProjects(payload: {
  page: number;
  keyword: string;
  stages: string;
  startDate?: number;
  endDate?: number;
}) {
  return axs({ url: `${basePath}/rework`, method: 'get', params: payload });
}

// projectCode
export function fetchReworkProject(id: string) {
  return axs({ url: `${basePath}/rework/${id}`, method: 'get' });
}

// NOTE: 사용X
export function fetchProjectFiles(payload: { projectCode: string }) {
  return axs({ url: `${basePath}/file`, method: 'get', params: payload });
}

export function fetchProjectHistories({ id, data }: { id: string; data: { page: number } }) {
  return axs({ url: `${basePath}/history/${id}`, method: 'get', params: data });
}

// projectCode, eventType, params
export function createProjectHistory(payload: {
  projectCode: string;
  eventType: string;
  params: any;
}) {
  return axs({ url: `${basePath}/history`, method: 'post', data: payload });
}

export function createProjectSync(payload: {
  projectCode: string;
  partnerGroupIdx: number;
  cloudDataList: number[];
}) {
  return axs({ url: `${basePath}/sync`, method: 'post', data: payload });
}

export function editProjectSync(payload: { projectCode: string; syncStatus: number }) {
  return axs({ url: `${basePath}/sync`, method: 'put', data: payload });
}
