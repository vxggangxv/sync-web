import { axs } from './config/axiosConfig';
import { BASE_API_URL } from 'lib/setting';

const basePath = `${BASE_API_URL}/invoice`;

// newInvoice 왼쪽 프로필 내용
// ?startDate=2021-10-01&endDate=2021-10-31&partnershipIdx=8
export function fetchInvoiceInit(payload: object | any) {
  return axs({ url: `${basePath}/init`, method: 'get', params: payload });
}

// ?startDate=2021-10-01&endDate=2021-10-31&partnershipIdx=8&keyword=
export function fetchInvoices(payload: object | any) {
  return axs({ url: `${basePath}`, method: 'get', params: payload });
}

// :invoiceIdx?page=1
export function fetchInvoice({ id, data }: { id: string; data: { page: number } }) {
  return axs({ url: `${basePath}/${id}`, method: 'get', params: data });
}

export function createInvoice(payload: object | any) {
  return axs({ url: `${basePath}`, method: 'post', data: payload });
}

// :projectCode
export function fetchProjectInvoice(id: any) {
  return axs({ url: `${basePath}/project/${id}`, method: 'get' });
}
