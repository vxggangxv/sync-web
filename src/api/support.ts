import { axs } from './config/axiosConfig';
import { BASE_API_URL } from 'lib/setting';

const basePath = `${BASE_API_URL}/support`;

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

// ?page=1
export function fetchFaqList(payload: object | any) {
  return axs({ url: `${basePath}/faq`, method: 'get', params: payload });
}

// ?page=1
export function fetchQnaList(payload: object | any) {
  return axs({ url: `${basePath}/qna`, method: 'get', params: payload });
}
export function updateQna(payload: object | any) {
  return axs({ url: `${basePath}/qna`, method: 'post', data: payload });
}
