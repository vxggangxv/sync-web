import { axs } from './config/axiosConfig';
import { BASE_API_URL } from 'lib/setting';

const basePath = `${BASE_API_URL}/unit`;

// return axs({
//   url: `${basePath}/list`,
//   params: {
//     languageGroup: payload?.languageGroup,
//     order: payload?.order,
//     page: payload?.page,
//     keyword: payload?.keyword,
//   },
//   method: 'get',
// });

// language=&order=0&page=1&keyword=
export function fetchUnit(payload: object | any) {
  return axs({ url: `${basePath}`, method: 'get', params: payload });
}

export function updateUnit(payload: object | any) {
  return axs({ url: `${basePath}`, method: 'post', data: payload });
}

export function deleteUnit(payload: object | any) {
  return axs({ url: `${basePath}`, method: 'delete', data: payload });
}

// unit/all?page=1
export function fetchUnitAll(payload: object | any) {
  // page 존재버전
  return axs({ url: `${basePath}/all`, method: 'get', params: payload });
}
