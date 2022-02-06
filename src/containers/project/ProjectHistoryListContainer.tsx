import DateConverter from 'components/common/convert/DateConverter';
import MuiPagination from 'components/common/pagination/MuiPagination';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import React, { useContext, useEffect } from 'react';
import { ProjectActions } from 'store/actionCreators';
import styled from 'styled-components';
import { color } from 'styles/utils';
import queryString from 'query-string';
import { useLocation, useParams } from 'react-router';
import useInput from 'lib/hooks/useInput';
import { useShallowSelector } from 'lib/utils';
import { AppContext } from 'contexts/AppContext';
import T from 'components/common/text/T';
import moment from 'moment';
import { useTranslation } from 'react-i18next';
import { useShallowAppSelector } from 'store/hooks';
import { OffsetPagingData } from 'lib/sharedTypes';

export default function ProjectHistoryListContainer({}) {
  const { projectHistoriesData, fetchProjectHistoriesSuccess } = useShallowAppSelector(state => ({
    projectHistoriesData: state.project.projectHistories.data,
    fetchProjectHistoriesSuccess: state.project.projectHistories.success,
  }));
  const { pcode } = useParams() as { pcode: string };
  const location = useLocation();
  // const queryParse = queryString.parse(location.search);
  // const queryProjectCode = queryParse?.projectCode;
  const projectCode = pcode;
  //
  const projectHistoryList = projectHistoriesData?.list;
  const projectHistoryPagingData = projectHistoriesData?.pagingData;
  const page = useInput(1);

  // SECTION: init
  useEffect(() => {
    console.log('page.value', page.value);
    ProjectActions.fetch_project_histories_request({
      id: projectCode,
      data: { page: page.value },
    });
  }, [page.value]);

  const { isFetchSuccess } = useFetchLoading({ fetchProjectHistoriesSuccess });
  if (!isFetchSuccess) return null;

  return (
    <ProjectHistoryList
      projectHistoryList={projectHistoryList}
      projectHistoryPagingData={projectHistoryPagingData}
      page={page}
    />
  );
}

interface ProjectHistoryListProps {
  projectHistoryList: object | any;
  projectHistoryPagingData: OffsetPagingData;
  page: {
    value: number;
    onChange: (e: any) => void;
    setValue: React.Dispatch<any>;
  };
}

function ProjectHistoryList({
  projectHistoryList,
  projectHistoryPagingData,
  page,
}: ProjectHistoryListProps) {
  const { t } = useTranslation();
  const { isProjectClient } = useContext(AppContext);

  // enrollDate: 1616398326
  // eventTitle: "프로젝트 지원 취소"
  // fromCompany: "sender"
  // fromUserCode: "E220AUG-0000"
  // projectCode:
  // useEffect(() => {
  //   console.log('isProjectClient', isProjectClient);
  // }, [isProjectClient]);

  return (
    <Styled.ProjectHistoryList data-component-name="ProjectHistoryList">
      <div className="projectHistoryList__container">
        <h1 className="projectHistoryList__title">
          <T>PROJECT_HISTORY</T>
        </h1>
        <ul className="projectHistoryList__list">
          {!!projectHistoryList?.length &&
            projectHistoryList.map((item: any, index: number) => (
              <li className="projectHistoryList__item" key={index}>
                {/* <div className="projectHistoryList__item_name">{item.fromCompany}</div> */}
                <div className="projectHistoryList__item_time">
                  {moment(item.enrollDate).format('MMM. DD. YYYY HH:mm')}
                </div>
                <div className="projectHistoryList__item_content">
                  {t(`NOTIFICATION_EVENT_TYPE_${item?.type}`)}
                  {item?.type === 'CLIENT_REMAKE_REQ' && (
                    <>
                      {` l `}
                      Gap width of cement : {item?.params?.param1}, Minimal thickness :{' '}
                      {item?.params?.param2}, Adjust contact : {item?.params?.param3}, Adjust bite :{' '}
                      {item?.params?.param4}, Milling tool diameter : {item?.params?.param5}
                      {item?.params?.param6 && `, Memo : ${item?.params?.param6}`}
                    </>
                  )}
                  {item?.type?.includes('FILE_') && ` l ${item?.params?.content}`}
                </div>
              </li>
            ))}
        </ul>
        <div className="pagination__container">
          <MuiPagination
            config={{
              justifyContent: 'center',
            }}
            count={projectHistoryPagingData?.totalPage}
            page={page.value}
            onChange={(e: any, value: number) => page.setValue(value)}
          />
        </div>
      </div>
    </Styled.ProjectHistoryList>
  );
}

const Styled = {
  ProjectHistoryList: styled.section`
    width: 100%;
    height: 680px;
    margin-top: 20px;
    padding: 20px;
    border: 1px solid #fff;
    border-color: transparent;
    border-radius: 10px;
    /* color: inherit; */
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
    font-size: 12px;
    letter-spacing: -0.3px;
    line-height: 1.3;
    .projectHistoryList__title {
      padding-bottom: 15px;
      font-size: 16px;
      font-weight: 700;
      border-bottom: 1px solid #e2e7ea;
    }
    .projectHistoryList__list {
      height: 565px;
      padding: 9px 0;
      overflow-y: auto;
    }
    .projectHistoryList__item {
      /* display: flex;
      align-items: flex-end;
      flex-wrap: wrap; */
      padding: 10px 0;
      .projectHistoryList__item_name {
      }
      .projectHistoryList__item_time {
        margin-left: 5px;
        font-size: 11px;
      }
      .projectHistoryList__item_content {
        margin-left: 5px;
      }
    }
    .pagination__container {
      margin-top: 15px;
      button {
        /* color: inherit; */
      }
    }
  `,
};
