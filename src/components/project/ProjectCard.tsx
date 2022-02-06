import React, { useContext, useState } from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import MuiButton from 'components/common/button/MuiButton';
import { pageUrl, projectProcessFlagList } from 'lib/mapper';
import {
  icon_calendar,
  icon_cloud_upload,
  icon_paper_plane,
  icon_pencil_square,
  icon_user,
} from 'components/base/images';
import moment from 'moment';
import { useShallowAppSelector } from 'store/hooks';
import TeethSvgV2 from 'components/common/teeth/TeethSvgV2';
import { useHistory } from 'react-router';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import ArrowDropUpIcon from '@material-ui/icons/ArrowDropUp';
import IconButton from '@material-ui/core/IconButton';
import { capitalize } from 'lib/library';
import { ProjectActions } from 'store/actionCreators';
import { useDidUpdateEffect } from 'lib/utils';
import { ProjectContext } from 'contexts/project/ProjectContext';

interface Tooth {
  number: string;
  indicationIdx: string;
}

interface ProjectCardProps {
  isRework?: boolean;
  data: {
    clientName: string;
    dueDate: number;
    projectCode: string;
    projectId: string;
    // projectIdx: number;
    projectName: string;
    projectStatus: number;
    reworkOrder: number;
    stage: number;
    info: string;
    teeth: Tooth[];
    bridgeList: string[];
    syncStatus: number;
  };
  onCloseProjectListModal?: () => void;
}

const ProjectCard = ({ isRework = false, data, onCloseProjectListModal }: ProjectCardProps) => {
  const { teethData, reworkProjectSuccess } = useShallowAppSelector(state => ({
    teethData: state.util.teeth,
    reworkProjectSuccess: state.project.reworkProject.success,
  }));
  const history = useHistory();
  const [isUnfoldCard, setIsUnfoldCard] = useState(false);
  const { reworkProjectCode } = useContext(ProjectContext);

  const projectStatusList = [
    { id: 0, name: 'create', icon: icon_pencil_square },
    { id: 1, name: 'invited', icon: icon_paper_plane },
    // { id: 2, name: 'sync', icon: icon_cloud_upload },
  ];

  const handleSelectReworkProject = (id: string) => {
    ProjectActions.fetch_rework_project_request(id);
    reworkProjectCode.setValue(id);
    // history.push(`${pageUrl.project.create}?reworkProjectCode=${id}`);
    if (onCloseProjectListModal) onCloseProjectListModal();
  };

  if (!data) return null;
  return (
    <StyledProjectCard
      data-component-name="ProjectCard"
      className="projectCard__container"
      isRework={isRework}
      isUnfoldCard={isUnfoldCard}
    >
      <div className="projectCard__top_container">
        <div className="projectCard__top_box">
          <div className="projectCard__top">
            <span
              className="projectCard__symbol"
              style={{
                backgroundColor: projectProcessFlagList[data?.stage || 0].color,
              }}
            />
            {projectProcessFlagList[data?.stage || 0].name}
          </div>
          {isRework ? (
            <IconButton
              className="projectCard__fold_btn"
              onClick={() => setIsUnfoldCard(!isUnfoldCard)}
            >
              {!isUnfoldCard ? (
                <ArrowDropDownIcon htmlColor="white" fontSize="large" />
              ) : (
                <ArrowDropUpIcon htmlColor="white" fontSize="large" />
              )}
            </IconButton>
          ) : (
            <span className="projectCard__enroll_date">{moment().format('MMM.DD.YYYY HH:mm')}</span>
          )}
        </div>
        {isUnfoldCard && (
          <article className="projectCard__rework_box">
            <h1 className="projectCard__rework_title">{data.projectId}</h1>
            <div className="projectCard__rework_content">
              <div className="projectCard__rework_content_item ">
                <span className="dot"></span>
                <p>Rework : {data.reworkOrder}</p>
              </div>
              {/* TODO: 내용 확인 필요 */}
              <div className="projectCard__rework_content_item ">
                <span className="dot"></span>
                <p className="projectCard__rework_content_description">
                  Info: {data?.info}
                  {/* {!!data?.teeth?.length && (
                    <>
                      Teeth -{' '}
                      {data.teeth.map((item, idx) => {
                        let number = `, ${item.number}`;
                        if (idx === 0) number = `${item.number}`;
                        return number;
                      })}{' '}
                    </>
                  )}
                  {!!data?.bridgeList?.length && (
                    <>
                      / Bridge -{' '}
                      {data.bridgeList.map((item, idx) => {
                        let number = `, ${item}`;
                        if (idx === 0) number = `${item}`;
                        return number;
                      })}
                    </>
                  )} */}
                </p>
              </div>
              <div className="projectCard__rework_content_select_btn_box">
                <MuiButton
                  config={{
                    color: '#fff',
                  }}
                  variant="outlined"
                  className="sm border-radius-round"
                  onClick={() => handleSelectReworkProject(data.projectCode)}
                >
                  Select
                </MuiButton>
              </div>
            </div>
          </article>
        )}
      </div>

      <div className="projectCard__content">
        <div className="projectCard__info">
          <div className="projectCard__info_item">
            <div className="projectCard__by">
              <img src={projectStatusList[data?.projectStatus || 0].icon} alt="upload icon" />
              {capitalize(projectStatusList[data?.projectStatus || 0].name)}
              {data?.syncStatus === 1 && ' (Sync)'}
            </div>
            <div className="projectCard__title" title={'Project Name'}>
              {data.projectName}
            </div>
            <div className="projectCard__deadline">
              <img src={icon_calendar} alt="calendar icon" />
              {moment.unix(data.dueDate).format('YYYY-MM-DD')}
            </div>
            <div className="projectCard__client_name">
              <img src={icon_user} alt="user icon" />
              {data.clientName}
            </div>
          </div>

          <div className="projectCard__info_item btn_box">
            {isRework ? (
              <MuiButton
                fullWidth
                variant="outlined"
                color="secondary"
                className="sm border-radius-round"
                onClick={() => handleSelectReworkProject(data.projectCode)}
              >
                Select
              </MuiButton>
            ) : (
              <MuiButton
                fullWidth
                variant="outlined"
                color="secondary"
                className="sm border-radius-round"
                onClick={() => history.push(`/project/detail/${data.projectCode}`)}
              >
                View
              </MuiButton>
            )}
          </div>
        </div>
        <div className="projectCard__thumbnail">
          <TeethSvgV2
            // teeth={{
            //   value: [
            //     {
            //       number: '22',
            //       indicationIdx: '4',
            //     },
            //     {
            //       number: '21',
            //       indicationIdx: '4',
            //     },
            //   ],
            // }}
            // bridge={{ value: ['2122', '2122'] }}
            teeth={{ value: data.teeth }}
            bridge={{ value: data.bridgeList }}
            numbering={{ value: 0 }}
            hiddenToothText
          />
        </div>
      </div>
      {isUnfoldCard && <div className="projectCard__mask"></div>}
    </StyledProjectCard>
  );
};

