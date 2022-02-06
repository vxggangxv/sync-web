import { axs } from './config/axiosConfig';
import { BASE_API_URL } from 'lib/setting';

const basePath = `${BASE_API_URL}/util`;

// "language":"EN"
export function fetchTeethIndicationFormat(payload: object | any) {
  return axs({
    url: `${basePath}/indication/format`,
    method: 'get',
    params: { version: 2, ...payload },
  });
}

export function fetchTeethIndicationInfo(payload: object | any) {
  return axs({
    url: `${basePath}/indication/info`,
    method: 'get',
    params: { version: 2, ...payload },
  });
}

export function fetchAdvertisement() {
  return axs({ url: `${basePath}/advertisement`, method: 'get' });
}

export function fetchGoogleTranslate(payload: { text: string; target: string }) {
  return axs({ url: `${basePath}/translate`, method: 'get', params: payload });
}

export function fetchCurrencyList() {
  return axs({ url: `${basePath}/currency`, method: 'get' });
}

export function fetchCountryList() {
  return axs({ url: `${basePath}/country/list`, method: 'get' });
}

export function fetchCountryRegionList(payload: { country: number }) {
  return axs({ url: `${basePath}/country/region/list`, method: 'get', params: payload });
}
