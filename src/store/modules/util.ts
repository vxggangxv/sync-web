import { all, takeLatest } from 'redux-saga/effects';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchReducerActions, createFetchAction, createSaga, fetchInitialState } from 'store/utils';
import * as utilApi from 'api/util';

export const fetch_teeth_indication_format = createFetchAction('fetch_teeth_indication_format');
export const fetch_teeth_indication_info = createFetchAction('fetch_teeth_indication_info');
export const fetch_advertisement = createFetchAction('fetch_advertisement');
export const fetch_currency_list = createFetchAction('fetch_currency_list');
export const fetch_country_list = createFetchAction('fetch_country_list');
export const fetch_country_region_list = createFetchAction('fetch_country_region_list');

interface InitialState {
  teeth: object[];
  indicationFormat: object | any;
  indicationInfo: object | any;
  advertisement: object | any;
  currencyList: object | any;
  countryList: object | any;
  regionList: object | any;
}

const initialState: InitialState = {
  teeth: [
    {
      indicationIdx: 11,
      preparationType: 3,
      number: 22,
      reconstructionType: 31,
      material: 5,
      color: '#335C15',
      implantType: 4,
      situScan: 1,
      separateGingivaScan: 0,
      teethTreatmentIdx: 852,
    },
    {
      indicationIdx: 11,
      preparationType: 3,
      number: 23,
      reconstructionType: 31,
      material: 5,
      color: '#335C15',
      implantType: 4,
      situScan: 1,
      separateGingivaScan: 0,
      teethTreatmentIdx: 852,
    },
  ],
  indicationFormat: { ...fetchInitialState, data: null },
  indicationInfo: { ...fetchInitialState, data: null },
  advertisement: { ...fetchInitialState, data: null },
  currencyList: { ...fetchInitialState, data: null },
  countryList: { ...fetchInitialState, data: null },
  regionList: { ...fetchInitialState, data: null },
};

const slice = createSlice({
  name: 'util',
  initialState,
  reducers: {
    set_teeth: (state, { payload }: PayloadAction<object[]>) => {
      state.teeth = payload;
    },
    ...fetchReducerActions(fetch_teeth_indication_format, 'indicationFormat'),
    ...fetchReducerActions(fetch_teeth_indication_info, 'indicationInfo'),
    ...fetchReducerActions(fetch_advertisement, 'advertisement'),
    ...fetchReducerActions(fetch_currency_list, 'currencyList'),
    ...fetchReducerActions(fetch_country_list, 'countryList'),
    ...fetchReducerActions(fetch_country_region_list, 'regionList'),
  },
});

export const actions: any = slice.actions;

export function* utilSaga() {
  yield all([
    takeLatest(
      actions.fetch_teeth_indication_format_request,
      createSaga(actions, 'fetch_teeth_indication_format', utilApi.fetchTeethIndicationFormat),
    ),
    takeLatest(
      actions.fetch_teeth_indication_info_request,
      createSaga(actions, 'fetch_teeth_indication_info', utilApi.fetchTeethIndicationInfo),
    ),
    takeLatest(
      actions.fetch_advertisement_request,
      createSaga(actions, 'fetch_advertisement', utilApi.fetchAdvertisement),
    ),
    takeLatest(
      actions.fetch_currency_list_request,
      createSaga(actions, 'fetch_currency_list', utilApi.fetchCurrencyList),
    ),
    takeLatest(
      actions.fetch_country_list_request,
      createSaga(actions, 'fetch_country_list', utilApi.fetchCountryList),
    ),
    takeLatest(
      actions.fetch_country_region_list_request,
      createSaga(actions, 'fetch_country_region_list', utilApi.fetchCountryRegionList),
    ),
  ]);
}

export default slice.reducer;