const StyledProjectCard = styled.div<{ isRework: boolean; isUnfoldCard: boolean }>`
  position: relative;
  width: 386px;
  max-height: 314px;
  overflow-y: ${({ isUnfoldCard }) => isUnfoldCard && 'hidden'};
  &:before {
    content: '';
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 90%;
    border-radius: 10px;
    box-shadow: inset 0px 2px 3px rgba(0, 0, 0, 0.16);
    background-color: ${({ isRework }) => (isRework ? color.navy_blue : '#fcfcfc')};
  }
  .projectCard__mask {
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 50px;
    background: linear-gradient(to bottom, rgba(125, 185, 232, 0) 0%, rgba(255, 255, 255, 1) 100%);
  }

  .projectCard__top_box {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 20px;
    font-size: 12px;
    color: ${({ isRework }) => isRework && 'white'};

    .projectCard__top {
      display: flex;
      align-items: center;
      line-height: 1;
      .projectCard__symbol {
        display: inline-block;
        margin-right: 12px;
        width: 14px;
        height: 14px;
        border-radius: 2px;
      }
    }
    .projectCard__enroll_date {
      color: #858997;
    }
  }

  .projectCard__fold_btn {
    margin: -12px -5px;
    padding: 0;
  }
  .projectCard__rework_box {
    position: relative;
    padding: 15px 20px;

    font-size: 15px;
    color: white;
    font-weight: 300;
    line-height: 1.4;

    .dot {
      display: inline-block;
      position: relative;
      /* top: 4px; */
      margin-right: 10px;
      width: 18px;
      height: 18px;
      background-color: white;
    }
    .projectCard__rework_title {
      margin-bottom: 10px;
    }
    .projectCard__rework_content {
      .projectCard__rework_content_item {
        display: flex;
        padding: 2px 0;
        .projectCard__rework_content_description {
          height: 42px;
          overflow: hidden;
          text-overflow: ellipsis;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }
      }
      .projectCard__rework_content_select_btn_box {
        margin-top: 20px;
        .button {
          height: 30px;
          width: 50%;
        }
      }
    }
  }

  .projectCard__content {
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    position: relative;
    padding: 20px;
    background-color: white;
    border-radius: 10px;
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);

    .projectCard__info {
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      width: calc(100% - 140px - 15px);
      font-size: 15px;

      .projectCard__info_item {
        &.btn_box {
          .button {
            height: 30px;
          }
        }
      }

      .projectCard__title {
        margin-bottom: 20px;
        height: 100px;
        font-size: 16px;
        font-weight: 500;
        line-height: 1.3;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 5;
        -webkit-box-orient: vertical;
      }

      .projectCard__by,
      .projectCard__deadline,
      .projectCard__client_name {
        display: flex;
        align-items: center;
        margin-bottom: 10px;
        > img {
          margin-right: 10px;
        }
      }
      .projectCard__by {
        font-size: 13px;
        color: ${color.blue};
      }
      .projectCard__deadline {
      }
      .projectCard__client_name {
      }
    }
    .projectCard__thumbnail {
      width: 140px;
      margin: -5px 0;
    }
  }
`;

export default React.memo(ProjectCard);
