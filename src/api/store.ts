import { axs } from './config/axiosConfig';
import { BASE_API_URL } from 'lib/setting';

const basePath = `${BASE_API_URL}/store`;

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

// type=(0: cloud, 1:app, 2: warranty)&currency=(RKW, USD)
export function fetchStoreProductList(payload: object | any) {
  return axs({ url: `${basePath}/product`, method: 'get', params: payload });
}
