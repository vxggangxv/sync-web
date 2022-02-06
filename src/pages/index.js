import lodable, { lazy } from '@loadable/component';
import { ENV_MODE_DEV, ENV_MODE_PROD } from 'lib/setting';
import AboutPage from './about/About';
import UserPage from './user/User';
import HdsPage from './hds/Hds';
import HomePage from './home/Home';
import ErrorPage from './error/Error';
import AuthPage from './auth/Auth';
import JunPage from './jun/Jun';
import DashboardPage from './dashboard/Dashboard';
import ProjectPage from './project/Project';
import StorePage from './store/Store';
import AccountPage from './account/Account';
import PartnerPage from './partner/Partner';
import SupportPage from './support/Support';
import InvoicePage from './invoice/Invoice';
import NotificationsPage from './notifications/Notifications';

// NOTE: test용
export const Counter = lodable(() => import('./test/__test__/Counter'));
export const TodoApp = lodable(() => import('./test/__test__/todo/TodoApp'));
export const DelayedToggle = lodable(() => import('./test/__test__/DelayedToggle'));
export const UserProfile = lodable(() => import('./test/__test__/UserProfile'));
export const Test = lodable(() => import('./test/Test'));
export const TestList = lodable(() => import('./test/TestList'));
export const TestDetail = lodable(() => import('./test/TestDetail'));

// export { default as Home } from './home/Home';
// export { default as Error } from './error/Error';
// export { default as Auth } from './auth/Auth';
// export { default as About } from './about/About';
// export { default as User } from './user/User';

let About = AboutPage;
let User = UserPage;
let Hds = HdsPage;
let Home = HomePage;
let Error = ErrorPage;
let Auth = AuthPage;
let Jun = JunPage;
let Dashboard = DashboardPage;
let Project = ProjectPage;
let Store = StorePage;
let Account = AccountPage;
let Partner = PartnerPage;
let Support = SupportPage;
let Invoice = InvoicePage;
let Notifications = NotificationsPage;

if (ENV_MODE_PROD) {
  About = lodable(() => import('./about/About'));
  User = lodable(() => import('./user/User'));
  Hds = lodable(() => import('./hds/Hds'));
  Home = lodable(() => import('./home/Home'));
  Error = lodable(() => import('./error/Error'));
  Auth = lodable(() => import('./auth/Auth'));
  Jun = lodable(() => import('./jun/Jun'));
  Dashboard = lodable(() => import('./dashboard/Dashboard'));
  Project = lodable(() => import('./project/Project'));
  Store = lodable(() => import('./store/Store'));
  Account = lodable(() => import('./account/Account'));
  Partner = lodable(() => import('./partner/Partner'));
  Support = lodable(() => import('./support/Support'));
  Invoice = lodable(() => import('./invoice/Invoice'));
  Notifications = lodable(() => import('./notifications/Notifications'));
}

export {
  About,
  Jun,
  Hds,
  Home,
  Error,
  Auth,
  User,
  Dashboard,
  Project,
  Store,
  Account,
  Partner,
  Support,
  Invoice,
  Notifications,
};
