import { bindActionCreators } from 'redux';
import store from 'store';
import { actions as testActions } from './modules/test';
import { actions as appActions } from './modules/app';
import { actions as baseActions } from './modules/base';
import { actions as authActions } from './modules/auth';
import { actions as userActions } from './modules/user';
import { actions as utilActions } from './modules/util';
import { actions as employeeActions } from './modules/employee';
import { actions as notificationActions } from './modules/notification';
import { actions as dashboardActions } from './modules/dashboard';
import { actions as partnerActions } from './modules/partner';
import { actions as invoiceActions } from './modules/invoice';
import { actions as projectActions } from './modules/project';
import { actions as binActions } from './modules/bin';
import { actions as fileActions } from './modules/file';
import { actions as unitActions } from './modules/unit';
import { actions as supportActions } from './modules/support';
import { actions as storeActions } from './modules/store';

export const { dispatch } = store;

export const TestActions: typeof testActions = bindActionCreators(testActions, dispatch);
export const AppActions: typeof appActions = bindActionCreators(appActions, dispatch);
export const AuthActions: typeof authActions = bindActionCreators(authActions, dispatch);
export const BaseActions: typeof baseActions = bindActionCreators(baseActions, dispatch);
export const UserActions: typeof userActions = bindActionCreators(userActions, dispatch);
export const UtilActions: typeof utilActions = bindActionCreators(utilActions, dispatch);
export const EmployeeActions: typeof employeeActions = bindActionCreators(
  employeeActions,
  dispatch,
);
export const NotificationActions: typeof notificationActions = bindActionCreators(
  notificationActions,
  dispatch,
);
export const DashboardActions: typeof dashboardActions = bindActionCreators(
  dashboardActions,
  dispatch,
);
export const PartnerActions: typeof partnerActions = bindActionCreators(partnerActions, dispatch);
export const InvoiceActions: typeof invoiceActions = bindActionCreators(invoiceActions, dispatch);
export const ProjectActions: typeof projectActions = bindActionCreators(projectActions, dispatch);
export const BinActions: typeof binActions = bindActionCreators(binActions, dispatch);
export const FileActions: typeof fileActions = bindActionCreators(fileActions, dispatch);
export const UnitActions: typeof unitActions = bindActionCreators(unitActions, dispatch);
export const SupportActions: typeof supportActions = bindActionCreators(supportActions, dispatch);
export const StoreActions: typeof storeActions = bindActionCreators(storeActions, dispatch);

// export const DispatchActions = {
//   ...TestActions,
//   ...AppActions,
//   ...BaseActions,
//   ...AuthActions,
//   ...UserActions,
// };
