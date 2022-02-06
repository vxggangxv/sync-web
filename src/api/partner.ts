import { axs } from './config/axiosConfig';
import { BASE_API_URL } from 'lib/setting';

// notification
// const basePath = `${BASE_API_URL}/socekTest`;
const basePath = `${BASE_API_URL}/partner`;

export function fetchPartnerList(payload: object | any) {
  return axs({ url: `${basePath}`, method: 'get', params: payload });
}

export function editPartnerInfo(payload: object | any) {
  return axs({ url: `${basePath}`, method: 'put', data: payload });
}

export function deletePartner(payload: object | any) {
  return axs({ url: `${basePath}`, method: 'delete', data: payload });
}

export function fetchPartnerRequestList(payload: object | any) {
  return axs({ url: `${basePath}/request`, method: 'get', params: payload });
}

export function fetchPartnerReceiveRequestedList() {
  return axs({ url: `${basePath}/requested`, method: 'get' });
}

export function fetchPartnerReceiveRequestedOne(payload: object | any) {
  //삭제 예정
  return axs({ url: `${basePath}/requested`, method: 'get', params: payload });
}

export function fetchPartnerCodeSearch(payload: string | null) {
  return axs({ url: `${basePath}/new/${payload}`, method: 'get' });
}

// keyword=
export function fetchPartnerSearch(payload: object | any) {
  return axs({ url: `${basePath}/new`, method: 'get', params: payload });
}
export function cancelRequestPartnerShip(payload: object | any) {
  return axs({ url: `${basePath}/new`, method: 'delete', data: payload });
}
// :userGroupIdx
export function fetchPartnerDetail(payload: object | any) {
  return axs({ url: `${basePath}/detail/${payload.groupCode}`, method: 'get' });
}
export function answerReceiveRequested(payload: object | any) {
  return axs({ url: `${basePath}/answer`, method: 'put', data: payload });
}
export function registerNewMenualPartner(payload: object | any) {
  return axs({ url: `${basePath}/manual`, method: 'post', data: payload });
}
export function registerNewPartner(payload: object | any) {
  return axs({ url: `${basePath}/new`, method: 'post', data: payload });
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
// ?partnerType=0%1&page=1
export function fetchMainPartners(payload: object | any) {
  return axs({ url: `${basePath}/main`, method: 'get', params: payload });
}
// ?partnerType=0%1&page=1
export function fetchProjectPartners(payload: { partnerType: string | null; page: number }) {
  return axs({ url: `${basePath}/project`, method: 'get', params: payload });
}

// NOTE: project sync partner select, dashboard chart partners
// ?partnerType=0%1&page=1&keyword=
export function fetchSyncPartners(payload: object | any) {
  return axs({ url: `${basePath}/sync`, method: 'get', params: payload });
}

// partnerShipCode
export function fetchPartnerGold(id: string) {
  return axs({ url: `${basePath}/gold/${id}`, method: 'get' });
}

interface Unit {
  current: number;
  use: number;
  consume: number;
  return: number;
  remain: number;
}
export function editPartnerGold(payload: {
  partnershipIdx: number;
  partnershipCode: string;
  projectCode: string;
  projectName: string;
  inlay: Unit;
  aType: Unit;
  sType: Unit;
  ptGold: Unit;
}) {
  return axs({ url: `${basePath}/gold`, method: 'get', data: payload });
}

// partnerShipCode
export function fetchPartnerGoldHistories({ id, data }: { id: string; data: { page: number } }) {
  return axs({ url: `${basePath}/gold/history/${id}`, method: 'get', params: data });
}
