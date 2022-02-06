import React, { ReactElement, useCallback, useContext, useMemo, useState } from 'react';
import useInput from 'lib/hooks/useInput';
import { useForm } from 'react-hook-form';
import { useEffect } from 'react';
import CreateProject from 'components/project/CreateProject';
import useImmerInput from 'lib/hooks/useImmerInput';
import useCheckOneInput from 'lib/hooks/useCheckOneInput';
import { indicationFormat } from 'components/common/teeth/teethInformation';
import { useShallowAppSelector } from 'store/hooks';
import { useDidUpdateEffect } from 'lib/utils';
import { Tooth } from 'components/project/ProjectShared';
import { AppActions, UtilActions, ProjectActions, PartnerActions } from 'store/actionCreators';
import CustomText from 'components/common/text/CustomText';
import { color } from 'styles/utils';
import { Prompt, useHistory, useLocation, useParams } from 'react-router-dom';
import useFetchLoading from 'lib/hooks/useFetchLoading';
import useExitPrompt from 'lib/hooks/useExitPrompt';
import { cutUrl, makeCaseIdFn } from 'lib/library';
import moment from 'moment';
import { pageUrl } from 'lib/mapper';
import { T } from 'components/common/text';
import { debounce } from 'lodash';
import { ENV_MODE_PROD } from 'lib/setting';
import queryString from 'query-string';
import { ProjectContext } from 'contexts/project/ProjectContext';

interface InformationFormInput {
  createType: number | string;
  projectTitle: string;
  clientType: number | string;
  client: number | string;
  dueDate: Date;
  senderMemo: string;
  manager: number | string;
}

