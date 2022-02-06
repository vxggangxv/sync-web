import React, { useMemo, useState } from 'react';
import styled, { css } from 'styled-components';
import moment from 'moment';
import CustomSpan from 'components/common/text/CustomSpan';
import MuiButton from 'components/common/button/MuiButton';
import AddIcon from '@material-ui/icons/Add';
import CreateProjectInformation, {
  CreateProjectInformationProps,
} from './CreateProjectInformation';
import CreateProjectIndication, { CreateProjectIndicationProps } from './CreateProjectIndication';
import { Tooth } from './ProjectShared';
import StageTimeline from './StageTimeline';
import PlainModal from 'components/common/modal/PlainModal';
import { color } from 'styles/utils';
import { headerHeight } from 'components/base/header/AppHeader';

interface CreateProjectProps extends CreateProjectInformationProps, CreateProjectIndicationProps {
  isValidInformationValue: boolean;
  isValidIndicationValue: boolean;
}

function CreateProject({
  isValidInformationValue,
  isValidIndicationValue,
  onToggleTooth,
  onChangeToothValue,
  onCreateProject,
  onClickTooth,
  //
  projectPartners,
  hasMoreProjectPartners,
  employeeList,
  caseId,
  informationControl,
  informationErrors,
  setInformation,
  informationWatch,
  onFetchProjectPartners,
  //
  indicationFormat,
  indicationInfo,
  stage,
  timeline,
  toothShade,
  numbering,
  tooth,
  teeth,
  bridge,
  teethContextActions,
  copyData,
  indicationSeq,
  indication,
  material,
  implant,
  checkSituScan,
  checkGingivaScan,
  virtualGingiva,
  thimbleCrown,
  cervicalAdaption,
  gapWithCement,
  minimalTickness,
  millingToolDiameter,
  restorationPontic,
  occlusalSurface,
  ceramicMetal,
}: CreateProjectProps) {
  // TEMP:
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

  return (
    <StyledCreateProject data-component-name="CreateProject">
      {/* timeline */}
      <div className="createProject__tiemline_box">
        <StageTimeline stage={stage} timeline={timeline} />
      </div>

      <div className="createProject__title_box">
        <span className="createProject__title_badge" />
        <h1 className="createProject__title">
          <CustomSpan fontSize={36} fontWeight={500} marginRight={30}>
            New Project
          </CustomSpan>
          <CustomSpan fontSize={17} fontColor="#858997">
            {moment().format('MMM. DD. YYYY')}
          </CustomSpan>
        </h1>
      </div>

      {/* 1 */}
      {useMemo(
        () => (
          <CreateProjectInformation
            isValidInformationValue={isValidInformationValue}
            projectPartners={projectPartners}
            hasMoreProjectPartners={hasMoreProjectPartners}
            employeeList={employeeList}
            caseId={caseId}
            informationControl={informationControl}
            informationErrors={informationErrors}
            setInformation={setInformation}
            informationWatch={informationWatch}
            onFetchProjectPartners={onFetchProjectPartners}
          />
        ),
        [
          isValidInformationValue,
          projectPartners,
          hasMoreProjectPartners,
          employeeList,
          caseId,
          informationControl,
          informationErrors,
          setInformation,
          informationWatch,
          onFetchProjectPartners,
        ],
      )}

      {/* 2 */}
      {useMemo(
        () => (
          <CreateProjectIndication
            isValidInformationValue={isValidInformationValue}
            isValidIndicationValue={isValidIndicationValue}
            stage={stage}
            timeline={timeline}
            onCreateProject={onCreateProject}
            onClickTooth={onClickTooth}
            indicationFormat={indicationFormat}
            indicationInfo={indicationInfo}
            toothShade={toothShade}
            numbering={numbering}
            tooth={tooth}
            teeth={teeth}
            bridge={bridge}
            teethContextActions={teethContextActions}
            copyData={copyData}
            indicationSeq={indicationSeq}
            indication={indication}
            material={material}
            implant={implant}
            checkSituScan={checkSituScan}
            checkGingivaScan={checkGingivaScan}
            virtualGingiva={virtualGingiva}
            thimbleCrown={thimbleCrown}
            cervicalAdaption={cervicalAdaption}
            gapWithCement={gapWithCement}
            minimalTickness={minimalTickness}
            millingToolDiameter={millingToolDiameter}
            restorationPontic={restorationPontic}
            occlusalSurface={occlusalSurface}
            ceramicMetal={ceramicMetal}
            onToggleTooth={onToggleTooth}
            onChangeToothValue={onChangeToothValue}
          />
        ),
        [
          isValidInformationValue,
          isValidIndicationValue,
          onCreateProject,
          indicationFormat,
          toothShade,
          numbering,
          tooth,
          teeth,
          bridge,
          teethContextActions,
          copyData,
          indicationSeq,
          indication,
          material,
          implant,
          checkSituScan,
          checkGingivaScan,
          virtualGingiva,
          thimbleCrown,
          cervicalAdaption,
          gapWithCement,
          minimalTickness,
          millingToolDiameter,
          restorationPontic,
          occlusalSurface,
          ceramicMetal,
          onToggleTooth,
          onChangeToothValue,
        ],
      )}
    </StyledCreateProject>
  );
}

export default React.memo(CreateProject);

const StyledCreateProject = styled.section`
  position: relative;
  padding-bottom: 100px;

  .createProject__tiemline_box {
    display: flex;
    align-items: center;
    z-index: 1;
    margin-top: -${headerHeight}px;
    width: calc(100% - 100px - 200px);
    height: 120px;
    /* padding-top: 15px;
    padding-left: 40px; */
  }
  .createProject__title_box {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    margin-top: 30px;
    .createProject__title_badge {
      display: inline-block;
      margin-right: 20px;
      width: 40px;
      height: 40px;
      background-color: #eaeaea;
    }
    .createProject__title {
    }
  }
  .createProject__btn_box {
    margin-top: -25px;
    text-align: center;
    .createProject__create_btn {
      width: 300px;
      font-weight: 700;
      svg {
        margin-right: 3px;
      }
    }
  }
`;
