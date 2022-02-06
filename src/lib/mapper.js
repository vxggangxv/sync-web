import { color } from 'styles/utils';
import {
  icon_nav_account,
  icon_nav_home,
  icon_nav_invoice,
  icon_nav_partner,
  icon_nav_project,
  icon_nav_store,
  icon_nav_support,
} from 'components/base/images';

export const brand = {
  logo: {
    index: 'logo',
    text: 'DOF Bridge',
  },
};

export const setting = {
  language: {
    kr: {
      id: 1,
      label: 'Korean',
      index: 'KR',
    },
    en: {
      id: 2,
      label: 'English',
      index: 'EN',
    },
  },
};

export const pageUrl = {
  index: '/',
  home: '/home',
  auth: {
    index: '/auth',
    signIn: '/auth/login',
    signUp: '/auth/join',
    signOut: '/auth/logout',
    resetPassword: '/auth/reset/password',
  },
  error: {
    index: '/error',
    server: '/error/500',
    notFound: '/error/404',
  },
  dashboard: {
    index: '/dashboard',
  },
  notifications: {
    index: '/notifications',
  },
  project: {
    index: '/project',
    list: '/project/list',
    detail: '/project/detail/:pcode',
    create: '/project/create',
    edit: '/project/edit/:pcode',
  },
  mypage: {
    index: '/mypage',
    information: '/mypage/infomation',
    partners: '/mypage/partners',
    product: '/mypage/product',
    option: '/mypage/option',
    history: '/mypage/history',
  },
  store: {
    index: '/store',
    sync: '/store/sync',
    app: '/store/app',
    invoice: '/store/invoice',
  },
  invoice: {
    index: '/invoice',
  },
  notifications: {
    index: '/notifications',
  },
  support: {
    index: '/support',
  },
  partner: {
    index: '/partner',
    list: '/partner/list',
  },
  account: {
    index: '/account',
  },
};

export const navigation = [
  // {
  //   path: pageUrl.home,
  //   text: 'Home',
  // },
  {
    path: pageUrl.dashboard.index,
    text: 'Home',
    icon: icon_nav_home,
  },
  {
    path: pageUrl.project.index,
    text: 'Project',
    icon: icon_nav_project,
  },
  {
    path: pageUrl.invoice.index,
    text: 'Invoice',
    icon: icon_nav_invoice,
  },
  {
    path: pageUrl.account.index,
    text: 'Account',
    icon: icon_nav_account,
  },
  {
    path: pageUrl.partner.index,
    text: 'Partner',
    icon: icon_nav_partner,
  },
  {
    path: pageUrl.support.index,
    text: 'Support',
    icon: icon_nav_support,
  },
  {
    path: pageUrl.store.index,
    text: 'Store',
    icon: icon_nav_store,
  },
  // {
  //   path: '/about',
  //   text: 'About',
  // },
  // {
  //   path: '/user',
  //   text: 'User',
  // },
  // {
  //   path: '/test',
  //   text: 'Test',
  // },
];

export const projectProcessFlagList = [
  {
    id: 0,
    index: 'create',
    name: 'New',
    color: color.stage_new,
  },
  {
    id: 1,
    index: 'preparation',
    name: 'Preparation',
    color: color.stage_preparation,
  },
  {
    id: 2,
    index: 'scan',
    name: 'Scan',
    color: color.stage_scan,
  },
  {
    id: 3,
    index: 'cad',
    name: 'CAD',
    color: color.stage_cad,
  },
  {
    id: 4,
    index: 'cam',
    name: 'CAM',
    color: color.stage_cam,
  },
  {
    id: 5,
    index: 'milling',
    name: 'Milling',
    color: color.stage_milling,
  },
  {
    id: 6,
    index: 'postprocessing',
    name: 'Post process',
    color: color.stage_post,
  },
  {
    id: 7,
    index: 'complete',
    name: 'Completed',
    color: color.stage_completed,
  },
];

export const partnerTypeList = [
  { id: 0, text: 'Clinic' },
  { id: 1, text: 'Labortory' },
];

// socket projectEvent에 따른 분기
export const projectEventType = {
  designerEnter: 'DESIGNER_ENTER',
  designerLeave: 'DESIGNER_LEAVE',
  userEnter: 'USER_ENTER',
  userLeave: 'USER_LEAVE',
  projectUpdate: 'PROJECT_UPDATE',
  applyDesigner: 'APPLY_DESIGNER',
  fileUpload: 'FILE_UPLOAD',
  fileDownload: 'FILE_DOWNLOAD',
  fileDelete: 'FILE_DELETE',
};

export const fileExtensionList = [
  'doc',
  'docx',
  'jpg',
  'mp3',
  'mp4',
  'pdf',
  'png',
  'ppt',
  'pptx',
  'rar',
  'stl',
  'txt',
  'xls',
  'xlsx',
  'zip',
];

// Notification page
export const notificationsEventTypeList = [
  // { eventType: 'PROJECT_CREATE', eventTitle: '프로젝트 생성' },
  // { eventType: 'PROJECT_UPDATE', eventTitle: '프로젝트 업데이트' },
  // { eventType: 'PROJECT_REVIEW', eventTitle: '프로젝트 리뷰 시작' },
  { eventType: 'PROJECT_REVIEW_COMPLETE', eventTitle: '프로젝트 리뷰 완료' },
  // { eventType: 'DESIGNER_WORKING', eventTitle: '디자이너 작업 시작' },
  { eventType: 'DESIGNER_WORK_DONE', eventTitle: '디자이너 작업 완료' },
  { eventType: 'CLIENT_CONFIRM', eventTitle: '클라이언트 컨펌앤페이' },
  { eventType: 'CLIENT_REMAKE_REQ', eventTitle: '클라이언트 리메이크 요청' },
];

export const notificationsModalEventType = {
  client: 'clientByProject',
  designer: 'designerByProject',
};
