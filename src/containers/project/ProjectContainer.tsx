import React, { useEffect, useMemo, useState } from 'react';
import styled from 'styled-components';
import StageTimeline from 'components/project/StageTimeline';
import { Grid } from '@material-ui/core';
import Project from 'components/project/Project';
import ProjectInformationContainer from 'containers/project/ProjectInformationContainer';
import ProjectChatContainer from 'containers/project/ProjectChatContainer';
import ProjectLogContainer from 'containers/project/ProjectLogContainer';
import { headerHeight } from 'components/base/header/AppHeader';
import useInput from 'lib/hooks/useInput';
import PlainModal from 'components/common/modal/PlainModal';
import AppModal from 'components/common/modal/AppModal';
import CompleteProjectModalContainer from 'containers/project/CompleteProjectModalContainer';
import { useDidUpdateEffect } from 'lib/utils';
import { paperStyle } from 'components/project/ProjectShared';
import { paper_plane_in_circle } from 'components/base/images';
import CustomText from 'components/common/text/CustomText';
import { StyledInShadowButtonOuter } from 'components/common/styled/Button';
import MuiButton from 'components/common/button/MuiButton';
import { color } from 'styles/utils';
import Color from 'color';
import { useParams } from 'react-router-dom';
import { AppActions, FileActions, ProjectActions, UtilActions } from 'store/actionCreators';
import { useShallowAppSelector } from 'store/hooks';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import ProjectInformation from 'components/project/ProjectInformation';

