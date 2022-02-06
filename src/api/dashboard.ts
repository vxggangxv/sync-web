import { axs } from './config/axiosConfig';
import { BASE_API_URL } from 'lib/setting';

const basePath = `${BASE_API_URL}/dashboard`;

// ?searchDate=2021-11-22
export function fetchSchedule(payload: object | any) {
  return axs({ url: `${basePath}/schedule`, method: 'get', params: payload });
}

// ?searchDate=2021-11-22&isRequest=1&projectDuration=1W&stage=&partnerGroupIdx=
export function fetchProjectGraph(payload: object | any) {
  return axs({ url: `${basePath}/project/graph`, method: 'get', params: payload });
}
