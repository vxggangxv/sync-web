import { BASE_API_URL } from 'lib/setting';
import { axs } from './config/axiosConfig';

const authPath = `${BASE_API_URL}/auth`;
const basePath = `${BASE_API_URL}/user`;

// auth
export function signInAuth(payload: object | any) {
  return axs({ url: `${authPath}/connect`, method: 'post', data: payload });
}

export function signUpAuth(payload: object | any) {
  return axs({ url: `${authPath}/signup`, method: 'post', data: payload });
}

export function editLegalAgreement(payload: object | any) {
  return axs({ url: `${authPath}/agreement/update`, method: 'post', data: payload });
}

export function editAuthProfile(payload: object | any) {
  return axs({ url: `${authPath}/modify`, method: 'post', data: payload });
}

export function editAuthPassword(payload: object | any) {
  return axs({ url: `${authPath}/password/change`, method: 'post', data: payload });
}

// user
