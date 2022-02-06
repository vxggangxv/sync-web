import { axs } from './config/axiosConfig';
import { BASE_API_URL } from 'lib/setting';

const basePath = `${BASE_API_URL}/employee`;

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
export function fetchEmployeeList(payload: object | any) {
  return axs({ url: `${basePath}`, method: 'get', params: payload });
}

export function registerEmployee(payload: object | any) {
  return axs({ url: `${basePath}`, method: 'post', data: payload });
}

export function updateEmployee(payload: object | any) {
  return axs({ url: `${basePath}`, method: 'put', data: payload });
}

export function deleteEmployee(payload: object | any) {
  return axs({ url: `${basePath}`, method: 'delete', params: payload });
}