// children?: React.ReactNode
function CreateProjectContainer() {
  const {
    // teethData,
    //
    user: { userGroupIdx: userId, userCode, company },
    projectInit,
    projectInitSuccess,
    indicationFormat,
    indicationInfo,
    indicationFormatSuccess,
    indicationInfoSuccess,
    projectData,
    fetchProjectSuccess,
    editProjectData,
    editProjectSuccess,
    editProjectError,
    editProjectFailure,
    projectPartnersData,
    projectPartnersSuccess,
    reworkProjectData,
    reworkProjectSuccess,
  } = useShallowAppSelector(state => ({
    // teethData: state.util.teeth,
    //
    user: state.user.user || {},
    projectInit: state.project.initProject.data?.projectInit,
    projectInitSuccess: state.project.initProject.success,
    indicationFormat: state.util.indicationFormat.data?.indicationFormat,
    indicationFormatSuccess: state.util.indicationFormat.success,
    indicationInfo: state.util.indicationInfo.data?.indicationInfo,
    indicationInfoSuccess: state.util.indicationInfo.success,
    projectData: state.project.project.data,
    fetchProjectSuccess: state.project.project.success,
    editProjectData: state.project.editProject.data,
    editProjectSuccess: state.project.editProject.success,
    editProjectError: state.project.editProject.error,
    editProjectFailure: state.project.editProject.failure,
    projectPartnersData: state.partner.projectPartners.data,
    projectPartnersSuccess: state.partner.projectPartners.success,
    reworkProjectData: state.project.reworkProject.data,
    reworkProjectSuccess: state.project.reworkProject.success,
  }));
  // fetch project data
  const projectInfo = projectData?.projectInfo;
  const reworkProjectInfo = reworkProjectData?.projectInfo;
  const copyOrder = reworkProjectData?.projectRework?.copyOrder;

  // const projectFileList = projectData?.fileList;

  // information state
  const {
    control: informationControl,
    handleSubmit: handleSubmitInformation,
    errors: informationErrors,
    setValue: setInformation,
    watch: informationWatch,
    register,
    getValues: getInformation,
    formState,
  } = useForm<InformationFormInput>({
    mode: 'onChange',
    defaultValues: {
      createType: 0,
      clientType: 0,
    },
  });
  const onSubmit = (data: InformationFormInput) => console.log();
  // NOTE: prevent refresh in Production
  const [showExitPrompt, setShowExitPrompt] = useExitPrompt(false);
  const history = useHistory();
  const { pcode: projectCodeParam } = useParams() as { pcode: string };
  // const { search } = useLocation();
  // const queryParse = queryString.parse(search);
  // const reworkProjectCode = (queryParse?.reworkProjectCode as string) || '';
  const { reworkProjectCode } = useContext(ProjectContext);
  const [projectPartners, setProjectPartners] = useState([]);
  const setProjectPartnersValue = useMemo(
    () =>
      projectPartnersSuccess &&
      setProjectPartners(draft => draft.concat(projectPartnersData?.list)),
    [!!projectPartnersSuccess],
  );

  const projectPartnersPagingData = projectPartnersData?.pagingData;
  const hasMoreProjectPartners =
    projectPartnersPagingData?.page < projectPartnersPagingData?.totalPage;
  const employeeList = projectInit?.employeeList;

  // indicationFormat api 요청 필요
  // indication state
  const toothShade = useInput('');
  const numbering = useInput(0);
  // tooth = { number: null, index: null, hasDate: false }
  const tooth = useInput({
    number: null,
    hasDate: false,
    // number: 18,
  }); // teeth 단수
  const teeth = useInput([]);
  // const teeth = useInput([
  //   {
  //     indicationIdx: 11,
  //     preparationType: 3,
  //     number: 22,
  //     reconstructionType: 31,
  //     material: 5,
  //     color: '#335C15',
  //     implantType: 4,
  //     situScan: 1,
  //     separateGingivaScan: 0,
  //     teethTreatmentIdx: 852,
  //   },
  //   {
  //     indicationIdx: 13,
  //     preparationType: 3,
  //     number: 23,
  //     reconstructionType: 31,
  //     material: 5,
  //     color: '#25879A',
  //     implantType: 4,
  //     situScan: 1,
  //     separateGingivaScan: 0,
  //     teethTreatmentIdx: 852,
  //   },
  // ]);
  const bridge = useInput([]);
  // teethContextActions 생성
  const teethContextActions = useImmerInput({
    copy: {
      active: false,
      hidden: false,
    },
    paste: {
      active: false,
      hidden: false,
    },
    delete: {
      active: false,
      hidden: false,
    },
  });
  const copyData = useInput({ number: null, hasData: false });
  const indicationSeq = useInput(0);
  // {id, seq, color}
  const indication = useInput({
    id: 0,
    seq: 0,
    // color: '',
    color: color.blue,
  });
  const material = useInput(0);
  const implant = useInput(0);
  const checkSituScan = useCheckOneInput(false);
  const checkGingivaScan = useCheckOneInput(false);
  // TODO: check backend data
  const virtualGingiva = useInput(0); // 0: no, 1: yes, 2: optional
  const thimbleCrown = useInput(0); // 0: no, 1: yes,
  const cervicalAdaption = useInput(0); // 1: pull to margin, 2: preserve tooth library shape
  //
  const gapWithCement = useInput(0.08); // 0.00 ~ 0.20 mm
  const minimalTickness = useInput(0.6); // 0.40 ~ 1.00 mm
  const millingToolDiameter = useInput(1.2); // 0.0 ~ 1.50 mm
  // tooth design
  const restorationPontic = useInput(0);
  const occlusalSurface = useInput(0);
  const ceramicMetal = useInput(0);
  // fetch project state
  const [stage, setStage] = useState(0);
  const [timeline, setTimeline] = useState({ create: moment(moment.now()).unix() });
  // fetch project state, edit api required value
  const [teethTreatmentIdx, setTeethTreatmentIdx] = useState(null);
  const [projectCode, setProjectCode] = useState('');
  //   "projectInit": {
  //     "projectCount": 0,
  //     "employeeList": [
  //         {
  //             "employeeIdx": 13,
  //             "userName": "직원2",
  //             "employeeNum": 2,
  //             "postPosition": "Sales"
  //         },
  //         {
  //             "employeeIdx": 12,
  //             "userName": "직원1",
  //             "employeeNum": 1,
  //             "postPosition": "Sales"
  //         },
  //         {
  //             "employeeIdx": 11,
  //             "userName": "DOF연구소",
  //             "employeeNum": null,
  //             "postPosition": null
  //         }
  //     ]
  // }
  const [projectCount, setProjectCount] = useState(0);
  // for projectId
  const setProjectCountValue = useMemo(
    () => projectInitSuccess && setProjectCount(projectInit?.projectCount || 0),
    [!!projectInitSuccess],
  );
  // Computed
  const caseId = useMemo(() => {
    let returnValue: string = makeCaseIdFn({
      companyName: company,
      caseCount: projectCount,
      // patientCode,
      // caseIdValue: patient.value,
      caseIdValue: informationWatch('projectTitle'),
    })(1);
    // checkSharePatient.value 제거

    let addText = '';
    if (reworkProjectCode.value) {
      Array.from({ length: copyOrder + 1 }).forEach((item: any) => {
        addText = addText + `<span style="color: #33B5E4">_RE</span>`;
      });
    }

    return reworkProjectCode.value ? returnValue + addText : returnValue;
  }, [company, projectCount, informationWatch('projectTitle'), copyOrder, reworkProjectCode.value]);
  // Required Information valid check
  const isValidInformationValue = useMemo(() => {
    let validList = [
      caseId,
      informationWatch('client'),
      informationWatch('projectTitle'),
      informationWatch('dueDate'),
    ];
    if (informationWatch('createType') === 1) validList = [...validList, reworkProjectCode.value];
    const isValid = validList.every(item => !!item);
    return isValid;
    // return false;
  }, [caseId, informationWatch, reworkProjectCode.value]);

  // Required Indication valid check
  const isValidIndicationValue = useMemo(() => {
    const isValid = [!!teeth.value?.length].every(item => item === true);
    return isValid;
    // return false;
  }, [teeth]);

  // SECTION: function

  // fetch projectPartners
  const handleFetchProjectPartners = debounce((first?: boolean) => {
    const { page, totalPage } = projectPartnersPagingData;
    if (page >= totalPage) return;
    PartnerActions.fetch_project_partners_request({
      partnerType: informationWatch('clientType') || null,
      page: page + 1,
    });
  }, 500);

  // tooth click
  const handleToggleTooth = useCallback(
    (toothNumber: number) => {
      let currentTooth = teeth.value.find((item: Tooth) => item.number === toothNumber);
      // console.log('currentTooth', currentTooth);

      if (!!currentTooth) {
        indicationSeq.setValue(currentTooth.preparationType);
        indication.setValue({
          // id: currentTooth.indicationIdx,
          seq: currentTooth.reconstructionType,
          color: currentTooth.color || color.blue,
        });
        material.setValue(currentTooth.material);
        implant.setValue(currentTooth.implantType);
        checkSituScan.setValue(!!currentTooth.situScan);
        checkGingivaScan.setValue(!!currentTooth.separateGingivaScan);
        gapWithCement.setValue(currentTooth.gapWithCement);
        minimalTickness.setValue(currentTooth.minimalTickness);
        millingToolDiameter.setValue(currentTooth.millingToolDiameter);
        virtualGingiva.setValue(currentTooth.virtualGingiva);
        thimbleCrown.setValue(currentTooth.thimbleCrown);
        cervicalAdaption.setValue(currentTooth.cervicalAdaption);
      } else {
        indicationSeq.setValue('');
        indication.setValue({});
        material.setValue(0);
        implant.setValue(0);
        checkSituScan.setValue(false);
        checkGingivaScan.setValue(false);
        virtualGingiva.setValue(0);
        thimbleCrown.setValue(0);
        cervicalAdaption.setValue(0);
      }
    },
    [teeth.value, tooth.value],
  );

  const handleChangeToothValue = useCallback((data: object | any) => {
    // console.log('currentTooth data', data);

    indicationSeq.setValue(data.preparationType);
    indication.setValue({
      // id: data.indicationIdx,
      // seq: data.reconstructionType,
      seq: data.indicationIdx,
      color: data.color,
    });
    material.setValue(data.material);
    implant.setValue(data.implantType);
    checkSituScan.setValue(!!data.situScan);
    checkGingivaScan.setValue(!!data.separateGingivaScan);
    gapWithCement.setValue(data.gapWithCement);
    minimalTickness.setValue(data.minimalTickness);
    millingToolDiameter.setValue(data.millingToolDiameter);
    virtualGingiva.setValue(data.virtualGingiva);
    thimbleCrown.setValue(data.thimbleCrown);
    cervicalAdaption.setValue(data.cervicalAdaption);
  }, []);

  // teeth table click
  const handleClickTooth = (number: number) => {
    const currentTooth = teeth.value.find((item: Tooth) => item.number === number);
    // console.log('currentTooth', currentTooth);

    tooth.setValue((draft: Tooth) => ({ ...draft, number }));
    handleChangeToothValue(currentTooth);
  };

  const handleAgreement = (submitData: any) => {
    AppActions.add_popup({
      isOpen: true,
      timeout: 0,
      isCloseIcon: true,
      title: 'Agreement',
      content: (
        <div style={{ textAlign: 'center' }}>
          <CustomText fontSize={21}>Agreement of Participation</CustomText>
          <CustomText fontSize={15} marginTop={20}>
            I confirmed that the project does not contain any personal information specified in the
            terms and conditions.
          </CustomText>
          <CustomText fontSize={13} fontColor={color.blue} marginTop={10}>
            <span style={{ textDecoration: 'underline' }}>
              <a
                href={window.location.protocol + '//' + window.location.host + '/legal/privacy'}
                target="_blank"
              >
                Privacy Policy
              </a>
            </span>{' '}
            |{' '}
            <span style={{ textDecoration: 'underline' }}>
              <a
                href={window.location.protocol + '//' + window.location.host + '/legal/terms'}
                target="_blank"
              >
                Terms of Service
              </a>
            </span>
          </CustomText>
        </div>
      ),
      onClick: () => {
        // request api
        ProjectActions.edit_project_request(submitData);
      },
    });
  };

  const handleCreateProject = () => {
    console.log('handleCreateProject');
    // 유효성 체크, Infomation, Indication
    const isValid = [isValidInformationValue, isValidIndicationValue].every(item => !!item);
    if (!isValid) return;

    const { createType, projectTitle, client, dueDate, senderMemo, manager } = getInformation();

    // request api
    let submitData: any = {
      userIdx: userId,
      projectId: caseId, // date + company + initCode + initNumber or date + patient + initNumber
      projectName: projectTitle,
      dueDate: moment.isMoment(dueDate) ? dueDate.unix() : null,
      // stage: 0,
      senderMemo: senderMemo,
      participant: {
        client,
        manager,
        userIdx: userId,
      },
      //
      // situScan: checkSituScan.value,
      // separateGingivaScan: checkGingivaScan.value,
      indication: {
        teeth: teeth.value,
        bridge: bridge.value,
        toothShade: toothShade.value,
        notation: numbering.value,
        restorationPonticDesign: restorationPontic.value,
        ceramicMetalDesign: ceramicMetal.value,
        occlusalSurfaceDesign: occlusalSurface.value,
      },
    };

    if (createType === 1) {
      submitData = {
        ...submitData,
        reworkProjectCode: reworkProjectCode.value,
        // teethTreatmentIdx,
      };
    }

    if (!!projectCodeParam) {
      submitData = {
        ...submitData,
        projectCode,
        teethTreatmentIdx,
      };
    }

    console.log(submitData, 'submitData');
    handleAgreement(submitData);
  };

  // TEST:
  // useEffect(() => {
  //   // handleCreateProject();

  //   // console.log('teethData', teethData);

  //   console.log('watch', {
  //     createType: informationWatch('createType'),
  //     projectTitle: informationWatch('projectTitle'),
  //     partner: informationWatch('client'),
  //     dueDate: informationWatch('dueDate'),
  //     senderMemo: informationWatch('senderMemo'),
  //     manager: informationWatch('manager'),
  //   });
  // }, [informationWatch]);
  // useEffect(() => {
  //   console.log('tooth.value', tooth.value);
  // }, [tooth.value]);
  // useEffect(() => {
  //   console.log('bridge.value', bridge.value);
  // }, [bridge.value]);
  // useEffect(() => {
  //   console.log('copyData.value', copyData.value);
  // }, [copyData.value]);
  // -

  // SECTION: DidMount

  // init
  useEffect(() => {
    UtilActions.fetch_teeth_indication_info_request();
    // { language: 'EN' }
    UtilActions.fetch_teeth_indication_format_request();
    ProjectActions.init_project_request({ userCode });
    PartnerActions.fetch_project_partners_request({
      partnerType: informationWatch('clientType'),
      page: 1,
    });

    if (!!projectCodeParam) {
      // TODO: props or Context value 에서 reject 또는 done의 경우 ex. fromStage
      ProjectActions.fetch_project_request(projectCodeParam);
    }

    if (ENV_MODE_PROD) setShowExitPrompt(true);
    return () => {
      setShowExitPrompt(false);
    };
  }, []);

  // SECTION: DidUpdate

  // change createType, intialize data
  useDidUpdateEffect(() => {
    if (informationWatch('createType') === 0) {
      ProjectActions.fetch_rework_project_clear();
      setInformation('client', '0');
      teeth.setValue([]);
    }
  }, [informationWatch('createType')]);

  // change createType and reworkProjectCode
  useDidUpdateEffect(() => {
    if (!!reworkProjectCode.value) {
      ProjectActions.fetch_rework_project_request(reworkProjectCode.value);
    }
  }, [reworkProjectCode.value]);

  // change partnerType
  useDidUpdateEffect(() => {
    setProjectPartners([]);
    PartnerActions.fetch_project_partners_request({
      partnerType: informationWatch('clientType'),
      page: 1,
    });
  }, [informationWatch('clientType')]);

  // when edit, fetch project
  useDidUpdateEffect(() => {
    if (!fetchProjectSuccess && setInformation) return;
    // console.log('setInformation', setInformation);
    // console.log('projectInfo', projectInfo);

    // timeline
    setStage(projectInfo?.stage || 0);
    setTimeline(projectInfo?.timeline || {});
    // information
    // setPatientCode(projectInfo?.patientCode || '');
    setProjectCount(projectInfo?.applyCount || 0);
    // // react-hook-form
    // setInformation('projectTitle', projectInfo?.projectName || 'hihi');
    // setInformation('dueDate', projectInfo?.dueDate ? moment.unix(projectInfo?.dueDate) : null);
    // setInformation('senderMemo', projectInfo?.senderMemo || '');
    // setInformation('manager', projectInfo?.manager || '');

    // checkSharePatient.setValue(projectIndicationData?.patientShareCheck ? true : false);
    // indication
  }, [!!fetchProjectSuccess]);

  // when edit and rework, fetch project
  useDidUpdateEffect(() => {
    if (!(fetchProjectSuccess || reworkProjectSuccess)) return;
    let projectIndicationData = null;
    if (fetchProjectSuccess) projectIndicationData = projectInfo?.indication;
    if (reworkProjectSuccess) projectIndicationData = reworkProjectInfo?.indication;
    console.log('projectIndicationData', projectIndicationData);

    toothShade.setValue(projectIndicationData?.toothShade || '');
    numbering.setValue(projectIndicationData?.notation || 0);
    teeth.setValue(projectIndicationData?.teeth || []);
    // console.log('projectIndicationData?.teeth-', projectIndicationData?.teeth);
    bridge.setValue(projectIndicationData?.bridgeList || []);
    //
    restorationPontic.setValue(projectIndicationData?.restorationPonticDesign);
    occlusalSurface.setValue(projectIndicationData?.occlusalSurfaceDesign);
    ceramicMetal.setValue(projectIndicationData?.ceramicMetalDesign);

    // edit api data
    setTeethTreatmentIdx(projectIndicationData?.teethTreatmentIdx);
    setProjectCode(projectIndicationData?.projectCode);
  }, [!!fetchProjectSuccess, !!reworkProjectSuccess]);

  useDidUpdateEffect(() => {
    if (editProjectSuccess) {
      console.log('editProjectSuccess');
      const projectCodeValue = editProjectData?.projectInformation?.projectCode;

      history.push(`/project/detail/${projectCodeValue}`);
    }
  }, [editProjectSuccess === true]);

  useDidUpdateEffect(() => {
    if (editProjectFailure) {
      if (editProjectError.message === 'NOT_ENOUGH_POINT') {
        AppActions.add_popup({
          isOpen: true,
          timeout: 0,
          title: <T>GLOBAL_ALERT</T>,
          content: <T>MODAL_NOT_ENOUGH_POINT</T>,
          isCloseIcon: true,
          onClick: () => history.push(pageUrl.store.index),
        });
      }
    }
  }, [editProjectFailure]);

  // useDidUpdateEffect(() => {
  //   UtilActions.set_teeth(teeth.value);
  // }, [teeth.value]);

  let fetchList: any = {
    indicationFormatSuccess,
    indicationInfoSuccess,
    projectInitSuccess,
    projectPartnersSuccess,
  };
  if (projectCodeParam) {
    fetchList = {
      ...fetchList,
      fetchProjectSuccess,
    };
  }
  const { isFetchSuccess } = useFetchLoading(fetchList);

  if (!isFetchSuccess) return null;
  return (
    <>
      <CreateProject
        isValidInformationValue={isValidInformationValue}
        isValidIndicationValue={isValidIndicationValue}
        // information
        projectPartners={projectPartners}
        hasMoreProjectPartners={hasMoreProjectPartners}
        employeeList={employeeList}
        caseId={caseId}
        informationControl={informationControl}
        informationErrors={informationErrors}
        setInformation={setInformation}
        informationWatch={informationWatch}
        onFetchProjectPartners={handleFetchProjectPartners}
        // indication
        indicationFormat={indicationFormat}
        indicationInfo={indicationInfo}
        stage={stage}
        timeline={timeline}
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
        onToggleTooth={handleToggleTooth}
        onChangeToothValue={handleChangeToothValue}
        onCreateProject={handleCreateProject}
        onClickTooth={handleClickTooth}
      />
    </>
  );
}

export default React.memo(CreateProjectContainer);
