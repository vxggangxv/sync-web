import { axs } from './config/axiosConfig';
import { BASE_API_URL } from 'lib/setting';

const basePath = `${BASE_API_URL}/notification`;

export function fetchNewNotificationsCount(payload: { language: string }) {
  return axs({ url: `${basePath}/new`, method: 'get', params: payload });
}

// language=KO(EN)
export function fetchOfficialNotifications(payload: { language: string }) {
  return axs({ url: `${basePath}/official`, method: 'get', params: payload });
}

// page=1&searchStartTime=&searchEndTime=&keyword=
export function fetchMainNotifications(payload: object | any) {
  return axs({ url: `${basePath}/main`, method: 'get', params: payload });
}

// page=1&searchStartTime=&searchEndTime=&keyword=
export function fetchNotifications(payload: object | any) {
  return axs({ url: `${basePath}`, method: 'get', params: payload });
}

// notificationIdArr ['', '']
export function readNotifications(payload: object | any) {
  return axs({ url: `${basePath}`, method: 'put', data: payload });
}

// notificationIdArr ['', '']
export function deleteNotifications(payload: object | any) {
  return axs({ url: `${basePath}`, method: 'delete', data: payload });
}
