import { BASE_API_URL } from 'lib/setting';
import { axs } from './config/axiosConfig';

const basePath = `${BASE_API_URL}/my`;

// auth
export function fetchProfile() {
  return axs({ url: `${basePath}/profile`, method: 'get' });
}
