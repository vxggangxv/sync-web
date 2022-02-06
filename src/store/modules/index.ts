import { all, fork } from 'redux-saga/effects';
import { combineReducers } from 'redux';
import test, { testSaga } from './test';
import app, { appSaga } from './app';
import base, { baseSaga } from './base';
import auth, { authSaga } from './auth';
import util, { utilSaga } from './util';
import user, { userSaga } from './user';
import employee, { employeeSaga } from './employee';
import notification, { notificationSaga } from './notification';
import dashboard, { dashboardSaga } from './dashboard';
import partner, { partnerSaga } from './partner';
import invoice, { invoiceSaga } from './invoice';
import project, { projectSaga } from './project';
import bin, { binSaga } from './bin';
import file, { fileSaga } from './file';
import unit, { unitSaga } from './unit';
import support, { supportSaga } from './support';
import store, { storeSaga } from './store';

const rootReducer = combineReducers({
  test,
  app,
  base,
  auth,
  util,
  user,
  employee,
  notification,
  dashboard,
  partner,
  invoice,
  project,
  bin,
  file,
  unit,
  support,
  store,
});

export function* rootSaga() {
  yield all([
    fork(testSaga),
    fork(appSaga),
    fork(baseSaga),
    fork(authSaga),
    fork(utilSaga),
    fork(userSaga),
    fork(employeeSaga),
    fork(notificationSaga),
    fork(dashboardSaga),
    fork(partnerSaga),
    fork(invoiceSaga),
    fork(projectSaga),
    fork(binSaga),
    fork(fileSaga),
    fork(unitSaga),
    fork(supportSaga),
    fork(storeSaga),
  ]);
}

export default rootReducer;
