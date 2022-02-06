import { Grid } from '@material-ui/core';
import Color from 'color';
import PencilUnderlineIcon from 'components/base/icons/PencilUnderlineIcon';
import MuiButton from 'components/common/button/MuiButton';
import AppModal from 'components/common/modal/AppModal';
import PlainModal from 'components/common/modal/PlainModal';
import GoldStatusModalContainer from 'containers/project/GoldStatusModalContainer';
import moment from 'moment';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import styled from 'styled-components';
import { beforeDash, color, paper, paperSubtitle } from 'styles/utils';
import ProjectContactContainer from 'containers/project/ProjectContactContainer';
import ProjectInformation from './ProjectInformation';
import ProjectIndication from './ProjectIndication';
import ProjectUploadContainer from 'containers/project/ProjectUploadContainer';
import { paperStyle } from './ProjectShared';

interface ProjectProps {
  indicationFormat: object | any;
  indicationInfo: object | any;
  projectInfo: object | any;
}

function Project({ indicationFormat, indicationInfo, projectInfo }: ProjectProps) {
  const { t } = useTranslation();
  const {
    stage,
    projectCode,
    dueDate,
    programName,
    point,
    userType, // sender, receiver, manager?
    remakeInfo,
    timeline,
  } = projectInfo;
  const [goldStatusModalOpen, setGoldStatusModalOpen] = useState(false);
  const isSender = useMemo(() => userType === 'sender', [userType]);
  const isReceiver = useMemo(() => userType === 'receiver', [userType]);
  const isAdmin = useMemo(() => userType === 'admin', [userType]);

  // SECTION: function

  const handleCloseGoldStatusModal = () => setGoldStatusModalOpen(false);

  return (
    <StyledProject data-component-name="Project">
      <>
        <div className="project__title_box">
          <span className="project__title_badge" />
          <h1 className="project__title">
            <span className="project__title_text">Project Name</span>
            <span className="project__title_date">
              {moment.unix(projectInfo?.enrollDate).format('MMM. DD. YYYY')}
            </span>
          </h1>
          {/* <MuiButton
            config={{
              width: 150,
            }}
            variant="contained"
            color="secondary"
            disableElevation
            className="md inset-shadow-default border-radius-round"
            startIcon={<PencilUnderlineIcon />}
          >
            Modify
          </MuiButton> */}
        </div>

        <div className="project__container">
          <Grid item className="project__content_container">
            <div className="project__grid_item main">
              <section className="project__teeth_container">
                <h1 className="sr-only">Teeth Information, Indication</h1>
                <ProjectInformation {...projectInfo} />

                <ProjectIndication
                  indicationFormat={indicationFormat}
                  indicationInfo={indicationInfo}
                  projectInfo={projectInfo}
                />
                <h2 className="project__upload_content_title">
                  Data/Design
                  {/* {isSender && stage !== 4 && (
                  <span className="project_upload_content_download_alarm">
                    <T>PROJECT_DOWNLOAD_ALARM</T>
                  </span>
                )} */}
                </h2>

                <div className="project__upload_content_wrapper">
                  <ProjectUploadContainer hasViewer={true} hasUpload={true} />
                </div>
              </section>
            </div>
          </Grid>

          <Grid item className="project__contact_container aside">
            <ProjectContactContainer />
          </Grid>
        </div>
      </>
    </StyledProject>
  );
}

export default React.memo(Project);

const StyledProject = styled.div`
  .project__title_box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 30px;
    .project__title_badge {
      display: inline-block;
      margin-right: 20px;
      width: 40px;
      height: 40px;
      background-color: #eaeaea;
    }
    .project__title {
      position: relative;
      margin-right: 20px;
      /* max-width: calc(100% - 60px - 150px - 20px); */
      max-width: 1230px;
      .project__title_text {
        display: inline-block;
        margin-right: 30px;
        /* max-width: calc(100% - 105px - 30px); */
        max-width: 1095px;
        font-size: 36px;
        font-weight: 500;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
      }
      .project__title_date {
        font-size: 17px;
        color: #858997;
      }
    }
  }
  .project__container {
    display: flex;
    justify-content: space-between;
    margin: 0 auto;
    padding-top: 30px;
  }
  .project__content_container {
    position: relative;
    width: 1000px;
  }
  .project__contact_container {
    width: 400px;
  }

  .project__teeth_container {
    ${paper};
    padding-bottom: 70px;
  }
  .section-title {
    display: flex;
    align-items: center;
    height: 34px;
    padding-left: 15px;
    background-color: ${color.blue_week};
    font-size: 16px;
    font-weight: 700;
  }
  .project__upload_content_title {
    ${beforeDash({ width: 85 })};
    margin-top: 70px;
    font-size: 22px;
    padding-bottom: 25px;
  }
  .project_upload_content_download_alarm {
    color: ${color.blue};
    margin-left: 20px;
    font-size: 14px;
    font-weight: 300;
  }
  .project__upload_content_wrapper {
    padding: 0 50px;
  }

  .projectInformation__btn_box {
    position: relative;
    display: flex;
    .projectInformation__reject_btn {
      position: relative;
      z-index: 2;
    }
    .projectInformation__accept_btn {
      margin-left: -10px;
      background: ${({ theme }) => theme.color.primary};
      background: ${({ theme }) => theme.gradient.primary};
      border: none !important;
      border-top-left-radius: 0;
      border-bottom-left-radius: 0;
      overflow: hidden;
      &:hover {
        background: ${`linear-gradient(
            90deg,
            ${Color('rgba(0, 166, 226, 1)').darken(0.12)} 0%,
            ${Color('rgba(8, 123, 238, 1)').darken(0.12)} 100%
          )`};
      }
      .btn-shadow-inset {
        position: absolute;
        top: -2px;
        left: -20px;
        width: 40px;
        height: 44px;
        border-radius: 20px;
        box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.16);
      }
    }
  }
`;
