import { Grid } from '@material-ui/core';
import { useParams } from 'react-router-dom';
import PencilUnderlineIcon from 'components/base/icons/PencilUnderlineIcon';
import MuiButton from 'components/common/button/MuiButton';
import DateConverter from 'components/common/convert/DateConverter';
import EscapeConvert from 'components/common/convert/EscapeConvert';
import AppModal from 'components/common/modal/AppModal';
import PlainModal from 'components/common/modal/PlainModal';
import CustomSpan from 'components/common/text/CustomSpan';
import T from 'components/common/text/T';
import GoldStatusModalContainer from 'containers/project/GoldStatusModalContainer';
import moment from 'moment';
import PropTypes from 'prop-types';
import React, { useMemo, useState } from 'react';
import { useHistory } from 'react-router';
import styled from 'styled-components';
import { beforeDash, color, paperSubtitle } from 'styles/utils';

interface ProjectInformationProps {
  // TEMP:
  clientName: string | null;
  projectId: string;
  projectName: string;
  dueDate: number;
  manager: string;
  senderMemo: string;
  projectCode: string;
  stage: number;
  partnerGroupCode: string;
}

function ProjectInformation({
  clientName,
  projectId,
  projectName,
  dueDate,
  manager,
  senderMemo,
  projectCode,
  stage,
  partnerGroupCode,
}: // userType,
// patient,
// preferedProgram,
// languageIsoGroup,
ProjectInformationProps) {
  // const isReceiver = useMemo(() => userType === 'receiver', [userType]);
  // const isSender = useMemo(() => userType === 'sender', [userType]);
  // const isAdmin = useMemo(() => userType === 'admin', [userType]);
  const { pcode } = useParams() as { pcode: string };
  const history = useHistory();
  const [goldStatusModalOpen, setGoldStatusModalOpen] = useState(false);

  const handleCloseGoldStatusModal = () => setGoldStatusModalOpen(false);

  return (
    <>
      {/* GoldStatusModal */}
      {useMemo(
        () => (
          <PlainModal
            isOpen={goldStatusModalOpen}
            onClose={handleCloseGoldStatusModal}
            width={1000}
          >
            <AppModal
              title={'Gold Status'}
              headerCenterText={'Dof_project_123(project name)'}
              headerCenterTextStyle={{ width: 325 }}
              content={<GoldStatusModalContainer />}
              contentCardStyle={{
                padding: '30px 35px 25px',
                borderRadius: '8px',
              }}
              isCloseIcon={true}
              onCancel={handleCloseGoldStatusModal}
              hideButton={true}
            />
          </PlainModal>
        ),
        [goldStatusModalOpen],
      )}

      <Styled.ProjectInformation
        data-component-name="ProjectInformation"
        className="projectInformation__container"
      >
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          className="projectInformation__content_title_box"
        >
          <h2
            className="projectInformation__content_title"
            dangerouslySetInnerHTML={{ __html: projectId }}
          >
            {}
          </h2>
          {stage < 2 && (
            <MuiButton
              config={{
                width: 155,
                borderColor: color.gray_b5,
                bgColor: 'white',
              }}
              variant="outlined"
              className="sm"
              onClick={() => history.push(`/project/edit/${pcode}`)}
              startIcon={<PencilUnderlineIcon color={color.gray_b5} width={15} />}
            >
              <T>GLOBAL_MODIFY</T>
            </MuiButton>
          )}
        </Grid>

        {/* Client, Gold Hold Status */}
        <div className="projectInformation__content_grid_wrapper">
          <Grid container alignItems="flex-start">
            <Grid item xs={6} className="projectInformation__grid_container col1">
              <Grid spacing={3} container style={{ overflowX: 'hidden' }}>
                <Grid
                  item
                  container
                  alignItems="flex-start"
                  className="projectInformation__grid_item"
                >
                  <Grid item xs={4}>
                    <span className="form__label">
                      <T>Client</T>
                    </span>
                  </Grid>
                  <Grid item xs={8}>
                    {clientName}
                  </Grid>
                </Grid>

                <Grid
                  item
                  container
                  alignItems="flex-start"
                  className="projectInformation__grid_item"
                >
                  <Grid item xs={4}>
                    <span className="form__label">
                      <T>PROJECT_NAME</T>
                    </span>
                  </Grid>
                  <Grid item xs={8}>
                    {projectName}
                  </Grid>
                </Grid>

                <Grid
                  item
                  container
                  alignItems="flex-start"
                  className="projectInformation__grid_item"
                >
                  <Grid item xs={4}>
                    <span className="form__label">
                      <T>PROJECT_MANAGER</T>
                    </span>
                  </Grid>
                  <Grid item xs={8}>
                    {manager}
                  </Grid>
                </Grid>
                <Grid
                  item
                  container
                  alignItems="flex-start"
                  className="projectInformation__grid_item"
                >
                  <Grid item xs={4}>
                    <span className="form__label">
                      <T>PROJECT_DUE_DATE</T>
                    </span>
                  </Grid>
                  <Grid item xs={8}>
                    {moment.unix(dueDate).format('MMM. DD. YYYY HH:mm')}
                  </Grid>
                </Grid>
                <Grid item container alignItems="center" className="projectInformation__grid_item">
                  <Grid item xs={4}>
                    <span className="form__label">Gold Hold Status</span>
                  </Grid>
                  <Grid item xs={8}>
                    <MuiButton
                      config={{ width: 150, color: color.navy_blue }}
                      disabled={!partnerGroupCode}
                      variant="outlined"
                      className="sm border-radius-round inset-shadow-default gold_status_btn"
                      onClick={() => setGoldStatusModalOpen(true)}
                    >
                      <CustomSpan fontWeight={700}>Check Out</CustomSpan>
                    </MuiButton>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
            {/*  */}
            <Grid item xs={6} className="projectInformation__grid_container col2">
              <Grid spacing={3} container style={{ overflowX: 'hidden' }}>
                {/* <Grid
                item
                container
                alignItems="flex-start"
                className="projectInformation__grid_item"
              >
                
                <T>PROJECT_MEMO</T>
                
              </Grid> */}
                <Grid
                  item
                  container
                  alignItems="flex-start"
                  className="projectInformation__grid_item"
                >
                  <div className="projectInformation__memo">
                    <EscapeConvert content={senderMemo} />
                  </div>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </div>
      </Styled.ProjectInformation>
    </>
  );
}

export default React.memo(ProjectInformation);

const Styled = {
  ProjectInformation: styled.div`
    .projectInformation__content_title_box {
      padding-right: 90px;
      padding-bottom: 40px;
    }
    .projectInformation__content_title {
      ${beforeDash({ width: 85 })};
      font-size: 22px;
    }
    .projectInformation__content_grid_wrapper {
      padding: 0 90px;
    }
    .projectInformation__grid_container {
      &.col1 {
      }
      &.col2 {
      }
      .projectInformation__grid_item {
        font-size: 14px;
      }
    }
    .form__label {
      padding-left: 10px;
    }
    .projectInformation__memo {
      width: 100%;
      height: 182px;
      overflow-y: overlay;
      padding: 14px;
      border: 1px solid ${color.gray_b5};
      border-radius: 5px;
      line-height: 1.5;
    }
  `,
};
