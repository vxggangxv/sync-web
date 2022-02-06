import { put, all, takeLatest } from 'redux-saga/effects';
import { createSlice } from '@reduxjs/toolkit';
import { fetchReducerActions, createFetchAction, createSaga, fetchInitialState } from 'store/utils';
import * as invoiceApi from 'api/invoice';

export const fetch_invoice_init = createFetchAction('fetch_invoice_init');
export const fetch_invoices = createFetchAction('fetch_invoices');
export const fetch_invoice = createFetchAction('fetch_invoice');
export const create_invoice = createFetchAction('create_invoice');
export const fetch_project_invoice = createFetchAction('fetch_project_invoice');

interface InitialState {
  invoiceInit: object | any;
  invoices: object | any;
  invoice: object | any;
  createInvoice: object | any;
  projectInvoice: object | any;
}

const initialState: InitialState = {
  invoiceInit: { ...fetchInitialState, data: null },
  invoices: { ...fetchInitialState, data: null },
  invoice: { ...fetchInitialState, data: null },
  createInvoice: { ...fetchInitialState, data: null },
  projectInvoice: { ...fetchInitialState, data: null },
};

const slice = createSlice({
  name: 'invoice',
  initialState,
  reducers: {
    ...fetchReducerActions(fetch_invoice_init, 'invoiceInit'),
    ...fetchReducerActions(fetch_invoices, 'invoices'),
    ...fetchReducerActions(fetch_invoice, 'invoice'),
    ...fetchReducerActions(create_invoice, 'createInvoice'),
    ...fetchReducerActions(fetch_project_invoice, 'projectInvoice'),
  },
});

export const actions: any = slice.actions;

export function* invoiceSaga() {
  yield all([
    takeLatest(
      actions.fetch_invoice_init_request,
      createSaga(actions, 'fetch_invoice_init', invoiceApi.fetchInvoiceInit),
    ),
    takeLatest(
      actions.fetch_invoices_request,
      createSaga(actions, 'fetch_invoices', invoiceApi.fetchInvoices),
    ),
    takeLatest(
      actions.fetch_invoice_request,
      createSaga(actions, 'fetch_invoice', invoiceApi.fetchInvoice),
    ),
    takeLatest(
      actions.create_invoice_request,
      createSaga(actions, 'create_invoice', invoiceApi.createInvoice),
    ),
    takeLatest(
      actions.fetch_project_invoice_request,
      createSaga(actions, 'fetch_project_invoice', invoiceApi.fetchProjectInvoice),
    ),
  ]);
}

export default slice.reducer;