export default function ProjectContainer() {
  const {
    user,
    indicationFormat,
    indicationFormatSuccess,
    indicationInfo,
    indicationInfoSuccess,
    projectData: { projectInfo },
    fetchProjectSuccess,
    createProjectSyncSuccess,
    editProjectSyncSuccess,
  } = useShallowAppSelector(state => ({
    user: state.user.user,
    indicationFormat: state.util.indicationFormat.data?.indicationFormat,
    indicationFormatSuccess: state.util.indicationFormat.success,
    indicationInfo: state.util.indicationInfo.data?.indicationInfo,
    indicationInfoSuccess: state.util.indicationInfo.success,
    projectData: state.project.project.data || {},
    fetchProjectSuccess: state.project.project.success,
    createProjectSyncSuccess: state.project.createProjectSync.success,
    editProjectSyncSuccess: state.project.editProjectSync.success,
  }));
  const { pcode: projectCode } = useParams() as { pcode: string };
  const syncInfo = projectInfo?.syncInfo;
  const timeline = projectInfo?.timeline;
  const projectId = projectInfo?.projectId;
  const teeth = projectInfo?.indication?.teeth;
  const projectStep = useInput(1);
  const setProjecStepValue = useMemo(() => {
    return fetchProjectSuccess && projectStep.setValue(projectInfo?.stage);
  }, [fetchProjectSuccess]);
  // TODO: notifications mapping
  const hasAlarm = syncInfo?.syncStatus === 0 && syncInfo?.partnerEmail === user.email;
  const hasOwnTimeline = timeline?.hasOwnProperty('new') && !!timeline['new'];
  const [completeProjectModalOpen, setCompleteProjectModalOpen] = useState(false);

  // SECTION: function

  const handleCloseCompleteProjectModal = () => setCompleteProjectModalOpen(false);
  const handleOpenCompleteProjectModal = () => setCompleteProjectModalOpen(true);
  const handleEditProjectSync = (syncStatus: number) =>
    ProjectActions.edit_project_sync_request({ projectCode, syncStatus });

  // SECTION: DidMount

  useEffect(() => {
    UtilActions.fetch_teeth_indication_format_request();
    UtilActions.fetch_teeth_indication_info_request();
    ProjectActions.fetch_project_request(projectCode);

    return () => {
      ProjectActions.fetch_project_clear();
    };
  }, []);

  // TEST:
  // useEffect(() => {
  //   AppActions.add_popup({
  //     isOpen: true,
  //     title: 'title',
  //     content: 'content',
  //     // disableBackdropClick: true,
  //   });
  // }, []);

  // SECTION: DidUpdate

  // get project after invite accept, reject
  useDidUpdateEffect(() => {
    if (editProjectSyncSuccess) {
      ProjectActions.fetch_project_request(projectCode);
    }
  }, [!!editProjectSyncSuccess]);

  // // change by projectStep.value
  // useDidUpdateEffect(() => {
  //   if (projectStep.value === 7) {
  //     setCompleteProjectModalOpen(true);
  //   }
  // }, [projectStep.value]);

  // const timeline = {
  //   // create: 1630634280,
  //   // preparation: 1630734289,
  //   // scan: 1630834289,
  //   // cad: null,
  //   // cam: null,
  //   // milling: null,
  //   // postProcess: 1631234289,
  //   // completed: null,
  //   create: 1630634280,
  //   preparation: 1630634281,
  //   // preparation: null,
  //   scan: 1630634282,
  //   // scan: null,
  //   // cad: 1630634283,
  //   cad: null,
  //   // cam: 1630634284,
  //   cam: null,
  //   milling: 1630634285,
  //   // milling: null,
  //   // postProcess: 1630634286,
  //   postProcess: null,
  //   // completed: 1630634287,
  //   completed: null,
  // };

  // TEST:
  // useEffect(() => {
  //   console.log('projectStep.value', projectStep.value);
  // }, [projectStep.value]);

  const { isFetchSuccess } = useFetchLoading({
    indicationFormatSuccess,
    indicationInfoSuccess,
    fetchProjectSuccess,
  });
  if (!isFetchSuccess) return null;
  return (
    <>
      {/* CompleteProject */}
      <PlainModal isOpen={completeProjectModalOpen} onClose={() => {}} width={1280}>
        <AppModal
          title={'Complete project'}
          content={
            <CompleteProjectModalContainer
              projectInfo={projectInfo}
              onCancel={handleCloseCompleteProjectModal}
            />
          }
          contentCardStyle={{
            borderRadius: '8px',
            marginBottom: '28px',
            padding: '38px 30px 76px',
          }}
          isCloseIcon={true}
          // onCancel={handleCloseCompleteProjectModal}
          hideButton={true}
        />
      </PlainModal>

      <StyledProjectContainer>
        {/* timeline */}
        {hasOwnTimeline && (
          <div className="project__tiemline_box">
            <StageTimeline
              stage={projectInfo?.stage}
              timeline={timeline}
              projectCode={projectCode}
              onOpenCompleteProjectModal={handleOpenCompleteProjectModal}
            />
          </div>
        )}

        {/* accept notifications */}
        {hasAlarm && (
          <div className="project__notifications_container">
            <div className="project__notifications_icon_box">
              <img src={paper_plane_in_circle} alt="alarm" />
            </div>
            <div className="project__notifications_info_box">
              <CustomText fontSize={20} fontColor={color.blue} marginBottom={-5}>
                [Invited]
              </CustomText>
              <h2>A new project has arrived.</h2>
              <CustomText fontSize={22} fontWeight={500}>
                Project name : {'Project Name'}
              </CustomText>
              <CustomText fontSize={16}>{'- 웃는내일치과 -'}</CustomText>
            </div>

            <StyledInShadowButtonOuter height={66} right={110} width={410}>
              <div className="projectInformation__btn_box">
                <MuiButton
                  config={{
                    width: '95px',
                    color: color.gray_week,
                  }}
                  disableElevation
                  variant="contained"
                  className="xl border-radius-round inset-shadow-default projectInformation__reject_btn"
                  onClick={() => handleEditProjectSync(2)}
                >
                  Reject
                </MuiButton>
                <MuiButton
                  config={{
                    width: '295px',
                  }}
                  disableElevation
                  variant="contained"
                  className="xl border-radius-round inset-shadow-default projectInformation__accept_btn"
                  onClick={() => handleEditProjectSync(1)}
                >
                  <span className="btn-shadow-inset"></span>
                  Accept
                </MuiButton>
              </div>
            </StyledInShadowButtonOuter>
          </div>
        )}

        <Project
          indicationFormat={indicationFormat}
          indicationInfo={indicationInfo}
          projectInfo={projectInfo}
        />

        {/* information, file */}
        {/* <ProjectInformationContainer /> */}

        {/* chat, log */}
        {/* <Grid container justifyContent="space-between" className="project__chat_log_container">
          <Grid item className="project__chat">
            <ProjectChatContainer />
          </Grid>
          <Grid item className="project__log">
            <ProjectLogContainer />
          </Grid>
        </Grid> */}
      </StyledProjectContainer>
    </>
  );
}

const StyledProjectContainer = styled.section`
  position: relative;
  padding-bottom: 100px;
  max-width: 1460px;

  .project__tiemline_box {
    display: flex;
    align-items: center;
    z-index: 1;
    margin-top: -${headerHeight}px;
    width: calc(100% - 100px - 200px);
    height: 120px;
    /* padding-top: 15px;
    padding-left: 40px; */
  }

  .project__notifications_container {
    ${paperStyle};
    display: flex;
    align-items: center;
    position: relative;
    margin-bottom: 50px;
    padding: 20px 45px;

    .project__notifications_info_box {
      width: calc(100% - 152px);
      padding-left: 60px;
      > *:not(:first-child) {
        margin-top: 15px;
      }
      h2 {
        font-size: 29px;
        font-weight: 700;
      }
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
        background: rgb(0, 166, 226);
        background: linear-gradient(90deg, rgba(0, 166, 226, 1) 0%, rgba(8, 123, 238, 1) 100%);
        border: none;
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
          top: -5px;
          left: -46px;
          width: 66px;
          height: 66px;
          border-radius: 33px;
          background-color: white;
          box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.16);
        }
      }
    }
  }

  .project__chat_log_container {
    margin-top: 55px;
    .project__chat {
      width: 660px;
    }
    .project__log {
      width: 760px;
    }
  }
`;
