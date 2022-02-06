import { FormControl, Grid, IconButton, MenuItem, Tab, Tabs } from '@material-ui/core';
import {
  icon_check,
  product_calendar,
  icon_dashboard_lecture,
  icon_dashboard_notifications,
  icon_dashboard_partner,
  icon_dashboard_product,
  icon_dashboard_sale,
  icon_dashboard_schedule,
  dashboard_banner,
  icon_dashboard_project,
} from 'components/base/images';
import Calendar from 'react-calendar';
import React, { Fragment, useEffect, useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import { color } from 'styles/utils';
import moment from 'moment';
// import 'react-calendar/dist/Calendar.css';
import 'styles/lib/reactCalendar.css';
import cx from 'classnames';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ArrowLeftIcon from '@material-ui/icons/ArrowLeft';
import ArrowRightIcon from '@material-ui/icons/ArrowRight';
import MuiWrapper from 'components/common/input/MuiWrapper';
import { Select } from '@material-ui/core';
import FilterIcon from 'components/base/icons/FilterIcon';
import LineChart from 'components/common/chart/LineChart';
import CustomSpan from 'components/common/text/CustomSpan';
import CustomText from 'components/common/text/CustomText';
import CloseIcon from '@material-ui/icons/Close';
import CustomCheckbox from 'components/common/checkbox/CustomCheckbox';
import BarChart from 'components/common/chart/BarChart';
import { a11yProps, capitalize } from 'lib/library';
import TabPanel from 'components/common/tab/TabPanel';
import DonutChart from 'components/common/chart/DonutChart';
import ProgressBarCard from 'components/dashboard/ProgressBarCard';
import ListItemWithIcon from 'components/dashboard/ListItemWithIcon';
import { Link, useHistory } from 'react-router-dom';
import LectureSlider from './LectureSlider';
import { downloadFile } from 'store/utils';
import { useShallowAppSelector } from 'store/hooks';
import { pageUrl, projectProcessFlagList } from 'lib/mapper';
import ListBackgroundVeticalDivision from 'components/common/background/ListBackgroundVeticalDivision';
import MuiButton from 'components/common/button/MuiButton';
import CustomMuiCheckbox from 'components/common/checkbox/CustomMuiCheckbox';
import InfiniteScroll from 'react-infinite-scroll-component';
import CircularLoading from 'components/base/loading/CircularLoading';
import AdvertisementArea1Slider from './AdvertisementArea1Slider';
import AsyncFetchSelect from 'components/common/select/AsyncFetchSelect';

// TODO: api연동 후 데이터 타입 매핑
interface DashboardProps {
  scheduleDuedateCount: {
    day: number;
    week: number;
    month: number;
  };
  scheduleStageCount: {
    progress: number;
    completed: number;
    new: number;
  };
  mainNotifications: {
    category: string;
    enrollDate: number;
    // fromEmail: string;
    fromName: string;
    isRead: number;
    // modifyDate: number | null;
    title: string;
    type: string;
    _id: string;
  }[];
  hasMoreMainNotifications: boolean;
  // mainNotificationsPagingData: {
  //   endPage: number;
  //   nextPage: number;
  //   page: number;
  //   prevPage: number;
  //   startPage: number;
  //   totalPage: number;
  // };
  syncPartners: {
    email: string;
    groupCode: string;
    isSelf: number;
    name: string;
    partnerType: number | null;
    userGroupIdx: number;
  }[];
  hasMoreSyncPartners: boolean;
  // syncPartnersPagingData: {
  //   endPage: number;
  //   nextPage: number;
  //   page: number;
  //   prevPage: number;
  //   startPage: number;
  //   totalPage: number;
  // };
  projectChartItems: {
    color: string;
    data: {
      groupDate: string;
      stage: number;
      totalCount: number;
    }[];
    id: string;
    index: number;
  };
  projectGraphPagingData: {
    hasPrevData: number;
    hasNextData: number;
  };
  mainPartners: {
    accountType: number;
    lastLogin: number;
    name: string;
    partnerType: number;
    partnershipIdx: number;
    profileImg: string | null;
    userGroupIdx: number;
  }[];
  hasMoreMainPartners: boolean;
  // mainPartnersPagingData: {
  //   endPage: number;
  //   nextPage: number;
  //   page: number;
  //   prevPage: number;
  //   startPage: number;
  //   totalPage: number;
  // };
  advertisementArea1: {
    contentUrl: string;
    linkUrl: string;
    // priority: number;
    type: string;
  }[];
  advertisementLecture: {
    contentUrl: string;
    linkUrl: string;
    // priority: number;
    // type: string;
  }[];
  //
  date: { value: Date; onChange: (e: any) => void; setValue: React.Dispatch<Date> };
  orderType: { value: string; onChange: (e: any) => void; setValue: React.Dispatch<string> };
  selectedSyncPartner: {
    value: string;
    onChange: (e: any) => void;
    setValue: React.Dispatch<string>;
  };
  checkedProjectProcess: {
    value: Set<number>;
    onChange: (e: any) => void;
    setValue: React.Dispatch<Set<number>>;
  };
  currentProjectDuration: any;
  projectDurationType: {
    value: string;
    onChange: (e: any) => void;
    setValue: React.Dispatch<string>;
  };
  onChangeProjectDuration: (value: string) => void;
  salesDuration: { value: string; onChange: (e: any) => void; setValue: React.Dispatch<string> };
  salesPartner: { value: string; onChange: (e: any) => void; setValue: React.Dispatch<string> };
  material: { value: string; onChange: (e: any) => void; setValue: React.Dispatch<string> };
  checkedMyPartnerType: {
    value: Set<number>;
    onChange: (e: any) => void;
    setValue: React.Dispatch<Set<number>>;
  };
  myPartnerOrder: {
    value: string;
    onChange: (e: any) => void;
    setValue: React.Dispatch<any>;
  };
  onFetchMainNotifications: () => void;
  onFetchSyncPartners: () => void;
  onSearchSyncPartners: (value: string) => void;
  onFetchMainPartners: () => void;
}

function Dashboard({
  scheduleDuedateCount,
  scheduleStageCount,
  mainNotifications,
  // mainNotificationsPagingData,
  hasMoreMainNotifications,
  syncPartners,
  // syncPartnersPagingData,
  hasMoreSyncPartners,
  projectChartItems,
  projectGraphPagingData,
  mainPartners,
  // mainPartnersPagingData,
  hasMoreMainPartners,
  advertisementArea1,
  advertisementLecture,
  //
  date,
  orderType,
  selectedSyncPartner,
  checkedProjectProcess,
  projectDurationType,
  currentProjectDuration,
  onChangeProjectDuration,
  salesDuration,
  salesPartner,
  material,
  checkedMyPartnerType,
  myPartnerOrder,
  //
  onFetchMainNotifications,
  onFetchSyncPartners,
  onSearchSyncPartners,
  onFetchMainPartners,
}: DashboardProps) {
  const {
    accessToken,
    userGroupIdx,
    mainNotificationsPending,
    syncPartnersPending,
    mainPartnersPending,
  } = useShallowAppSelector(state => ({
    accessToken: state.auth.accessToken,
    userGroupIdx: state.user.user?.userGroupIdx,
    mainNotificationsPending: state.notification.mainNotifications.pending,
    syncPartnersPending: state.partner.syncPartners.pending,
    mainPartnersPending: state.partner.mainPartners.pending,
  }));
  const [materialConfigOpen, setMaterialConfigOpen] = useState(false);
  const [myProductTab, setMyProductTab] = useState(0);
  // const [notificationsTab, setNotificationsTab] = useState(0);
  // const [productManualTab, setProductManualTab] = useState(0);

  const history = useHistory();

  // TEST:
  // useEffect(() => {
  //   console.log(currentProjectDuration);
  //   console.log(moment(currentProjectDuration).format('MMM. DD. YYYY'));
  // }, [currentProjectDuration]);

  // TODO: 받은 date data를 기준으로 format변경 후 배열로 리턴
  const calendarMark = ['2021-11-01', '2021-11-10', '2021-11-15'];
  const processList = ['New', 'Preparation', 'Scan', 'CAD', 'CAM', 'Milling', 'Post', 'Completed'];

  const projectDurationTypeList = [
    // {
    //   label: '10years',
    //   value: '10Y',
    // },
    {
      label: '1year',
      value: '1Y',
    },
    {
      label: '30days',
      value: '1M',
    },
    {
      label: '7days',
      value: '1W',
    },
  ];

  // const syncItemName = syncItem?.name ? syncItem.name.replace('Sync', '').trim() : '';
  // const syncItemUseVolume = syncItem?.useVolume;
  // const syncItemVolume = syncItem?.volume;
  const syncItemName = 'Professional';
  const syncItemUseVolume = 15;
  const syncItemVolume = 100;
  const syncChartItems = [
    { title: 'available', value: syncItemVolume - syncItemUseVolume, color: '#F4F5FA' },
    { title: syncItemName, value: syncItemUseVolume, color: color.blue },
  ];

  const warrantyItems = [
    {
      serial: 1,
      name: 'Freedom',
      startPeriod: 1628446354,
      endPeriod: 1628891159,
    },
  ];

  const licenseItems = [
    {
      serial: 1,
      name: 'ScanApp',
      startPeriod: 1628446354,
      endPeriod: 1628891159,
    },
  ];

  // TODO: material config modal
  const indicationList = [
    'Crowns and coping',
    'Pontics',
    'Inlays, onlays and veneers',
    'Digital copy milling',
    'Removables and appliances',
    'Bars',
    'Residual dentition',
  ];

  // SECTION: function

  // TODO: Product Manual click action
  const handleDownloadManual = (value: object | any) => {
    const { name, url } = value;
    // console.log('value', value);
    // console.log('`${url}&token=${accessToken}`', `${url}&token=${accessToken}`);
    downloadFile({
      url: `${url}&token=${accessToken}`,
      name,
      // config: {
      //   headers: {
      //     'x-access-token': accessToken,
      //   },
      // },
      success() {},
    });
    return;
  };

  // SECTION: DidUpdate
  // TODO: 차후 차트쪽 데이터 업데이트시 애니메이션 적용을 위해 적용
  const [totalSalesData, setTotalSalesData] = useState<object[] | []>([]);
  const chartData = [
    { x: '08-07', y: 2 },
    { x: '08-08', y: 0 },
    { x: '08-09', y: 0 },
    { x: '08-10', y: 0 },
    { x: '08-11', y: 5 },
    { x: '08-12', y: 0 },
    { x: '08-13', y: 0 },
  ];
  useEffect(() => {
    const animation = setTimeout(() => setTotalSalesData(chartData), 1);
    return () => {
      clearTimeout(animation);
    };
  }, []);
  //

  // TEMP:
  // useEffect(() => {
  //   console.log('today', moment(date.value).format('YYYY-MM-DD'));
  // }, [date.value]);

  return (
    <Styled.Dashboard data-component-name="Dashboard">
      <h1 className="sr-only">Dashboard</h1>

      <Grid container className="dashboard__container">
        {/* 1 row */}
        <Grid item className="dashboard__schedule">
          <div className="dashboard__card_title_box">
            <h3 className="dashboard__card_title">
              <img
                src={icon_dashboard_schedule}
                alt="calandar"
                className="dashboard__card_title_icon"
              />
              Schedule
            </h3>
          </div>

          <div className="dashboard__schedule_content_box">
            <div className="dashboard__calendar_box box-shadow-default">
              <Calendar
                // value={[new Date(2021, 7, 28), new Date(2021, 7, 29)]}
                // weekNumbers={true}
                // date={[moment('2021-07-20'), moment('2021-07-24'), moment('2021-07-27')]}
                // showFixedNumberOfWeeks
                // defaultValue={new Date()}
                value={date.value}
                onChange={(value: any) => date.setValue(value)}
                calendarType="US"
                locale="en-US"
                className="dashboard__calendar"
                tileClassName={({ date, view }): string | any => {
                  // console.log(date);
                  let returnClassName = '';
                  if (moment(date).diff(moment(), 'd') < 0) {
                    returnClassName = returnClassName + ' lastday';
                  }
                  if (calendarMark.find(x => x === moment(date).format('YYYY-MM-DD'))) {
                    // console.log('workday');
                    returnClassName = returnClassName + ' workday';
                  }
                  return returnClassName;
                }}
                prevLabel={<ChevronLeftIcon fontSize="large" />}
                nextLabel={<ChevronRightIcon fontSize="large" />}
              />
              <div className="dashboard__calendar_projects">
                <b>Due date projects</b> Day : {scheduleDuedateCount?.day}
                <span>l</span> Week : {scheduleDuedateCount?.week} <span>l</span> Month :{' '}
                {scheduleDuedateCount?.month}
              </div>
            </div>
            <div className="dashboard__today">
              <Grid container className="dashboard__today_title" alignItems="center">
                <Grid item className="dashboard__today_label">
                  <CustomText fontSize={27} fontWeight={700}>
                    Today
                  </CustomText>
                  <CustomText fontWeight={300} marginTop={15}>
                    Due date projects
                  </CustomText>
                </Grid>
              </Grid>

              <Grid container className="dashboard__today_total" alignItems="center">
                <Grid item className="dashboard__today_label">
                  <CustomSpan fontSize={18}>Total</CustomSpan>
                </Grid>
                <Grid item className="dashboard__today_number">
                  <CustomSpan fontSize={37} fontWeight={700}>
                    {scheduleStageCount?.progress +
                      scheduleStageCount?.completed +
                      scheduleStageCount?.new}
                  </CustomSpan>
                </Grid>
              </Grid>

              <Grid container className="dashboard__today_content" justifyContent="space-between">
                <Grid item className="dashboard__today_label">
                  - Progress
                </Grid>
                <Grid item className="dashboard__today_number">
                  {scheduleStageCount?.progress}
                </Grid>
                <Grid item className="dashboard__today_label">
                  - Completed
                </Grid>
                <Grid item className="dashboard__today_number">
                  {scheduleStageCount?.completed}
                </Grid>
                <Grid item className="dashboard__today_label">
                  - New
                </Grid>
                <Grid item className="dashboard__today_number">
                  {scheduleStageCount?.new}
                </Grid>
              </Grid>
            </div>
          </div>
        </Grid>
        <Grid item className="dashboard__notifications">
          <div className="dashboard__card_title_box">
            <h2 className="dashboard__card_title">
              <img
                src={icon_dashboard_notifications}
                alt="calandar"
                className="dashboard__card_title_icon"
              />
              Notifications
              <IconButton
                className="dashboard__card_title_more_btn"
                onClick={() => history.push(pageUrl.notifications.index)}
              >
                <ChevronRightIcon htmlColor="white" />
              </IconButton>
            </h2>
            {/* // TODO: link 연결 */}
            {/* <Link
              to={notificationsTab === 0 ? '/' : '/'}
              className="btn-reset dashboard__card_title_more_btn"
            >
              More <ChevronRightIcon fontSize="inherit" />
            </Link> */}
          </div>

          <div className="dashboard__notifications_content_box box-shadow-default border-radius-default">
            <div className="dashboard__notifications_list_box">
              <ListBackgroundVeticalDivision
                borderWidth={5}
                borderStyle="solid"
                borderColor="#F4F5FA"
              />
              {!mainNotifications?.length && mainNotificationsPending ? (
                <div className="infinite-scroll-loading">
                  <CircularLoading />
                </div>
              ) : (
                <InfiniteScroll
                  className="dashboard__notifications_scroll infinite-scroll-box"
                  dataLength={mainNotifications?.length}
                  next={onFetchMainNotifications}
                  hasMore={hasMoreMainNotifications}
                  // next={() => {}}
                  // hasMore={true}
                  loader={
                    <div className="infinite-scroll-loading">
                      <CircularLoading />
                    </div>
                  }
                  scrollThreshold={0}
                  height={450}
                >
                  {!!mainNotifications?.length &&
                    mainNotifications.map((item, idx) => (
                      <Fragment key={idx}>
                        <ListItemWithIcon
                          title={item.title}
                          type={capitalize(item.category)}
                          typeColor={'#0055B5'}
                          date={moment(item.enrollDate).format('MMM. DD. HH:mm')}
                          hasFirstMarginTop
                          marginTop={30}
                          column={2}
                          itemPaddingLeft={30}
                          className="dashboard__notifications_item"
                        />
                      </Fragment>
                    ))}
                </InfiniteScroll>
              )}
            </div>
          </div>
        </Grid>

        {/* 2 row */}
        <Grid item container className="dashboard__project_status_container">
          <div className="dashboard__card_title_box">
            <h2 className="dashboard__card_title">
              <img
                src={icon_dashboard_schedule}
                alt="calandar"
                className="dashboard__card_title_icon"
              />
              Total Project Status
            </h2>
          </div>
          <Grid item className="dashboard__project_status border-radius-default">
            {/* <h2>Total Project Status</h2> */}
            <div className="dashboard__project_status_order_btn_box">
              <button
                className={cx('dashboard__project_status_order_btn btn-reset', {
                  active: orderType.value.includes('0'),
                })}
                onClick={() => orderType.setValue('0')}
              >
                Take an order
              </button>
              <button
                className={cx('dashboard__project_status_order_btn btn-reset', {
                  active: orderType.value.includes('1'),
                })}
                onClick={() => orderType.setValue('1')}
              >
                Place an order
              </button>
            </div>
            <div className="dashboard__project_status_option_duration">
              <CustomText fontSize={15} fontWeight={700} fontColor="white">
                Due
              </CustomText>
              <MuiWrapper className="sm">
                <FormControl fullWidth variant="outlined">
                  <Select
                    MenuProps={{
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      getContentAnchorEl: null,
                    }}
                    name="projectDurationType"
                    displayEmpty
                    value={projectDurationType.value}
                    onChange={projectDurationType.onChange}
                  >
                    {projectDurationTypeList.map((item, idx) => (
                      <MenuItem value={item.value} key={idx}>
                        {item.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </MuiWrapper>
            </div>
            <div className="dashboard__project_status_option_partner">
              <CustomText fontSize={15} fontWeight={700} fontColor="white">
                Partner
              </CustomText>
              <AsyncFetchSelect
                className="sm"
                fullWidth
                fontColor="white"
                borderColor="white"
                hoverBorderColor="white"
                activeBorderColor="white"
                bgColor="transparent"
                loadingIconColor="white"
                dropIconColor="white"
                inputProps={{
                  selectedValue: selectedSyncPartner.value,
                  setSelectedValue: selectedSyncPartner.setValue,
                  data: syncPartners,
                  hasMoreData: hasMoreSyncPartners,
                  idKey: 'userGroupIdx',
                  labelKey: 'name',
                  exceptId: orderType.value === '0' ? userGroupIdx : '',
                  onFetch: onFetchSyncPartners,
                  searchLoading: syncPartnersPending,
                  onSearch: onSearchSyncPartners,
                }}
              />
              {/* <MuiWrapper className="sm">
                <FormControl fullWidth variant="outlined">
                  <Select
                    MenuProps={{
                      anchorOrigin: {
                        vertical: 'bottom',
                        horizontal: 'left',
                      },
                      getContentAnchorEl: null,
                    }}
                    name="projectPartner"
                    displayEmpty
                    value={projectPartner.value}
                    onChange={projectPartner.onChange}
                  >
                    <MenuItem value="">All</MenuItem>
                    {!!syncPartners?.length &&
                      syncPartners.map(item => (
                        <MenuItem key={item.userGroupIdx} value={item.userGroupIdx}>
                          {item.name}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </MuiWrapper> */}
            </div>

            <div className="dashboard__project_status_filter_process">
              <h3>
                <FilterIcon /> Project process
              </h3>
              <div className="dashboard__project_status_filter_box">
                <ul className="dashboard__project_status_filter_list">
                  {projectProcessFlagList.map((item, idx) => {
                    return (
                      <li
                        className={cx(`dashboard__project_status_filter_item`, {
                          active: checkedProjectProcess.value.has(item.id),
                        })}
                        key={idx}
                        onClick={() => checkedProjectProcess.onChange({ value: item.id })}
                      >
                        <span
                          className={`dashboard__project_status_filter_check ${item.index}`}
                          style={{
                            backgroundColor: checkedProjectProcess.value.has(item.id)
                              ? item.color
                              : 'transparent',
                          }}
                        >
                          <img src={icon_check} alt="check icon" />
                        </span>{' '}
                        {item.name}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </Grid>
          <Grid item className="dashboard__project_chart border-radius-default">
            <div className="dashboard__project_chart_regends">
              <div className="dashboard__project_chart_duration_box flex-center">
                {!!projectGraphPagingData?.hasPrevData && (
                  <button className="btn-reset" onClick={() => onChangeProjectDuration('prev')}>
                    <ArrowLeftIcon htmlColor={color.gray_week} fontSize="large" />
                  </button>
                )}
                <CustomSpan fontSize={17} fontWeight={700} marginLeft={5} marginRight={5}>
                  {projectDurationType.value === '1W' &&
                    `${moment(currentProjectDuration)
                      .subtract(6, 'd')
                      .format('MMM. DD. YYYY')} ~ ${moment(currentProjectDuration).format(
                      'MMM. DD. YYYY',
                    )}`}
                  {projectDurationType.value === '1M' &&
                    moment(currentProjectDuration).format('MMM. YYYY')}
                  {projectDurationType.value === '1Y' &&
                    moment(currentProjectDuration).format('YYYY')}
                </CustomSpan>
                {!!projectGraphPagingData?.hasNextData && (
                  <button className="btn-reset" onClick={() => onChangeProjectDuration('next')}>
                    <ArrowRightIcon htmlColor={color.gray_week} fontSize="large" />
                  </button>
                )}
              </div>
              <ul className="dashboard__project_chart_regends_category_list">
                {projectProcessFlagList.map((item, idx) => {
                  return (
                    <li className="dashboard__project_chart_regends_category_item" key={idx}>
                      <span
                        className={`dashboard__project_chart_regends_category_symbol ${item.index}`}
                        style={{
                          backgroundColor: item.color,
                        }}
                      ></span>
                      {item.name}
                    </li>
                  );
                })}
              </ul>
            </div>
            <div className="dashboard__project_chart_item">
              {useMemo(
                () => (
                  <LineChart
                    className="overview__chart"
                    width={1150}
                    height={350}
                    data={projectChartItems}
                    // legendsData={projectLegendsItems}
                  />
                ),
                [projectChartItems],
              )}
            </div>
          </Grid>
        </Grid>

        {/* 3 row */}
        <Grid item className="dashboard__sales">
          <div className="dashboard__card_title_box">
            <h2 className="dashboard__card_title">
              <img src={icon_dashboard_sale} alt="sale" />
              Sales
            </h2>
          </div>
          <div className="dashboard__sales_total">
            <CustomSpan fontSize={22} fontWeight={500} marginRight={15}>
              Total
            </CustomSpan>
            <CustomSpan fontSize={28} fontWeight={700}>
              ￦ 230,120,000
            </CustomSpan>
          </div>
          <div className="dashboard__sales_chart_container box-shadow-default">
            <div className="dashboard__sales_option_box">
              <div className="dashboard__sales_option_list">
                <div className="dashboard__sales_option_due">
                  <CustomText fontSize={15} fontWeight={700}>
                    Due
                  </CustomText>
                  <MuiWrapper isGlobalStyle className="sm">
                    <FormControl fullWidth variant="outlined">
                      <Select
                        MenuProps={{
                          anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left',
                          },
                          getContentAnchorEl: null,
                        }}
                        name="salesDuration"
                        value={salesDuration.value}
                        // renderValue={selected => selected}
                        onChange={salesDuration.onChange}
                      >
                        <MenuItem value="1Y">1 Year</MenuItem>
                        <MenuItem value="1M">1 Month</MenuItem>
                        <MenuItem value="1W">1 Week</MenuItem>
                      </Select>
                    </FormControl>
                  </MuiWrapper>
                </div>
                <div className="dashboard__sales_option_partner">
                  <CustomText fontSize={15} fontWeight={700}>
                    Partner
                  </CustomText>
                  <MuiWrapper isGlobalStyle className="sm">
                    <FormControl fullWidth variant="outlined">
                      <Select
                        MenuProps={{
                          anchorOrigin: {
                            vertical: 'bottom',
                            horizontal: 'left',
                          },
                          getContentAnchorEl: null,
                        }}
                        name="salesPartner"
                        value={salesPartner.value}
                        // renderValue={selected => selected}
                        onChange={salesPartner.onChange}
                      >
                        <MenuItem value="receiver">receiver</MenuItem>
                        <MenuItem value="DOFLAB">DOFLAB</MenuItem>
                      </Select>
                    </FormControl>
                  </MuiWrapper>
                </div>
                <div className="dashboard__sales_option_material">
                  <CustomText fontSize={15} fontWeight={700}>
                    Material
                  </CustomText>
                  <MuiButton
                    config={{
                      bgColor: 'white',
                      borderColor: color.gray_week,
                    }}
                    fullWidth
                    variant="outlined"
                    className="sm border-radius-round"
                    onClick={() => setMaterialConfigOpen(draft => !draft)}
                  >
                    Select
                  </MuiButton>

                  {materialConfigOpen && (
                    <div className="dashboard__sales_material_config_modal materialConfigModal">
                      <div className="materialConfigModal__header">
                        <h3>
                          <CustomSpan fontSize={12} fontWeight={400} marginRight={10}>
                            [Auto Apply]
                          </CustomSpan>{' '}
                          Select Material configuration
                        </h3>
                        <button
                          className="btn-reset materialConfigModal__close_btn"
                          onClick={() => setMaterialConfigOpen(false)}
                        >
                          <CloseIcon htmlColor="white" fontSize="inherit" />
                        </button>
                      </div>
                      <div className="materialConfigModal__body">
                        <ul className="materialConfigModal__select_list">
                          {indicationList.map((item, idx) => {
                            // TODO: change active className
                            const isActive = material.value.includes('Anatomic');

                            return (
                              <li className="materialConfigModal__select_item" key={idx}>
                                <CustomText
                                  fontSize={15}
                                  fontWeight={500}
                                  style={{ paddingLeft: 14 }}
                                >
                                  <CustomCheckbox
                                    checked={material.value.includes('Anatomic')}
                                    color={color.black_font}
                                  />{' '}
                                  {item}
                                </CustomText>
                                <MuiWrapper
                                  isGlobalStyle
                                  className={cx({ active: isActive })}
                                  config={{
                                    activeBorderColor: '#9F00A7',
                                  }}
                                >
                                  <FormControl fullWidth variant="outlined">
                                    <Select
                                      MenuProps={{
                                        anchorOrigin: {
                                          vertical: 'bottom',
                                          horizontal: 'left',
                                        },
                                        getContentAnchorEl: null,
                                        marginThreshold: 10,
                                      }}
                                      name="material"
                                      value={material.value}
                                      renderValue={selected => (
                                        <>
                                          <CustomCheckbox
                                            checked={material.value.includes('Anatomic')}
                                            color="#9F00A7"
                                          />{' '}
                                          {selected}
                                        </>
                                      )}
                                      onChange={material.onChange}
                                    >
                                      <MenuItem value="Anatomic">
                                        <CustomCheckbox
                                          checked={material.value.includes('Anatomic')}
                                          color="#9F00A7"
                                          marginLeft={4}
                                          marginRight={9}
                                        />{' '}
                                        {'Anatomic crown'}
                                      </MenuItem>
                                      <MenuItem value="Coping">
                                        <CustomCheckbox
                                          checked={material.value.includes('Coping')}
                                          marginLeft={4}
                                          marginRight={9}
                                        />{' '}
                                        {'Coping'}
                                      </MenuItem>
                                    </Select>
                                  </FormControl>
                                </MuiWrapper>
                              </li>
                            );
                          })}
                        </ul>

                        <ul className="materialConfigModal__selected_list">
                          {/* TODO: indicationList 안에 selectedMaterial 데이터 표시  */}
                          {indicationList.map((item, idx) => (
                            <li
                              key={idx}
                              className="materialConfigModal__selected_item"
                              title="Anatomic crown"
                            >
                              <div className="materialConfigModal__selected_item_label">{item}</div>
                              <div className="materialConfigModal__selected_item_meterial_list">
                                <div
                                  className="materialConfigModal__selected_item_meterial_item"
                                  style={{ backgroundColor: '#9F00A7' }}
                                >
                                  <p>Anatomic crownAnatomic crown</p>
                                  <button className="btn-reset materialConfigModal__selected_item_meterial_item_delete_btn">
                                    <CloseIcon htmlColor="white" fontSize="inherit" />
                                  </button>
                                </div>
                                <div
                                  className="materialConfigModal__selected_item_meterial_item"
                                  style={{ backgroundColor: '#9F00A7' }}
                                >
                                  <p>Coping</p>
                                  <button className="btn-reset materialConfigModal__selected_item_meterial_item_delete_btn">
                                    <CloseIcon htmlColor="white" fontSize="inherit" />
                                  </button>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )}
                </div>
                <div className="dashboard__sales_option_info">
                  <div className="dashboard__sales_option_info_item">
                    <CustomSpan fontSize={15} fontWeight={500} fontColor={color.blue} width={90}>
                      <b>·</b> Projects
                    </CustomSpan>
                    <CustomSpan fontSize={14}>{'1,000'}</CustomSpan>
                  </div>
                  <div className="dashboard__sales_option_info_item">
                    <CustomSpan fontSize={15} fontWeight={500} fontColor={color.blue} width={90}>
                      <b>·</b> Sales
                    </CustomSpan>
                    <CustomSpan fontSize={14}>{'￦ 230,120,000'}</CustomSpan>
                  </div>
                </div>
              </div>
            </div>
            <div className="dashboard__sales_chart_box">
              <div className="dashboard__sales_chart">
                <BarChart width={700} height={360} data={totalSalesData} />
              </div>
            </div>
          </div>
        </Grid>
        <Grid item className="dashboard__store">
          <div className="dashboard__card_title_box">
            <h2 className="dashboard__card_title">
              <img src={icon_dashboard_product} alt="product" />
              My Products
              <IconButton
                className="dashboard__card_title_more_btn"
                onClick={() => history.push(pageUrl.store.index)}
              >
                <ChevronRightIcon htmlColor="white" />
              </IconButton>
            </h2>
          </div>

          <div className="dashboard__store_content_box box-shadow-default border-radius-default">
            <Tabs
              value={myProductTab}
              onChange={(e, value) => setMyProductTab(value)}
              aria-label="myproduct tabs"
              className="dashboard__store_tabs"
            >
              {['Data', 'Warranty', 'License'].map((item, idx) => (
                <Tab
                  className="dashboard__store_tab"
                  key={idx}
                  label={item}
                  disableRipple
                  {...a11yProps(idx, 'myProductTab')}
                />
              ))}
            </Tabs>

            <TabPanel
              value={myProductTab}
              index={0}
              name="myProductTab"
              className="dashboard__store_tabpanel"
            >
              <div className="dashboard__store_tabpanel_data_content_box">
                <div className="dashboard__store_tabpanel_content data">
                  <div className="dashboard__store_tabpanel_chart">
                    <DonutChart
                      data={syncChartItems}
                      width={175}
                      lineWidth={10}
                      rounded
                      startAngle={
                        -90 -
                        (360 * syncChartItems[0].value) /
                          (syncChartItems[0].value + syncChartItems[1].value)
                      }
                    >
                      <div className="dashboard__store_tabpanel_product_box">
                        <div className="dashboard__store_tabpanel_product">
                          <img src={product_calendar} alt="calendar" />
                          <CustomText
                            fontSize={22}
                            fontStyle="italic"
                            fontColor={color.navy_blue}
                            fontWeight={500}
                            marginTop={10}
                          >
                            {syncChartItems[1].title}
                          </CustomText>
                        </div>
                      </div>
                    </DonutChart>
                  </div>
                  <div className="dashboard__store_tabpanel_chart_info_box">
                    <div className="dashboard__store_tabpanel_chart_info">
                      <div className="dashboard__store_tabpanel_chart_info_label">
                        <span
                          className="dashboard__store_tabpanel_chart_info_circle"
                          style={{
                            backgroundColor: syncChartItems[1].color,
                          }}
                        ></span>
                        사용용량
                      </div>
                      <div className="dashboard__store_tabpanel_chart_info_data">
                        - <CustomSpan fontSize={20}>{syncChartItems[1].value}</CustomSpan>{' '}
                        <CustomSpan fontSize={14} fontColor="#7C7C7C">
                          GB
                        </CustomSpan>
                      </div>
                    </div>

                    <div className="dashboard__store_tabpanel_chart_info">
                      <div className="dashboard__store_tabpanel_chart_info_label">
                        <span
                          className="dashboard__store_tabpanel_chart_info_circle"
                          style={{
                            // backgroundColor: syncChartItems[0].color,
                            backgroundColor: '#E2E4EE',
                          }}
                        ></span>
                        사용 가능용량
                      </div>
                      <div className="dashboard__store_tabpanel_chart_info_data">
                        - <CustomSpan fontSize={20}>{syncChartItems[0].value}</CustomSpan>{' '}
                        <CustomSpan fontSize={14} fontColor="#7C7C7C">
                          GB
                        </CustomSpan>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="dashboard__store_lack_box">
                  <CustomSpan fontSize={15}>Do you have insufficient data capacity?</CustomSpan>
                  <MuiButton
                    config={{
                      width: 140,
                    }}
                    disableElevation
                    variant="contained"
                    color="primary"
                    onClick={() => {}}
                    className="xs border-radius-round"
                  >
                    Upgrade
                    <CustomSpan marginRight={-17} style={{ lineHeight: 0 }}>
                      <ChevronRightIcon htmlColor="white" />
                    </CustomSpan>
                  </MuiButton>
                </div>
              </div>
            </TabPanel>
            <TabPanel
              value={myProductTab}
              index={1}
              name="myProductTab"
              className="dashboard__store_tabpanel"
            >
              <div className="dashboard__store_tabpanel_content warranty">
                {!!warrantyItems?.length ? (
                  <>
                    {warrantyItems.map((item, idx) => (
                      <ProgressBarCard
                        key={item.serial}
                        name={item.name}
                        startPeriod={item.startPeriod}
                        endPeriod={item.endPeriod}
                      />
                    ))}
                  </>
                ) : (
                  <div className="dashboard__store_tabpanel_no_data">
                    There are no registered devices. <br />
                    Register your device on My Page <br />
                    or purchase a warranty.
                  </div>
                )}
              </div>
            </TabPanel>
            <TabPanel
              value={myProductTab}
              index={2}
              name="myProductTab"
              className="dashboard__store_tabpanel"
            >
              <div className="dashboard__store_tabpanel_content license">
                {!!licenseItems?.length ? (
                  <>
                    {licenseItems.map((item, idx) => (
                      <ProgressBarCard
                        key={item.serial}
                        name={item.name}
                        startPeriod={item.startPeriod}
                        endPeriod={item.endPeriod}
                      />
                    ))}
                  </>
                ) : (
                  <div className="dashboard__store_tabpanel_no_data">
                    There is no license in use. <br />
                    It can be used after purchase in the store.
                  </div>
                )}
              </div>
            </TabPanel>
          </div>
        </Grid>

        <Grid item className="dashboard__banner dashboard__slider_box">
          {/* <img src={dashboard_banner} alt="dashboard_banner" /> */}
          {/* <AdvertisementArea1Slider data={} /> */}
          <AdvertisementArea1Slider />
        </Grid>

        {/* 4 row */}
        <Grid item className="dashboard__new_projects">
          <div className="dashboard__card_title_box">
            <h2 className="dashboard__card_title">
              <img
                src={icon_dashboard_project}
                alt="project"
                className="dashboard__card_title_icon"
              />
              Updated Projects
              <IconButton
                className="dashboard__card_title_more_btn"
                onClick={() => history.push(pageUrl.project.list)}
              >
                <ChevronRightIcon htmlColor="white" />
              </IconButton>
            </h2>
          </div>

          <div className="dashboard__new_projects_content_box box-shadow-default border-radius-default">
            <div className="dashboard__new_projects_list_box">
              <ListBackgroundVeticalDivision
                borderWidth={5}
                borderStyle="solid"
                borderColor="#F4F5FA"
              />
              <div className="dashboard__new_projects_list infinite-scroll-box">
                {Array.from({ length: 15 }).map((item, idx) => (
                  <Fragment key={idx}>
                    <ListItemWithIcon
                      title={`Project Name`}
                      type={'Client name'}
                      // typeColor={'#0055B5'}
                      date={moment().format('MMM. DD. HH:mm')}
                      hasFirstMarginTop
                      marginTop={30}
                      column={2}
                      itemPaddingLeft={30}
                      className="dashboard__new_projects_item"
                    />
                  </Fragment>
                ))}
              </div>
            </div>
          </div>
        </Grid>
        <Grid item className="dashboard__partners">
          <div className="dashboard__card_title_box">
            <h2 className="dashboard__card_title">
              <img
                src={icon_dashboard_partner}
                alt="partner"
                className="dashboard__card_title_icon"
              />
              My Partners
              <IconButton
                className="dashboard__card_title_more_btn"
                onClick={() => history.push(pageUrl.partner.list)}
              >
                <ChevronRightIcon htmlColor="white" />
              </IconButton>
            </h2>
          </div>

          <div className="dashboard__partners_content_box box-shadow-default border-radius-default">
            <div className="dashboard__partners_list_filter_box">
              <label className="inline-flex-center cursor-pointer">
                <CustomMuiCheckbox
                  checked={checkedMyPartnerType.value.has(0)}
                  onChange={() => checkedMyPartnerType.onChange({ value: 0 })}
                  activeColor={color.clinic}
                  padding={0}
                />
                <CustomSpan fontSize={15} marginLeft={10}>
                  Clinic
                </CustomSpan>
              </label>

              <label className="inline-flex-center cursor-pointer">
                <CustomMuiCheckbox
                  checked={checkedMyPartnerType.value.has(1)}
                  onChange={() => checkedMyPartnerType.onChange({ value: 1 })}
                  activeColor={color.lab}
                  padding={0}
                />
                <CustomSpan fontSize={15} marginLeft={10}>
                  Laboratory
                </CustomSpan>
              </label>

              {/* <div className="dashboard__partners_order_btn_box">
                <button
                  className={cx('btn-reset dashboard__partners_order_btn', {
                    active: myPartnerOrder.value === 'latest',
                  })}
                  onClick={() => myPartnerOrder.setValue('latest')}
                >
                  Latest
                </button>
                <CustomSpan marginLeft={5} marginRight={5}>
                  l
                </CustomSpan>
                <button
                  className={cx('btn-reset dashboard__partners_order_btn', {
                    active: myPartnerOrder.value === 'work',
                  })}
                  onClick={() => myPartnerOrder.setValue('work')}
                >
                  Work
                </button>
              </div> */}
            </div>

            <div className="dashboard__partners_list_box">
              <ListBackgroundVeticalDivision
                borderWidth={5}
                borderStyle="solid"
                borderColor="#F4F5FA"
              />
              {!mainPartners?.length && mainPartnersPending ? (
                <div className="infinite-scroll-loading">
                  <CircularLoading />
                </div>
              ) : (
                <InfiniteScroll
                  className="dashboard__partners_scroll infinite-scroll-box"
                  dataLength={mainPartners?.length}
                  next={onFetchMainPartners}
                  hasMore={hasMoreMainPartners}
                  loader={
                    <div className="infinite-scroll-loading">
                      <CircularLoading />
                    </div>
                  }
                  scrollThreshold={0}
                  height={350}
                >
                  {!!mainPartners?.length &&
                    mainPartners.map((item, idx) => (
                      <Fragment key={idx}>
                        <ListItemWithIcon
                          title={item.name}
                          type={item.partnerType === 0 ? 'Clinic' : 'Laboratory'}
                          typeColor={item.partnerType === 0 ? color.clinic : color.lab}
                          date={
                            item.lastLogin ? moment(item.lastLogin).format('MMM. DD. HH:mm') : ''
                          }
                          iconSrc={item.profileImg || ''}
                          marginTop={30}
                          column={2}
                          itemPaddingLeft={30}
                          className="dashboard__partners_item"
                        />
                      </Fragment>
                    ))}
                </InfiniteScroll>
              )}

              {/* {Array.from({ length: 15 }).map((item, idx) => (
                <Fragment key={idx}>
                  <ListItemWithIcon
                    title={`Partner Name`}
                    type={'Laboratory'}
                    // typeColor={'#0055B5'}
                    typeColor={'#00B5B5'}
                    date={moment().format('MMM. DD. HH:mm')}
                    marginTop={30}
                    column={2}
                    itemPaddingLeft={30}
                    className="dashboard__partners_item"
                  />
                </Fragment>
              ))} */}
            </div>
          </div>
        </Grid>

        {/* 5 row */}
        <Grid item className="dashboard__lecture">
          <div className="dashboard__card_title_box">
            <h2 className="dashboard__card_title">
              <img
                src={icon_dashboard_lecture}
                alt="lectureicon_dashboard_lecture"
                className="dashboard__card_title_icon"
              />
              Lecture
            </h2>
          </div>
          {/* slider item width - 625
            <br />
            slider item margin - 30 */}
          <div className="dashboard__slider_box">
            {/* <LectureSlider data={advertisementLecture} /> */}
            <LectureSlider />
          </div>
        </Grid>
      </Grid>
    </Styled.Dashboard>
  );
}
/* width: ${window.innerWidth - 260}px; */

// const halfWidth = 'calc(50% - 20px)';
const halfWidth = '50%';
const gridItemVerticalMargin = '25px';
const gridItemHorizentalMargin = '20px';

const Styled = {
  Dashboard: styled.section`
    width: 1594px;
    padding-bottom: 140px;

    .infinite-scroll-box {
      display: flex;
      align-items: flex-start;
      flex-wrap: wrap;
      position: relative;
      padding: 5px 0 35px;
      overflow: overlay !important;
    }
    .border-radius-default {
      border-radius: 15px;
    }

    .dashboard__container {
      position: relative;
      width: ${`calc(1594px + ${gridItemHorizentalMargin} + ${gridItemHorizentalMargin})`};
      margin: -${gridItemVerticalMargin} -${gridItemHorizentalMargin};

      > .MuiGrid-item {
        position: relative;
        border-radius: 15px;
        padding: ${gridItemVerticalMargin} ${gridItemHorizentalMargin};
        margin-left: 0 !important;
        /* &.MuiGrid-item:nth-child(2) ~ .MuiGrid-item {
          margin-top: 50px;
        } */
      }

      .MuiTabs-flexContainer {
        border-bottom: 3px solid #eff1f8;
      }
      .MuiTabs-root {
        min-height: auto;
      }
      .MuiTab-root {
        text-transform: none;
      }
      .MuiTab-textColorInherit.Mui-selected {
        color: ${color.navy_blue};
      }
      .MuiTabs-indicator {
        height: 3px;
        background-color: ${color.navy_blue};
      }

      .dashboard__card_common {
        padding: 25px;
      }
      .dashboard__card_title_box {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 20px;
        width: 100%;
      }
      .dashboard__card_title {
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 23px;
        font-weight: 700;
        .dashboard__card_title_icon {
          margin-right: 15px;
        }
      }
      .dashboard__card_title_more_btn {
        margin-left: 15px;
        padding: 0px;
        background-color: ${color.blue};
        svg {
          /* margin: -5px; */
        }
      }

      // 1 row
      /* .dashboard__ad {
        width: 760px;
      } */
      .dashboard__schedule {
        width: ${halfWidth};

        .dashboard__schedule_content_box {
          display: flex;
          height: 450px;
        }
        .dashboard__calendar_box {
          z-index: 1;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          width: 505px;
          height: 100%;
          padding: 15px;
          background-color: white;
          border-radius: 15px;
          overflow: hidden;
          .dashboard__calendar {
            width: 100%;
            border: none;
          }
          .dashboard__calendar_projects {
            margin-top: 10px;
            padding: 14.5px 0;
            background-color: #f4f5fa;
            border-radius: 5px;
            font-size: 13px;
            text-align: center;
            b {
              margin-right: 15px;
            }
            span {
              margin: 0 5px;
            }
          }
        }
        .dashboard__today {
          width: 295px;
          margin-left: -15px;
          padding: 30px 25px 30px 40px;
          background-color: ${color.navy_blue};
          border-top-right-radius: 15px;
          border-bottom-right-radius: 15px;
          box-shadow: inset -3px 3px 6px rgba(0, 0, 0, 0.16);
          color: white;

          > .MuiGrid-container {
            padding: 0 15px;
            &:not(:first-child) {
              border-top: 2px solid #e6e6e6;
            }
          }
          .dashboard__today_label {
            margin: 10px 0;
            width: 65%;
          }
          .dashboard__today_number {
            margin: 10px 0;
            width: 35%;
            text-align: right;
            &.new {
              margin-top: 25px;
            }
          }
          .dashboard__today_title {
            padding-bottom: 10px;
          }
          .dashboard__today_total {
            padding-top: 8px;
            padding-bottom: 8px;
          }
          .dashboard__today_content {
            padding-top: 20px;
            font-size: 15px;
            .dashboard__today_label {
              font-weight: 300;
            }
          }
        }
      }

      .dashboard__notifications {
        width: ${halfWidth};
        margin-left: 40px;

        .dashboard__notifications_content_box {
        }
        .dashboard__notifications_list_box {
          position: relative;
          height: 450px;
          overflow-y: overlay;
        }
        /* .dashboard__notifications_item {
          width: 50%;
          padding-left: 30px;
        } */
      }

      // 2 row
      .dashboard__project_status_container {
      }
      .dashboard__project_status {
        z-index: 1;
        width: 405px;
        height: 455px;
        padding: 30px;
        background-color: ${color.navy_blue};
        box-shadow: inset 3px 3px 3px 3px rgba(0, 0, 0, 0.16);
        h2 {
          font-size: 26px;
          font-weight: 700;
          color: white;
        }
        .dashboard__project_status_order_btn_box {
          position: relative;
          height: 36px;
          background-color: ${color.navy_blue_deep};
          border-radius: 18px;
          .dashboard__project_status_order_btn {
            width: 50%;
            height: 100%;
            border-radius: 18px;
            color: white;
            font-weight: 500;
            &.active {
              background-color: white;
              color: ${color.black_font};
            }
          }
        }
        [class*='dashboard__project_status_option'] {
          margin-top: 15px;

          .asyncFetchSelect,
          .muiWrapper {
            margin-top: 9px;
          }
          .MuiInputBase-root {
            background-color: transparent;
            color: white;
          }
          .MuiOutlinedInput-notchedOutline {
            border-color: white;
          }
          .MuiSelect-icon {
            color: white;
          }
        }
        .dashboard__project_status_filter_process {
          margin-top: 25px;
          h3 {
            display: flex;
            align-items: center;
            font-size: 13px;
            color: white;
            svg {
              margin-right: 10px;
            }
          }
          .dashboard__project_status_filter_box {
            .dashboard__project_status_filter_list {
              display: flex;
              flex-wrap: wrap;
              .dashboard__project_status_filter_item {
                display: flex;
                align-items: center;
                margin-top: 10px;
                width: calc(50% - 5px);
                height: 35px;
                padding: 0 5px;
                background-color: ${color.navy_blue_deep};
                border-radius: 5px;
                font-size: 13px;
                color: white;
                cursor: pointer;
                &:nth-child(2n) {
                  margin-left: 10px;
                }
                .dashboard__project_status_filter_check {
                  display: inline-flex;
                  align-items: center;
                  justify-content: center;
                  margin-right: 10px;
                  width: 20px;
                  height: 20px;
                  border-radius: 4px;
                  background-color: transparent;
                  border: 1px solid white;
                }
                &.active {
                  background-color: white;
                  color: ${color.black_font};
                  .dashboard__project_status_filter_check {
                    border: 1px solid transparent;
                  }
                }
              }
            }
          }
        }
      }
      .dashboard__project_chart {
        margin-left: -40px;
        width: 1225px;
        height: 455px;
        padding-left: 40px;
        box-shadow: -3px 0px 10px rgba(0, 0, 0, 0.16);
        .dashboard__project_chart_item {
          margin: 0 auto;
          /* margin-bottom: -50px; */
          /* width: 1110px; */
          /* height: 280px; */
          /* border: 1px solid #ddd; */
        }
        .dashboard__project_chart_regends {
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          margin: 20px auto 15px;
          width: 1110px;
          .dashboard__project_chart_duration_box {
            line-height: 0;
          }
          .dashboard__project_chart_regends_period {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 285px;
            height: 100%;
            font-size: 13px;
            background-color: #b5b7c1;
            border-radius: 5px;
            color: white;
            span {
              margin: 0 5px;
            }
          }
          .dashboard__project_chart_regends_category_list {
            display: flex;
            align-items: center;
            font-size: 12px;
            .dashboard__project_chart_regends_category_item {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              &:not(:first-child) {
                margin-left: 30px;
              }
              .dashboard__project_chart_regends_category_symbol {
                display: inline-block;
                margin-right: 10px;
                width: 12px;
                height: 12px;
                border-radius: 2px;
              }
            }
          }
        }
      }

      // 3 row
      .dashboard__sales {
        /* display: flex;
        flex-direction: column;
        justify-content: space-between;
        width: 1030px;
        height: 550px; */
        .dashboard__sales_total {
          display: flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          top: ${gridItemVerticalMargin};
          right: ${gridItemHorizentalMargin};
          margin-bottom: -15px;
          width: 400px;
          height: 90px;
          padding-bottom: 15px;
          background-color: ${color.blue};
          box-shadow: inset 0px 3px 6px rgba(0, 0, 0, 0.16);
          border-top-left-radius: 15px;
          border-top-right-radius: 15px;
          font-size: 21px;
          color: white;
          text-align: center;
        }
        .dashboard__sales_chart_container {
          display: flex;
          justify-content: space-between;
          position: relative;
          height: 450px;
          background-color: white;
          border-radius: 15px;
          .dashboard__sales_option_box {
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            width: 290px;
            padding: 30px;
            border-right: 5px solid #f4f5fa;
            .dashboard__sales_option_list {
              > * + * {
                margin-top: 25px;
              }
              .muiWrapper,
              .button {
                margin-top: 8px;
              }
            }
            .dashboard__sales_option_material {
              position: relative;
            }
            // materialConfigModal
            .dashboard__sales_material_config_modal {
              z-index: 1;
              position: absolute;
              top: 53px;
              left: 0px;
              width: 1065px;
              background-color: white;
              border-radius: 15px;
              box-shadow: 0 0 15px rgba(0, 0, 0, 0.16);
              .materialConfigModal__header {
                display: flex;
                align-items: center;
                justify-content: space-between;
                position: relative;
                padding: 9px 20px;
                background-color: ${color.navy_blue};
                border-top-left-radius: 10px;
                border-top-right-radius: 10px;
                font-size: 15px;
                font-weight: 500;
                color: white;

                .materialConfigModal__close_btn {
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  width: 30px;
                  height: 30px;
                  border: 1px solid white;
                  border-radius: 50%;
                  font-size: 22px;
                }
              }
              .materialConfigModal__body {
                padding: 30px;
                padding-top: 0;
                border-bottom-left-radius: 10px;
                border-bottom-right-radius: 10px;

                .materialConfigModal__selected_list {
                  margin-top: 25px;
                  padding: 0 12px;
                  background-color: #fafafd;
                  border-radius: 15px;
                  .materialConfigModal__selected_item {
                    display: flex;
                    align-items: center;
                    padding: 10px 0;
                    &:not(:first-child) {
                      border-top: 1px solid #d6dce0;
                    }
                    .materialConfigModal__selected_item_label {
                      width: 220px;
                      padding-left: 10px;
                      font-size: 13px;
                      font-weight: 500;
                    }
                    .materialConfigModal__selected_item_meterial_list {
                      width: calc(100% - 220px);
                      padding-left: 5px;
                      .materialConfigModal__selected_item_meterial_item {
                        display: inline-flex;
                        align-items: center;
                        justify-content: space-between;
                        margin: 0 5px;
                        width: 110px;
                        padding: 5px 10px;
                        padding-right: 5px;
                        border-radius: 15px;
                        font-size: 10px;
                        color: white;
                        &:nth-child(6) ~ * {
                          margin-top: 5px;
                        }
                        > p {
                          width: 95px;
                          white-space: nowrap;
                          text-overflow: ellipsis;
                          overflow: hidden;
                        }
                        .materialConfigModal__selected_item_meterial_item_delete_btn {
                          font-size: 12px;
                        }
                      }
                    }
                  }
                }
                .materialConfigModal__select_list {
                  display: flex;
                  flex-wrap: wrap;
                  .materialConfigModal__select_item {
                    width: 240px;
                    margin-top: 30px;
                    &:not(:nth-child(4n + 1)) {
                      margin-left: 15px;
                    }
                    .muiWrapper {
                      margin-top: 10px;
                      // TODO: change active color
                      /* &.anatomic .MuiOutlinedInput-notchedOutline {
                        border-color: ${color.blue};
                      } */
                    }
                  }
                }
              }
            }
            .dashboard__sales_option_info {
              margin-top: 120px;
              padding: 0 20px;
              .dashboard__sales_option_info_item {
                margin-bottom: 15px;
              }
            }
          }
          .dashboard__sales_chart_box {
            display: flex;
            align-items: flex-end;
            width: 740px;
            padding: 30px 20px;
            .dashboard__sales_chart {
              /* width: 600px; */
            }
          }
        }
      }
      .dashboard__store {
        margin-left: 40px;
        width: 560px;

        .dashboard__store_content_box {
          height: 450px;
          padding: 30px;
          .dashboard__store_tabs {
            .dashboard__store_tab {
              min-width: 33.33%;
              min-height: auto;
              padding: 5px 0;
            }
          }
          .dashboard__store_tabpanel {
            height: calc(450px - 60px - 37px);

            .dashboard__store_tabpanel_data_content_box {
              display: flex;
              flex-direction: column;
              justify-content: space-between;
              height: 100%;
            }

            .dashboard__store_tabpanel_content {
              margin-top: 20px;
              max-height: 330px;
              &:not(.data) {
                overflow-y: overlay;
              }
              &.data {
                display: flex;
                align-items: center;
                justify-content: center;
                margin-top: 50px;
              }
            }
            .dashboard__store_tabpanel_no_data {
              display: flex;
              align-items: center;
              justify-content: center;
              text-align: center;
              height: 350px;
              font-size: 16px;
              line-height: 1.3;
              color: #7c7c7c;
            }
            .dashboard__store_tabpanel_chart {
              position: relative;
              .dashboard__store_tabpanel_product_box {
                display: flex;
                align-items: center;
                justify-content: center;
                position: absolute;
                top: 50%;
                left: 50%;
                transform: translate(-50%, -50%);
                margin-top: -5px;
                width: 100%;
                height: 100%;
                /* border-radius: 50%; */
                /* background-color: rgba(51, 181, 288, 0.12); */
                .dashboard__store_tabpanel_product {
                  text-align: center;
                }
              }
            }
            .dashboard__store_tabpanel_chart_info_box {
              margin-left: 50px;
              .dashboard__store_tabpanel_chart_info {
                &:not(:first-child) {
                  margin-top: 25px;
                }
                .dashboard__store_tabpanel_chart_info_label {
                  display: flex;
                  align-items: center;
                  font-size: 18px;
                }
                .dashboard__store_tabpanel_chart_info_circle {
                  display: inline-block;
                  margin-right: 10px;
                  width: 12px;
                  height: 12px;
                  border-radius: 50%;
                  background-color: ${color.blue};
                  &.available {
                    background-color: #ddd;
                  }
                }
                .dashboard__store_tabpanel_chart_info_title {
                  font-size: 16px;
                  color: ${color.black_font};
                  display: inline-block;
                  margin-left: 10px;
                }
                .dashboard__store_tabpanel_chart_info_data {
                  margin-top: 10px;
                  font-size: 16px;
                  color: ${color.black_font};
                  text-indent: 23px;
                }
              }
            }
          }

          .dashboard__store_lack_box {
            display: flex;
            align-items: center;
            justify-content: space-between;
            padding: 20px;
            background-color: #eff1f8;
            border-radius: 33px;
          }
        }
      }

      // image bar
      .dashboard__banner {
        width: 100%;
        img {
          width: 100%;
        }
      }

      // 4 row
      .dashboard__new_projects {
        width: ${halfWidth};

        .dashboard__new_projects_content_box {
          position: relative;
        }
        .dashboard__new_projects_list_box {
          display: flex;
          flex-wrap: wrap;
          position: relative;
          height: 450px;
          overflow-y: overlay;
          .dashboard__new_projects_item {
            /* width: 50%;
            padding-left: 30px; */
          }
        }
      }
      .dashboard__partners {
        width: ${halfWidth};
        margin-left: 40px;

        .dashboard__partners_title_icon {
          /* display: inline-block;
          margin-top: -5.5px;
          margin-bottom: -5.5px;
          margin-right: 10px; */
        }
        .dashboard__partners_order_btn_box {
          margin-left: 180px;
          font-size: 14px;
          color: #767676;
          .dashboard__partners_order_btn {
            &.active {
              /* border-bottom: 1px solid #767676; */
              color: ${color.blue};
              font-weight: 500;
            }
          }
        }
        .dashboard__partners_content_box {
          position: relative;
          height: 450px;
        }
        .dashboard__partners_list_filter_box {
          padding: 30px;
          padding-bottom: 0;

          > * {
            display: inline-flex;
            align-items: center;
            vertical-align: middle;
          }
          > label {
            margin-right: 15px;
          }
        }
        .dashboard__partners_list_box {
          position: relative;
          margin-top: 30px;
          height: 350px;
          overflow-y: overlay;
        }
        .dashboard__partners_list {
          /* display: flex;
          flex-wrap: wrap; */
          position: relative;
          .dashboard__partners_item {
            /* width: 50%;
            padding-left: 30px;
            &:nth-child(2) {
              margin-top: 0px;
            } */
          }
        }
      }

      // 5 row
      .dashboard__lecture {
        width: 100%;
        .dashboard__slider_box {
          height: 280px;
        }
      }
    }

    .dashboard__slider_box {
      width: 100%;
    }

    .dashboard__division {
      margin: 50px 0;
      width: 100%;
      height: 3px;
      background-color: #e6e6e6;
      border: none;
    }
  `,
};

export default React.memo(Dashboard);

/* 210 */
/* 50 */
/* 1660 - 50 */

// 1560

/* 760 */
/* 800 */
/* 495 305 */

// 405
// 1225

// 495
// 625
// 430
