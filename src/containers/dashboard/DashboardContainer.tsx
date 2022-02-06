import React, { useEffect, useMemo, useState } from 'react';
import useInput from 'lib/hooks/useInput';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';
import Dashboard from 'components/dashboard/Dashboard';
import { useDidUpdateEffect } from 'lib/utils';
import moment from 'moment';
import {
  DashboardActions,
  NotificationActions,
  PartnerActions,
  UtilActions,
} from 'store/actionCreators';
import { useShallowAppSelector } from 'store/hooks';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import { color } from 'styles/utils';
import { projectChartItemConverter } from 'lib/library';
import _, { debounce } from 'lodash';

export default function DashboardContainer() {
  const {
    scheduleData: { duedateCount: scheduleDuedateCount, stageCount: scheduleStageCount },
    fetchScheduleSuccess,
    mainNotificationsData,
    mainNotificationsSuccess,
    syncPartnersData,
    syncPartnersSuccess,
    projectGraphData,
    projectGraphSuccess,
    mainPartnersData,
    mainPartnersSuccess,
    advertisementData: { ad1: advertisementArea1, lecture: advertisementLecture },
    fetchAdvertisementSuccess,
  } = useShallowAppSelector(state => ({
    scheduleData: state.dashboard.schedule.data || {},
    fetchScheduleSuccess: state.dashboard.schedule.success,
    mainNotificationsData: state.notification.mainNotifications.data,
    mainNotificationsSuccess: state.notification.mainNotifications.success,
    syncPartnersData: state.partner.syncPartners.data,
    syncPartnersSuccess: state.partner.syncPartners.success,
    projectGraphData: state.dashboard.projectGraph.data,
    projectGraphSuccess: state.dashboard.projectGraph.success,
    mainPartnersData: state.partner.mainPartners.data,
    mainPartnersSuccess: state.partner.mainPartners.success,
    advertisementData: state.util.advertisement.data || {},
    fetchAdvertisementSuccess: state.util.advertisement.success,
  }));
  // const scheduleDuedateCount = scheduleData?.duedateCount;
  // const scheduleStageCount = scheduleData?.stageCount;
  const [mainNotifications, setMainNotifications] = useState([]);
  const mainNotificationsPagingData = mainNotificationsData?.pagingData;
  const hasMoreMainNotifications =
    mainNotificationsPagingData?.page < mainNotificationsPagingData?.totalPage;
  const [syncPartners, setSyncPartners] = useState([]);
  const syncPartnersPagingData = syncPartnersData?.pagingData;
  const hasMoreSyncPartners = syncPartnersPagingData?.page < syncPartnersPagingData?.totalPage;
  const projectGraph = projectGraphData?.list;
  const projectGraphPagingData = projectGraphData?.pagingData;
  const [mainPartners, setMainPartners] = useState([]);
  const mainPartnersPagingData = mainPartnersData?.pagingData;
  const hasMoreMainPartners = mainPartnersPagingData?.page < mainPartnersPagingData?.totalPage;
  // calendar
  // const date = useInput(new Date(2021, 6, 29));
  const date = useInput(new Date());
  // project chart
  const orderType = useInput('0');
  const syncPartnerKeyword = useInput('');
  const selectedSyncPartner = useInput('');
  const checkedProjectProcess = useCheckSetInput(new Set([0]));
  // 1Y, 1M, 1W
  const projectDurationType = useInput('1W');
  // const [currentProjectDuration, setCurrentProjectDuration] = useState(new Date());
  const [currentProjectDuration, setCurrentProjectDuration] = useState<moment.Moment | number>(
    moment().valueOf(),
  );
  // sales chart
  // 1Y, 1M, 1W
  const salesDuration = useInput('1W');
  const salesPartner = useInput('');
  const material = useInput('Anatomic');
  const checkedMyPartnerType = useCheckSetInput(new Set([]));
  const myPartnerOrder = useInput('latest');

  const projectStatusParams = useMemo(
    () => ({
      searchDate: moment(currentProjectDuration).format('YYYY-MM-DD'),
      isRequest: orderType.value,
      projectDuration: projectDurationType.value,
      stage: checkedProjectProcess.value.size ? [...checkedProjectProcess.value].join('%') : '',
      partnerGroupIdx: selectedSyncPartner.value || '',
    }),
    [
      currentProjectDuration,
      orderType.value,
      projectDurationType.value,
      checkedProjectProcess.value,
      selectedSyncPartner.value,
    ],
  );

  // projectChartItems state
  const newChartItems = useInput([]);
  const preparationChartItems = useInput([]);
  const scanChartItems = useInput([]);
  const cadChartItems = useInput([]);
  const camChartItems = useInput([]);
  const millingChartItems = useInput([]);
  const postChartItems = useInput([]);
  const completeChartItems = useInput([]);

  const projectChartConfig: any = useMemo(
    () => ({
      new: {
        index: 0,
        color: color.stage_new,
        state: newChartItems,
        data: newChartItems.value,
      },
      preparation: {
        index: 1,
        color: color.stage_preparation,
        state: preparationChartItems,
        data: preparationChartItems.value,
      },
      scan: {
        index: 2,
        color: color.stage_scan,
        state: scanChartItems,
        data: scanChartItems.value,
      },
      cad: {
        index: 3,
        color: color.stage_cad,
        state: cadChartItems,
        data: cadChartItems.value,
      },
      cam: {
        index: 4,
        color: color.stage_cam,
        state: camChartItems,
        data: camChartItems.value,
      },
      milling: {
        index: 5,
        color: color.stage_milling,
        state: millingChartItems,
        data: millingChartItems.value,
      },
      post: {
        index: 6,
        color: color.stage_post,
        state: postChartItems,
        data: postChartItems.value,
      },
      complete: {
        index: 7,
        color: color.stage_completed,
        state: completeChartItems,
        data: completeChartItems.value,
      },
    }),
    [
      newChartItems.value,
      preparationChartItems.value,
      scanChartItems.value,
      cadChartItems.value,
      camChartItems.value,
      millingChartItems.value,
      postChartItems.value,
      completeChartItems.value,
    ],
  );

  const projectChartItems = useMemo(
    () =>
      [...checkedProjectProcess.value].reduce((acc, curr) => {
        const currentChartStage =
          Object.keys(projectChartConfig).find(key => {
            return projectChartConfig[key].index === curr;
          }) || 'new';

        const obj = {
          index: projectChartConfig[currentChartStage].index,
          id: currentChartStage,
          color: projectChartConfig[currentChartStage].color,
          data: projectChartConfig[currentChartStage].data,
        };
        return _.orderBy(acc.concat(obj), 'index', 'desc');
      }, []),
    [checkedProjectProcess.value, projectChartConfig],
  );

  const mainPartnersParams = useMemo(
    () => ({
      partnerType: checkedMyPartnerType.value.size ? [...checkedMyPartnerType.value].join('%') : '',
    }),
    [checkedMyPartnerType.value],
  );

  // SECTION: function

  // TEST:
  // useEffect(() => {
  //   console.log('projectChartItems', projectChartItems);
  // }, [projectChartItems]);
  useEffect(() => {
    console.log('currentProjectDuration', moment(currentProjectDuration).format('YYYY-MM-DD'));
  }, [currentProjectDuration]);

  const handleChangeProjectDuration = (value: string) => {
    const currentType = projectDurationType.value;
    let duration = 1;
    let durationType: any = '';
    if (currentType === '1W') {
      duration = 7;
      durationType = 'd';
    }
    if (currentType === '1M') durationType = 'M';
    if (currentType === '1Y') durationType = 'y';

    // TODO: value, projectDurationType.value을 전달해 api에 요청할 값을 구함
    if (value === 'prev') {
      setCurrentProjectDuration(draft => moment(draft).subtract(duration, durationType));
    }
    if (value === 'next') {
      setCurrentProjectDuration(draft => moment(draft).add(duration, durationType));
    }

    // if (currentType === '1W') [currentProjectDuration.subtract(7, 'd'), currentProjectDuration];
    // currentProjectDuration
  };

  const handleFetchMainNotifications = () => {
    const { page, totalPage } = mainNotificationsPagingData;
    if (page >= totalPage) return;
    NotificationActions.fetch_main_notifications_request({ page: page + 1 });
  };

  const handleFetchSyncPartners = debounce((first?: boolean) => {
    if (first) return PartnerActions.fetch_sync_partners_request({ keyword: '', page: 1 });

    const { page, totalPage } = syncPartnersPagingData;
    if (page >= totalPage) return;
    PartnerActions.fetch_sync_partners_request({
      keyword: syncPartnerKeyword.value || '',
      page: page + 1,
    });
  }, 500);

  const handleSearchSyncPartners = debounce((value: string) => {
    // console.log('syncPartnerKeyword.value', syncPartnerKeyword.value);
    syncPartnerKeyword.setValue(value);
    setSyncPartners([]);
    PartnerActions.fetch_sync_partners_request({ keyword: value || '', page: 1 });
  }, 500);

  const handleFetchMainPartners = () => {
    const { page, totalPage } = mainPartnersPagingData;
    if (page >= totalPage) return;
    PartnerActions.fetch_main_partners_request({ ...mainPartnersParams, page: page + 1 });
  };

  // SECTION: DidMount

  // init api 요청
  useEffect(() => {
    DashboardActions.fetch_schedule_request({
      searchDate: moment(date.value).format('YYYY-MM-DD'),
    });
    NotificationActions.fetch_main_notifications_request({ page: 1 });
    // DEBUG: 실제 프로젝트 만든 후 확인 필요
    DashboardActions.fetch_project_graph_request(projectStatusParams);
    PartnerActions.fetch_sync_partners_request({ keyword: '', page: 1 });
    PartnerActions.fetch_main_partners_request({ ...mainPartnersParams, page: 1 });
    UtilActions.fetch_advertisement_request();
  }, []);

  // SECTION: DidUpdate

  // TODO:  date.value 변경시 api요청 - due-date 데이터 연동0
  useDidUpdateEffect(() => {
    DashboardActions.fetch_schedule_request({
      searchDate: moment(date.value).format('YYYY-MM-DD'),
    });
  }, [date.value]);

  // notifications
  useDidUpdateEffect(() => {
    if (mainNotificationsSuccess)
      setMainNotifications(draft => draft.concat(mainNotificationsData?.list));
  }, [!!mainNotificationsSuccess]);

  // syncPartners
  useDidUpdateEffect(() => {
    if (syncPartnersSuccess) setSyncPartners(draft => draft.concat(syncPartnersData?.list));
  }, [!!syncPartnersSuccess]);

  // chart data mapping
  useEffect(() => {
    Object.keys(projectChartConfig).forEach((key, idx) => {
      if (idx === projectChartConfig[key].index) {
        projectChartConfig[key].state.setValue(
          projectChartItemConverter({
            items: projectGraph?.filter((o: any) => o.stage === idx),
            duration: projectDurationType.value,
          }),
        );
      }
    });
  }, [projectGraph]);
  // TEST:
  // useEffect(() => {
  //   console.log('projectChartConfig', projectChartConfig);
  // }, [projectChartConfig]);

  // TODO:  total project status chart api요청
  useDidUpdateEffect(() => {
    DashboardActions.fetch_project_graph_request(projectStatusParams);
  }, [
    orderType.value,
    projectDurationType.value,
    checkedProjectProcess.value,
    selectedSyncPartner.value,
  ]);

  // TODO:  sales chart api요청
  useDidUpdateEffect(() => {}, [salesDuration.value, salesPartner.value, material.value]);

  // main partners
  useDidUpdateEffect(() => {
    if (mainPartnersSuccess) setMainPartners(draft => draft.concat(mainPartnersData?.list));
  }, [!!mainPartnersSuccess]);

  // main artners api요청
  useDidUpdateEffect(() => {
    PartnerActions.fetch_main_partners_request({ ...mainPartnersParams, page: 1 });
    setMainPartners([]);
  }, [checkedMyPartnerType.value]);

  const fetchList = {
    fetchScheduleSuccess,
    projectGraphSuccess,
  };
  const { isFetchSuccess } = useFetchLoading(fetchList);
  if (!isFetchSuccess) return null;

  return (
    <Dashboard
      scheduleDuedateCount={scheduleDuedateCount}
      scheduleStageCount={scheduleStageCount}
      mainNotifications={mainNotifications}
      hasMoreMainNotifications={hasMoreMainNotifications}
      // mainNotificationsPagingData={mainNotificationsPagingData}
      syncPartners={syncPartners}
      hasMoreSyncPartners={hasMoreSyncPartners}
      // syncPartnersPagingData={syncPartnersPagingData}
      projectChartItems={projectChartItems}
      projectGraphPagingData={projectGraphPagingData}
      mainPartners={mainPartners}
      hasMoreMainPartners={hasMoreMainPartners}
      // mainPartnersPagingData={mainPartnersPagingData}
      advertisementArea1={advertisementArea1}
      advertisementLecture={advertisementLecture}
      //
      date={date}
      orderType={orderType}
      selectedSyncPartner={selectedSyncPartner}
      checkedProjectProcess={checkedProjectProcess}
      projectDurationType={projectDurationType}
      currentProjectDuration={currentProjectDuration}
      onChangeProjectDuration={handleChangeProjectDuration}
      salesDuration={salesDuration}
      salesPartner={salesPartner}
      material={material}
      checkedMyPartnerType={checkedMyPartnerType}
      myPartnerOrder={myPartnerOrder}
      //
      onFetchMainNotifications={handleFetchMainNotifications}
      onFetchSyncPartners={handleFetchSyncPartners}
      onSearchSyncPartners={handleSearchSyncPartners}
      onFetchMainPartners={handleFetchMainPartners}
    />
  );
}
