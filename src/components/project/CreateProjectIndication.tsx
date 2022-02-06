import React, { useMemo, useRef, useState } from 'react';
import styled, { css } from 'styled-components';
import moment from 'moment';
import CustomSpan from 'components/common/text/CustomSpan';
import {
  ButtonGroup,
  Checkbox,
  FormControl,
  FormControlLabel,
  Grid,
  IconButton,
  ListSubheader,
  MenuItem,
  Select,
  Slider,
  TextField,
} from '@material-ui/core';
import useInput from 'lib/hooks/useInput';
import { useTranslation } from 'react-i18next';
import useCheckOneInput from 'lib/hooks/useCheckOneInput';
import useDateInput from 'lib/hooks/useDateInput';
import useImmerInput from 'lib/hooks/useImmerInput';
import { useForm, Controller } from 'react-hook-form';
import MuiWrapper from 'components/common/input/MuiWrapper';
import { useEffect } from 'react';
import MuiButton from 'components/common/button/MuiButton';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { color, scrollWidth } from 'styles/utils';
import { paperBadgeStyle, paperStyle } from './ProjectShared';
import { StyledInShadowButtonOuter } from 'components/common/styled/Button';
import CustomText from 'components/common/text/CustomText';
import cx from 'classnames';
import CustomDatePicker from 'components/common/input/CustomDatePicker';
import TeethContextMenu from 'components/common/teeth/TeethContextMenu';
import TeethSvgV2 from 'components/common/teeth/TeethSvgV2';
import { getMapperTeethNumbering, overlappingArrayElements, withZeroNum } from 'lib/library';
import { T } from 'components/common/text';
import { useDidUpdateEffect } from 'lib/utils';
import { number } from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Tooth } from 'components/project/ProjectShared';
import ClearRoundedIcon from '@material-ui/icons/ClearRounded';
import { AppActions } from 'store/actionCreators';
import HoverButton from 'components/common/button/HoverButton';
import CheckIcon from 'components/base/icons/CheckIcon';
import { icon_has_bridge, icon_trash } from 'components/base/images';
import {
  restorationPonticIconList,
  occlusalSurfaceIconList,
  ceramicMetalIconList,
} from 'lib/teeth/teethDesignMapper';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { materialImgList } from 'lib/teeth/teethMaterialMapper';
import { ENV_MODE_DEV } from 'lib/setting';
import CustomCheckbox from 'components/common/checkbox/CustomCheckbox';
import UnitSlider from 'components/common/slider/UnitSlider';
import TrashIcon from 'components/base/icons/TrashIcon';

interface IndicationInfoToothShade {
  id: string;
  list: {
    seq: number;
    name: string;
  }[];
}
interface ToothShade {
  group?: string;
  seq?: number;
  name?: string;
}
interface Indication {
  seq: number;
  name: string;
  materialList: {
    seq: number;
    name: string;
    implantList: { key: string; seq: number; name: string }[];
  }[];
}
interface IndicationSeq {
  seq: number;
  name: string;
  list: Indication[];
}
interface IndicationGroup {
  idx: number;
  name: string;
}
interface IndicationPart {
  idx: number;
  color: string;
  name: string;
}
interface Material {
  idx: number;
  code: string;
  name: string;
}
interface Implant {
  idx: number;
  type: string;
}

export interface CreateProjectIndicationProps {
  indicationFormat: object | any;
  indicationInfo: object | any;
  stage: number;
  timeline:
    | {
        create: number | null;
        preparation: number | null | undefined;
        scan: number | null | undefined;
        cad: number | null | undefined;
        cam: number | null | undefined;
        milling: number | null | undefined;
        postProcess: number | null | undefined;
        completed: number | null | undefined;
      }
    | {}
    | undefined;
  toothShade: { value: number; onChange: (e: any) => void; setValue: (value: number) => void };
  numbering: { value: number; onChange: (e: any) => void; setValue: (value: number) => void };
  tooth: {
    value: Tooth;
    onChange: (e: any) => void;
    setValue: (value: Tooth) => void;
  };
  teeth: {
    value: object[] | any;
    onChange: (e: any) => void;
    setValue: (value: object[] | any) => void;
  };
  bridge: { value: string[]; onChange: (e: any) => void; setValue: (value: string[]) => void };
  teethContextActions: {
    value: {
      copy: {
        active: boolean;
        hidden: boolean;
      };
      paste: {
        active: boolean;
        hidden: boolean;
      };
      delete: {
        active: boolean;
        hidden: boolean;
      };
    };
    setValue: (f: (draft: any) => any) => void;
  };
  copyData: {
    value: object | null | any;
    onChange: (e: any) => void;
    setValue: (value: object) => void;
  };
  indicationSeq: {
    value: number;
    onChange: (e: any) => void;
    setValue: (value: number) => void;
  };
  indication: {
    value: {
      id: number;
      seq: number;
      color: string;
    };
    onChange: (e: any) => void;
    setValue: (value: object) => void;
  };
  material: { value: number; onChange: (e: any) => void; setValue: (value: number) => void };
  implant: { value: number; onChange: (e: any) => void; setValue: (value: number) => void };
  checkSituScan: {
    value: boolean | number;
    onChange: (e: any) => void;
    setValue: (value: boolean | number) => void;
  };
  checkGingivaScan: {
    value: boolean | number;
    onChange: (e: any) => void;
    setValue: (value: boolean | number) => void;
  };
  virtualGingiva: {
    value: number;
    onChange: (e: any) => void;
    setValue: (value: number) => void;
  };
  thimbleCrown: {
    value: number;
    onChange: (e: any) => void;
    setValue: (value: number) => void;
  };
  cervicalAdaption: {
    value: number;
    onChange: (e: any) => void;
    setValue: (value: number) => void;
  };
  gapWithCement: {
    value: number | number[] | string | any; // input value 입력시 string
    onChange: (e: any) => void;
    setValue: (value: number | number[] | string | any) => void;
  };
  minimalTickness: {
    value: number | number[] | string | any; // input value 입력시 string
    onChange: (e: any) => void;
    setValue: (value: number | number[] | string | any) => void;
  };
  millingToolDiameter: {
    value: number | number[] | string | any; // input value 입력시 string
    onChange: (e: any) => void;
    setValue: (value: number | number[] | string | any) => void;
  };
  restorationPontic: {
    value: number;
    onChange: (e: any) => void;
    setValue: (value: number) => void;
  };
  occlusalSurface: {
    value: number;
    onChange: (e: any) => void;
    setValue: (value: number) => void;
  };
  ceramicMetal: {
    value: number;
    onChange: (e: any) => void;
    setValue: (value: number) => void;
  };
  //
  onToggleTooth: (value: number) => void;
  onChangeToothValue: (value: object | any) => void;
  onClickTooth: (value: number) => void;
  onCreateProject: () => void;
  isValidInformationValue: boolean;
  isValidIndicationValue: boolean;
}

const CreateProjectIndication = ({
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
  isValidInformationValue,
  isValidIndicationValue,
  onToggleTooth,
  onChangeToothValue,
  onCreateProject,
  onClickTooth,
}: CreateProjectIndicationProps) => {
  // console.log('-------------------------- render CreateProjectIndication');
  // console.log('indicationFormat', indicationFormat);
  // console.log('indicationInfo', indicationInfo);
  // TODO: 실제 초기값 false
  const [isUnfoldCard, setIsUnfoldCard] = useState(true);
  const history = useHistory();
  const teethListTableRef = useRef<null | any>(null);
  const isScrollTeethList = teeth.value?.length >= 6;
  const GROUP = 'group';
  const MATERIAL = 'material';
  const IMPLANT = 'implant';
  const [indicationModalOpenType, setIndicationModalOpenType] = useState(''); // 'group', 'material', 'implant'
  const isIndicationModalOpenType = indicationModalOpenType === GROUP;
  const isMaterialModalOpenType = indicationModalOpenType === MATERIAL;
  const isImplantModalOpenType = indicationModalOpenType === IMPLANT;

  // state
  // parsing for Mui Fragment issue
  const toothShadeList = useMemo(
    () =>
      [...indicationInfo?.toothShadeList].reduce(
        (acc: ToothShade[], curr: IndicationInfoToothShade) => {
          let currArr = [{ group: curr.id }, ...curr.list];
          return acc.concat(currArr);
        },
        [],
      ),
    [indicationInfo?.toothShadeList],
  );
  // console.log(toothShadeList, 'toothShadeList');
  // // indicationSeq 연결
  // const indicationSeqList: IndicationSeq[] = indicationFormat?.indication;
  // // indication 연결 { id - material 연결 , seq - indicationSeq 연결, }
  // const indicationList =
  //   indicationSeqList.find((item: IndicationSeq) => item.seq === indicationSeq.value)?.list || [];

  // const materialList: Material[] = indicationInfo?.materialList;
  // // indication id 가 가지고 materialIdx list 값
  // const materialIdxList =
  //   indicationList.find((item: Indication) => item.id === indication.value.id)?.materialList || [];

  // // materialIdx list 를 통해 material list 객체 배열 생성
  // const matchingMaterialList = useMemo(
  //   () =>
  //     materialList.reduce((acc: Material[], curr: Material) => {
  //       if (materialIdxList.includes(curr.idx)) return acc.concat(curr);
  //       return acc;
  //     }, []),
  //   [materialIdxList, materialIdxList],
  // );
  // const implantList: Implant[] = indicationInfo?.implantList;

  // indicationSeq(group단위), indicationFormat
  const indicationSeqList: IndicationSeq[] = indicationFormat?.indication;
  // indication(part단위)
  const matchingIndicationPartList =
    indicationSeqList.find((item: IndicationSeq) => item.seq === indicationSeq.value)?.list || [];
  const matchingMaterialList =
    matchingIndicationPartList.find(item => item.seq === indication.value.seq)?.materialList || [];
  const matchingImplantList =
    matchingMaterialList.find(item => item.seq === material.value)?.implantList || [];
  const {
    groupList: indicationGroupList = [],
    partList: indicationPartList = [],
    materialList = [],
    implantList = [],
  } = indicationInfo as {
    groupList: IndicationGroup[];
    partList: IndicationPart[];
    materialList: Material[];
    implantList: Implant[];
  };

  console.log('indicationSeqList', indicationSeqList);
  console.log('matchingIndicationPartList', matchingIndicationPartList);
  console.log('matchingMaterialList', matchingMaterialList);
  console.log('matchingImplantList', matchingImplantList);
  console.log('indicationGroupList', indicationGroupList);
  console.log('indicationPartList', indicationPartList);
  console.log('materialList', materialList);
  console.log('implantList', implantList);
  console.log('indicationSeq.value', indicationSeq.value);
  console.log('indication.value.seq', indication.value.seq);
  console.log('material.value', material.value);
  console.log('implant.value', implant.value);

  // teeth number와 NOTATION_CONFIG 타입 numbering 매칭, teeth 가운데 보여주기
  const copyNumber = getMapperTeethNumbering(copyData.value?.number, numbering.value);
  const toothNumber = getMapperTeethNumbering(tooth.value?.number, numbering.value);

  // SECTION: DidUpdate
  // isValidInformationValue and isUnfold equalize
  useEffect(() => {
    if (isValidInformationValue) return setIsUnfoldCard(true);
  }, [isValidInformationValue]);

  // TEST:
  useEffect(() => {
    console.log('teeth.value', teeth.value);
  }, [teeth.value]);
  useEffect(() => {
    console.log('indication.value', indication.value);
  }, [indication.value]);

  // SECTION: function

  const handleApply = () => {
    if (!tooth.value.number) return;

    let applyToothData = {
      number: tooth.value.number,
      preparationType: indicationSeq.value, // indication Seq
      indicationIdx: indication.value.seq, // indication Id, materialList 대분류, 기존 id -> seq로 변경
      reconstructionType: indication.value.seq, // 색상 요소, materialList 소분류
      color: indication.value.color || color.blue,
      material: +material.value,
      implantType: implant.value,
      situScan: checkSituScan.value,
      separateGingivaScan: checkGingivaScan.value,
      gapWithCement: parseFloat(gapWithCement.value),
      minimalTickness: parseFloat(minimalTickness.value),
      millingToolDiameter: parseFloat(millingToolDiameter.value),
      virtualGingiva: virtualGingiva.value,
      thimbleCrown: thimbleCrown.value,
      cervicalAdaption: cervicalAdaption.value,
    };
    // apply 시점 발생 이벤트
    // copyData, tooth.hasData = true, TeethContextMenu paste active, set teeth
    teeth.setValue((draft: any) =>
      overlappingArrayElements({ list: draft, value: applyToothData, condition: 'number' }),
    );
    tooth.setValue({ ...applyToothData, hasData: true });
    // copyData.setValue({ ...applyToothData, hasData: true });
    // initial
    // gapWithCement.setValue(0.08);
    // minimalTickness.setValue(0.6);
    // millingToolDiameter.setValue(1.2);
  };

  const handleDeleteTooth = (e: any, number: number) => {
    e.stopPropagation();
    tooth.setValue({});
    // tooth.setValue({ number: null, hasData: false });
    if (copyData.value?.number === number) copyData.setValue({});
    teeth.setValue((draft: Tooth[]) => draft.filter(i => i.number !== number));
    // teethContextActions.setValue(draft => {
    //   draft.copy.active = false;
    //   draft.delete.active = false;
    // });
  };

  const handleClearAll = () => {
    AppActions.add_popup({
      isOpen: true,
      isCloseIcon: true,
      width: 660,
      // title: <T>MODAL_ALL_CLEAR_PROJECT_TITLE</T>,
      content: <T>MODAL_ALL_CLEAR_PROJECT_CONTENT</T>,
      title: <div>Title</div>,
      // content: <Content />,
      // content: <div>Content</div>,
      onClick() {
        teethContextActions.setValue(draft => {
          draft.copy.active = false;
          draft.paste.active = false;
          draft.delete.active = false;
        });
        tooth.setValue({});
        // tooth.setValue({ number: null, hasData: false });
        copyData.setValue({});
        teeth.setValue([]);
      },
    });
  };

  const handleToggleIndicationModal = (type: string) => {
    // type : 'group', 'material', 'implant'
    if (indicationModalOpenType === type) {
      return setIndicationModalOpenType('');
    }
    setIndicationModalOpenType(type);
  };

  // blur시 모달창 닫기
  const handleBlurModal = (e: any) => {
    const currentTarget = e.currentTarget;
    setTimeout(() => {
      if (!currentTarget.contains(document.activeElement)) {
        setIndicationModalOpenType('');
      }
    }, 0);
  };

  const handleChooseIndicationPart = (data = {}) => {
    const { groupSeq, partSeq } = data as { groupSeq: number; partSeq: number };
    console.log('handleChooseIndicationPart', data);
    indicationSeq.setValue(groupSeq);

    const currentPartList = indicationSeqList.find(item => item.seq === groupSeq)?.list || [];
    const currentPart = currentPartList.find(item => item.seq === partSeq);
    const currentPartColor = indicationPartList.find(
      (item: IndicationPart) => item.idx === currentPart?.seq,
    )?.color;
    indication.setValue({
      seq: partSeq,
      color: currentPartColor,
    });

    if (indication.value.seq !== partSeq && currentPart) {
      material.setValue(currentPart.materialList[0].seq);
      implant.setValue(currentPart.materialList[0].implantList[0].seq);
    }

    // close modal and open materialModal
    setIndicationModalOpenType(MATERIAL);
  };

  const handleChooseMaterial = (seq: number) => {
    if (material.value !== seq) {
      const currentPartList = matchingIndicationPartList.find(i => i.seq === indication.value.seq);
      const initialImplant = currentPartList?.materialList?.find(i => i.seq === seq)
        ?.implantList[0];
      implant.setValue(initialImplant?.seq || 0);
    }
    material.setValue(seq);
    setIndicationModalOpenType('');
  };

  const handleChooseImplant = (seq: number) => {
    implant.setValue(seq);
    setIndicationModalOpenType('');
  };

  // SECTION: DidUpdate

  // teeth click에 따른 teeth list table scroll 높이 조절
  useDidUpdateEffect(() => {
    // console.log('tooth.value', tooth.value);
    // console.log(
    //   '!!teeth.value?.find(item => item.number === tooth.value)',
    //   !!teeth.value?.find(item => item.number === tooth.value?.number),
    // );
    if (
      !!teeth.value?.find((item: Tooth) => item.number === tooth.value?.number) &&
      isScrollTeethList
    ) {
      const activeNumber = 7; //6
      const boxHeight = 287;
      const rowHeight = 46;
      const currentTeethRow = teethListTableRef.current.querySelector(
        '.projectIndication__teeth_table_row.on',
      );
      const currentTeethRowIndex = currentTeethRow?.dataset?.index;
      const teethRowPositionTop = !!currentTeethRowIndex
        ? rowHeight * (currentTeethRowIndex - 1)
        : 0;
      // console.log('teethRowPositionTop', teethRowPositionTop);
      // console.log('currentTeethRow', currentTeethRow);
      const teethListTableScrollTop = teethListTableRef.current.scrollTop;
      const teethListTableScrollHeight = teethListTableRef.current.scrollHeight;
      // const sideHalfHeight = (teethListTableScrollHeight - boxHeight) / 2;
      // console.log('sideHalfHeight', sideHalfHeight);
      // 경계점 sideHalfHeight, boxHeight + sideHalfHeight
      const scrollIndex = currentTeethRowIndex % activeNumber;
      // index 1(2번쨰) 이상 클릭부터 높이 row 1개를 보이개
      if (currentTeethRowIndex == 0) {
        teethListTableRef.current.scrollTop = 0;
      }
      if (currentTeethRowIndex >= 1) {
        if (teethListTableScrollHeight - boxHeight < teethRowPositionTop) {
          teethListTableRef.current.scrollTop = teethListTableScrollHeight;
          return;
        }
        teethListTableRef.current.scrollTop = teethRowPositionTop;
      }
    }
  }, [tooth.value, teeth.value, teethListTableRef.current]);

  // onChange indication.value.seq
  useDidUpdateEffect(() => {
    if (!!indication.value.seq) {
      handleApply();
    }
  }, [
    indication.value.seq,
    material.value,
    implant.value,
    checkSituScan.value,
    checkGingivaScan.value,
    gapWithCement.value,
    minimalTickness.value,
    millingToolDiameter.value,
    virtualGingiva.value,
    thimbleCrown.value,
    cervicalAdaption.value,
  ]);

  // tooth number 변경 시 preparationType(indicationSeq) 유무에 따라 indication Modal 등장
  useDidUpdateEffect(() => {
    if (tooth.value.number) {
      const currentTooth = teeth.value?.find((item: Tooth) => item.number === tooth.value.number);
      console.log('currentTooth?.preparationType', currentTooth?.preparationType);
      if (!currentTooth?.preparationType) {
        setIndicationModalOpenType(GROUP);
      } else {
        setIndicationModalOpenType('');
      }
    }
  }, [tooth.value.number]);

  return (
    <StyledCreateProjectIndication
      data-component-name="CreateProjectIndication"
      isUnfoldCard={isUnfoldCard}
      isValidInformationValue={isValidInformationValue}
      isValidIndicationValue={isValidIndicationValue}
    >
      <Grid container className="projectIndication__container">
        <Grid item xs={12} className="projectIndication__title_box">
          <button
            className="btn-reset projectIndication__title_btn"
            onClick={() => setIsUnfoldCard(draft => !draft)}
          >
            <span className="projectIndication__title_badge">2</span>
            <h1 className="projectIndication__title">Enter Details</h1>
          </button>
        </Grid>

        <Grid item xs={12} className="projectIndication__content_box">
          <Grid container alignItems="flex-start" className="projectIndication__content">
            {/* teeth */}
            <Grid item className="projectIndication__content_item teeth">
              <Grid container alignItems="center" className="projectIndication__teeth_item">
                <ButtonGroup className="projectIndication__numbering_tab_box">
                  <MuiButton
                    className={cx('projectIndication__numbering_tab sm', {
                      active: numbering.value === 0,
                    })}
                    data-type="radio"
                    onClick={() => numbering.setValue(0)}
                  >
                    FDI
                  </MuiButton>
                  <MuiButton
                    className={cx('projectIndication__numbering_tab sm', {
                      active: numbering.value === 1,
                    })}
                    data-type="radio"
                    onClick={() => numbering.setValue(1)}
                  >
                    UNS
                  </MuiButton>
                </ButtonGroup>
                <MuiWrapper className="projectIndication__tooth_shade_box sm" isGlobalStyle>
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
                      displayEmpty
                      name="toothShade"
                      value={toothShade.value}
                      onChange={toothShade.onChange}
                    >
                      <MenuItem disabled value="">
                        <T>PROJECT_SHADE_OPTION</T>
                      </MenuItem>
                      {toothShadeList?.length > 0 &&
                        toothShadeList.map((item: ToothShade, index: number) => {
                          if (item.group) {
                            return <ListSubheader key={index}>{item.group}</ListSubheader>;
                          }
                          if (!item.group) {
                            return (
                              <MenuItem key={index} value={item.seq}>
                                {item.name}
                              </MenuItem>
                            );
                          }
                        })}
                      {/* <MenuItem value="" disabled>
                        Shade Option
                      </MenuItem>
                      <MenuItem value="1">1</MenuItem>
                      <MenuItem value="2">2</MenuItem> */}
                    </Select>
                  </FormControl>
                </MuiWrapper>
              </Grid>

              <Grid container alignItems="center" className="projectIndication__teeth_item">
                {useMemo(
                  () => (
                    <div className="projectIndication__teeth_box">
                      <TeethContextMenu
                        component={
                          <TeethSvgV2
                            isEdit={true}
                            numbering={numbering}
                            teeth={teeth}
                            tooth={tooth}
                            bridge={bridge}
                            copyData={copyData}
                            teethContextActions={teethContextActions}
                            onToggleTooth={onToggleTooth}
                            onChangeToothValue={onChangeToothValue}
                          />
                        }
                        numbering={numbering}
                        teeth={teeth}
                        tooth={tooth}
                        copyData={copyData}
                        teethContextActions={teethContextActions}
                        onChangeToothValue={onChangeToothValue}
                      />

                      <div
                        className="projectIndication__selected_number_box"
                        style={{
                          backgroundColor: tooth.value?.color,
                          color: tooth.value?.color ? '#fff' : color.black_font,
                          borderColor: tooth.value?.color
                            ? 'transparent'
                            : tooth.value?.number
                            ? 'gray'
                            : 'transparent',
                        }}
                      >
                        {copyData.value?.number && (
                          <p className="projectIndication__copied_number">Copy No. {copyNumber}</p>
                        )}
                        {tooth.value?.number && (
                          <div className="projectIndication__selected_number_in_box">
                            <p className="projectIndication__selected_number_text">
                              <T>PROJECT_TOOTH_NUMBER</T>
                            </p>
                            <p className="projectIndication__selected_number">{toothNumber}</p>
                          </div>
                        )}
                      </div>
                    </div>
                  ),
                  [numbering, teeth, tooth, copyData, teethContextActions],
                )}
              </Grid>
            </Grid>

            {/* indication */}
            <Grid item className="projectIndication__content_item indication">
              <Grid container alignItems="center" className="projectIndication__grid_item">
                <div className="projectIndication__tooth_number">
                  {useMemo(
                    () => (
                      <CustomSpan fontSize={19} fontWeight={500}>
                        {tooth.value?.number ? (
                          `Tooth ${withZeroNum(toothNumber)}`
                        ) : (
                          <T>PROJECT_SELECTED_TOOTH</T>
                        )}
                      </CustomSpan>
                    ),
                    [tooth.value?.number],
                  )}
                </div>
              </Grid>

              <Grid container alignItems="center" className="projectIndication__grid_item">
                <Grid item className="projectIndication__form_item_label">
                  <label htmlFor="" className="form__label">
                    <T>PROJECT_INDICATORS</T>
                  </label>
                </Grid>
                <Grid item className="projectIndication__form_item_content">
                  {useMemo(
                    () => (
                      <>
                        {tooth.value?.number ? (
                          <div
                            className="projectIndication__choose_indication_box"
                            tabIndex={1}
                            data-modal-type={GROUP}
                            onBlur={handleBlurModal}
                          >
                            {!!indicationSeq.value ? (
                              <button
                                className="btn-reset projectIndication__indication_name"
                                onClick={() => handleToggleIndicationModal(GROUP)}
                              >
                                {/* {indicationPartList.find(i => i.idx === indication.value.seq)?.name} */}
                                {
                                  matchingIndicationPartList.find(
                                    i => i.seq === indication.value.seq,
                                  )?.name
                                }
                              </button>
                            ) : (
                              <MuiButton
                                disableElevation
                                variant="contained"
                                className="btn-reset projectIndication__choose_indication_btn"
                                onClick={() => handleToggleIndicationModal(GROUP)}
                              >
                                {!isIndicationModalOpenType ? (
                                  <AddIcon htmlColor="inherit" />
                                ) : (
                                  <RemoveIcon htmlColor="inherit" />
                                )}
                                Choose Indication
                              </MuiButton>
                            )}
                            {isIndicationModalOpenType && (
                              <div className="projectIndication__choose_indication_modal_container indication">
                                <div className="projectIndication__choose_indication_modal indication chooseIndicationModal">
                                  <div className="chooseIndicationModal__body">
                                    {!!indicationSeqList?.length &&
                                      indicationSeqList.map((groupItem, groupIdx) => {
                                        return (
                                          <div
                                            key={groupItem.seq}
                                            className="chooseIndicationModal__group"
                                          >
                                            <div className="chooseIndicationModal__group_name_box">
                                              <span
                                                className="chooseIndicationModal__group_mark"
                                                dangerouslySetInnerHTML={{
                                                  __html: `&#${97 + groupIdx};)`,
                                                }}
                                              ></span>
                                              {groupItem.name}
                                            </div>
                                            <ul className="chooseIndicationModal__part_list">
                                              {groupItem.list.map((partItem, partIdx) => {
                                                const exceptPartList = [17, 18];
                                                const selectDisabled = exceptPartList.includes(
                                                  partItem.seq,
                                                );
                                                // if (exceptPartList.includes(partItem.seq)) return;
                                                const isEqualPart =
                                                  indication.value.seq === partItem.seq;
                                                const currentPartItemColor =
                                                  indicationPartList.find(
                                                    indicationPart =>
                                                      indicationPart.idx === partItem.seq,
                                                  )?.color || color.blue;

                                                // console.log('currentPartItemColor', currentPartItemColor);
                                                const versionMarkList = [6, 21];
                                                const partListLastIdx = groupItem.list.length;
                                                const divideLastIdx = partListLastIdx % 3;
                                                const noBorderBottomIdxList = Array.from({
                                                  length: 3,
                                                }).map((_, idx) => partListLastIdx - idx);
                                                const currentIdx = partIdx + 1;
                                                let isNoBorderBottom = null;
                                                if (
                                                  divideLastIdx === 0 &&
                                                  noBorderBottomIdxList.includes(currentIdx)
                                                ) {
                                                  isNoBorderBottom = true;
                                                } else if (
                                                  noBorderBottomIdxList
                                                    .slice(0, divideLastIdx)
                                                    .includes(currentIdx)
                                                ) {
                                                  isNoBorderBottom = true;
                                                }
                                                return (
                                                  <li
                                                    key={partItem.seq}
                                                    className={cx(
                                                      'chooseIndicationModal__part_item',
                                                      {
                                                        'no-border-bottom': isNoBorderBottom,
                                                        disabled: selectDisabled,
                                                      },
                                                    )}
                                                  >
                                                    <button
                                                      disabled={selectDisabled}
                                                      className={cx(
                                                        'chooseIndicationModal__part_item_btn btn-reset',
                                                        { on: isEqualPart },
                                                      )}
                                                      style={{
                                                        backgroundColor: isEqualPart
                                                          ? currentPartItemColor
                                                          : '',
                                                      }}
                                                      // onMouseEnter={() => setPartHovering(true)}
                                                      // onMouseEnter={() => setPartHovering(false)}
                                                      onMouseEnter={e =>
                                                        ((
                                                          e.target as HTMLButtonElement
                                                        ).style.backgroundColor = currentPartItemColor)
                                                      }
                                                      onMouseLeave={e => {
                                                        !isEqualPart &&
                                                          ((
                                                            e.target as HTMLButtonElement
                                                          ).style.backgroundColor = 'white');
                                                      }}
                                                      onClick={() =>
                                                        handleChooseIndicationPart({
                                                          groupSeq: groupItem.seq,
                                                          partSeq: partItem.seq,
                                                        })
                                                      }
                                                    >
                                                      <span className="chooseIndicationModal__part_item_check_icon">
                                                        <CheckIcon width={9} />
                                                      </span>{' '}
                                                      {partItem.name}
                                                      {versionMarkList.includes(partItem.seq) && (
                                                        <div className="chooseIndicationModal__part_item_version_mark">
                                                          Galway or later
                                                        </div>
                                                      )}
                                                    </button>
                                                  </li>
                                                );
                                              })}
                                            </ul>
                                          </div>
                                        );
                                      })}
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <CustomSpan fontSize={15} fontColor={color.gray_b5}>
                            <T>PROJECT_TOOTH_PLACEHOLDER</T>
                          </CustomSpan>
                        )}
                      </>
                    ),
                    [
                      indicationSeq.value,
                      tooth.value,
                      indication.value.seq,
                      indicationPartList,
                      matchingIndicationPartList,
                      indicationModalOpenType,
                    ],
                  )}
                </Grid>
              </Grid>

              <Grid container alignItems="center" className="projectIndication__grid_item">
                <Grid item className="projectIndication__form_item_label">
                  <label htmlFor="" className="form__label">
                    <T>PROJECT_MATERIAL</T>
                  </label>
                </Grid>
                <Grid item className="projectIndication__form_item_content">
                  {useMemo(
                    () => (
                      <>
                        {tooth.value?.number ? (
                          <div
                            className="projectIndication__choose_indication_box"
                            tabIndex={1}
                            data-modal-type={MATERIAL}
                            onBlur={handleBlurModal}
                          >
                            {!!material.value ? (
                              <button
                                className="btn-reset projectIndication__indication_name"
                                onClick={() => handleToggleIndicationModal(MATERIAL)}
                              >
                                {matchingMaterialList.find(i => i.seq === material.value)?.name}
                              </button>
                            ) : (
                              <MuiButton
                                disableElevation
                                variant="contained"
                                className="btn-reset projectIndication__choose_indication_btn"
                                disabled={!indication.value?.seq}
                                onClick={() => handleToggleIndicationModal(MATERIAL)}
                              >
                                {!isMaterialModalOpenType ? (
                                  <AddIcon htmlColor="inherit" />
                                ) : (
                                  <RemoveIcon htmlColor="inherit" />
                                )}
                                Choose Material
                              </MuiButton>
                            )}
                            {isMaterialModalOpenType && (
                              <div className="projectIndication__choose_indication_modal_container material">
                                <div className="projectIndication__choose_indication_modal material chooseMaterialModal">
                                  <div className="chooseMaterialModal__body">
                                    <ul className="chooseMaterialModal__part_list">
                                      {!!matchingMaterialList?.length &&
                                        matchingMaterialList.map((partItem, partIdx) => {
                                          const isEqualMaterial = material.value === partItem.seq;
                                          const materialImg = materialImgList.find(
                                            i => i.id === partItem.seq,
                                          );

                                          const partListLastIdx = matchingMaterialList.length;
                                          const divideLastIdx = partListLastIdx % 2;
                                          const noBorderBottomIdxList = Array.from({
                                            length: 2,
                                          }).map((_, idx) => partListLastIdx - idx);
                                          const currentIdx = partIdx + 1;
                                          let isNoBorderBottom = null;
                                          if (
                                            divideLastIdx === 0 &&
                                            noBorderBottomIdxList.includes(currentIdx)
                                          ) {
                                            isNoBorderBottom = true;
                                          } else if (
                                            noBorderBottomIdxList
                                              .slice(0, divideLastIdx)
                                              .includes(currentIdx)
                                          ) {
                                            isNoBorderBottom = true;
                                          }
                                          return (
                                            <li
                                              key={partItem.seq}
                                              className={cx('chooseMaterialModal__part_item', {
                                                'no-border-bottom': isNoBorderBottom,
                                              })}
                                            >
                                              <button
                                                className={cx(
                                                  'chooseMaterialModal__part_item_btn btn-reset',
                                                  { on: isEqualMaterial },
                                                )}
                                                onClick={() => {
                                                  handleChooseMaterial(partItem.seq);
                                                }}
                                              >
                                                <span className="chooseMaterialModal__part_item_check_icon">
                                                  <CheckIcon width={9} />
                                                </span>{' '}
                                                <CustomSpan width={50} marginRight={10}>
                                                  {materialImg?.src && (
                                                    <img src={materialImg.src} alt="material" />
                                                  )}
                                                </CustomSpan>
                                                {partItem.name}
                                              </button>
                                            </li>
                                          );
                                        })}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <CustomSpan fontSize={15} fontColor={color.gray_b5}>
                            <T>PROJECT_INDICATOR_PLACEHOLDER</T>
                          </CustomSpan>
                        )}
                      </>
                    ),
                    [
                      tooth.value.number,
                      indication.value.seq,
                      material.value,
                      matchingMaterialList,
                      indicationModalOpenType,
                    ],
                  )}
                </Grid>
              </Grid>

              <Grid container alignItems="center" className="projectIndication__grid_item">
                <Grid item className="projectIndication__form_item_label">
                  <label htmlFor="" className="form__label ">
                    <T>PROJECT_SCAN_ABUTMENT</T>
                  </label>
                </Grid>
                <Grid item className="projectIndication__form_item_content">
                  {useMemo(
                    () => (
                      <>
                        {tooth.value?.number ? (
                          <div
                            className="projectIndication__choose_indication_box"
                            tabIndex={1}
                            data-modal-type={IMPLANT}
                            onBlur={handleBlurModal}
                          >
                            {!!implant.value ? (
                              <button
                                className="btn-reset projectIndication__indication_name"
                                onClick={() => handleToggleIndicationModal(IMPLANT)}
                              >
                                {matchingImplantList.find(i => i.seq === implant.value)?.name}
                              </button>
                            ) : (
                              <MuiButton
                                disableElevation
                                variant="contained"
                                className="btn-reset projectIndication__choose_indication_btn"
                                disabled={!indication.value?.seq}
                                onClick={() => handleToggleIndicationModal(IMPLANT)}
                              >
                                {!isImplantModalOpenType ? (
                                  <AddIcon htmlColor="inherit" />
                                ) : (
                                  <RemoveIcon htmlColor="inherit" />
                                )}
                                Choose Implant
                              </MuiButton>
                            )}
                            {isImplantModalOpenType && (
                              <div className="projectIndication__choose_indication_modal_container implant">
                                <div className="projectIndication__choose_indication_modal implant chooseImplantModal">
                                  <div className="chooseImplantModal__body">
                                    <ul className="chooseImplantModal__part_list">
                                      {!!matchingImplantList?.length &&
                                        matchingImplantList.map((partItem, partIdx) => {
                                          const isEqualImplant = implant.value === partItem.seq;
                                          return (
                                            <li
                                              key={partItem.seq}
                                              className={cx(
                                                'chooseImplantModal__part_item cursor-pointer',
                                                {
                                                  on: isEqualImplant,
                                                },
                                              )}
                                              onClick={() => handleChooseImplant(partItem.seq)}
                                            >
                                              <button className="btn-reset">{partItem.name}</button>
                                            </li>
                                          );
                                        })}
                                    </ul>
                                  </div>
                                </div>
                              </div>
                            )}
                          </div>
                        ) : (
                          <CustomSpan fontSize={15} fontColor={color.gray_b5}>
                            <T>PROJECT_INDICATOR_PLACEHOLDER</T>
                          </CustomSpan>
                        )}
                      </>
                    ),
                    [
                      tooth.value.number,
                      indication.value.seq,
                      implant.value,
                      matchingImplantList,
                      indicationModalOpenType,
                    ],
                  )}
                </Grid>
              </Grid>

              <Grid container className="projectIndication__grid_item">
                <Grid item className="projectIndication__form_item_label">
                  <label htmlFor="" className="form__label flex-start-children">
                    <T>GLOBAL_OPTION</T>
                  </label>
                </Grid>
                <Grid item className="projectIndication__form_item_content">
                  <div className="form__option_checkbox_box">
                    <label className="form__option_checkbox_label cursor-pointer">
                      <CustomCheckbox
                        checked={!!checkSituScan.value}
                        marginRight={10}
                        onChange={checkSituScan.onChange}
                      />
                      <span>
                        <T>PROJECT_OPTION_SCAN_PRE_OP</T>
                      </span>
                    </label>
                  </div>
                  <div className="form__option_checkbox_box">
                    <label className="form__option_checkbox_label cursor-pointer">
                      <CustomCheckbox
                        checked={!!checkGingivaScan.value}
                        marginRight={10}
                        onChange={checkGingivaScan.onChange}
                      />
                      <span>
                        <T>PROJECT_OPTION_SCAN_GINGIVA</T>
                      </span>
                    </label>
                  </div>

                  <div className="form__text_check_box">
                    <div className="form__text_check_label_box">
                      <label htmlFor="" className="form__label">
                        - Design virtual gingiva?
                      </label>
                    </div>
                    <div className="form__text_check_btn_box">
                      <TextCheckButton
                        className="form__text_check_btn"
                        active={virtualGingiva.value === 0}
                        width="33%"
                        onClick={() => virtualGingiva.setValue(0)}
                      >
                        No <CustomSpan fontSize={11}>(expert mode only)</CustomSpan>
                      </TextCheckButton>
                      <TextCheckButton
                        className="form__text_check_btn"
                        active={virtualGingiva.value === 1}
                        width="33%"
                        onClick={() => virtualGingiva.setValue(1)}
                      >
                        Yes
                      </TextCheckButton>
                      <TextCheckButton
                        className="form__text_check_btn"
                        active={virtualGingiva.value === 2}
                        width="33%"
                        onClick={() => virtualGingiva.setValue(2)}
                      >
                        Optional
                      </TextCheckButton>
                    </div>
                  </div>
                  <div className="form__text_check_box">
                    <div className="form__text_check_label_box">
                      <label htmlFor="" className="form__label">
                        - Design with thimble crown workflow?
                      </label>
                    </div>
                    <div className="form__text_check_btn_box">
                      <TextCheckButton
                        className="form__text_check_btn"
                        active={thimbleCrown.value === 0}
                        width="33%"
                        onClick={() => thimbleCrown.setValue(0)}
                      >
                        No <CustomSpan fontSize={11}>(expert mode only)</CustomSpan>
                      </TextCheckButton>
                      <TextCheckButton
                        className="form__text_check_btn"
                        active={thimbleCrown.value === 1}
                        width="33%"
                        onClick={() => thimbleCrown.setValue(1)}
                      >
                        Yes
                      </TextCheckButton>
                    </div>
                  </div>
                  <div className="form__text_check_box">
                    <div className="form__text_check_label_box">
                      <label htmlFor="" className="form__label">
                        - Cervical adaption?
                      </label>
                    </div>
                    <div className="form__text_check_btn_box">
                      <TextCheckButton
                        className="form__text_check_btn"
                        active={cervicalAdaption.value === 0}
                        width="50%"
                        onClick={() => cervicalAdaption.setValue(0)}
                      >
                        Pull to margin
                      </TextCheckButton>
                      <TextCheckButton
                        className="form__text_check_btn"
                        active={cervicalAdaption.value === 1}
                        width="50%"
                        onClick={() => cervicalAdaption.setValue(1)}
                      >
                        Preserve tooth library shape
                      </TextCheckButton>
                    </div>
                  </div>

                  <div className="form__option_slider_box">
                    <p className="form__option_slider_label">
                      <T>PROJECT_OPTION_GAP_WIDTH</T> <T>PROJECT_OPTION_GAP_WIDTH_RANGE</T>
                    </p>
                    <UnitSlider
                      ariaLabelledby="gapWithCement-slider"
                      data={gapWithCement}
                      min={0}
                      max={0.2}
                      step={0.001}
                      digit={6}
                    />
                  </div>
                  <div className="form__option_slider_box">
                    <p className="form__option_slider_label">
                      <T>PROJECT_OPTION_THICKNESS</T> <T>PROJECT_OPTION_THICKNESS_RANGE</T>
                    </p>
                    {
                      <UnitSlider
                        ariaLabelledby="minimalTickness-slider"
                        data={minimalTickness}
                        min={0.4}
                        max={1}
                      />
                    }
                  </div>
                  <div className="form__option_slider_box">
                    <p className="form__option_slider_label">
                      <T>PROJECT_OPTION_DIAMETER</T> <T>PROJECT_OPTION_DIAMETER_RANGE</T>
                    </p>
                    <UnitSlider
                      ariaLabelledby="millingToolDiameter-slider"
                      data={millingToolDiameter}
                      min={0}
                      max={1.5}
                    />
                  </div>
                </Grid>
              </Grid>

              {/* design */}
              <Grid
                item
                container
                className="projectIndication__grid_item projectIndication__tooth_design_container"
              >
                <Grid item className="tooth_design_box pontic">
                  <div className="tooth_design_classify pontic">
                    <div className="design_title_box">
                      <div className="design_title">
                        <p>
                          <T>PROJECT_OPTION_RESTORATION_PONTIC</T>
                        </p>
                        <CustomSpan fontColor={'#9F9F9F'}>
                          <T>PROJECT_OPTION_DESIGN_SELECT</T>
                        </CustomSpan>
                      </div>
                    </div>
                    <div className="design_icon_box">
                      {restorationPonticIconList.map((item, index) => {
                        const checked = item.id === Number(restorationPontic.value);
                        // const checked = item.id === Number(restorationPontic.value);
                        return (
                          <label
                            className={cx('design_icon_radio_label pontic', {
                              active: checked,
                            })}
                            key={item.id}
                          >
                            <img src={item.src} alt="tooth design icon" />
                            <input
                              type="checkbox"
                              name="restorationPontic"
                              className="tooth_design_input"
                              value={item.id}
                              checked={checked}
                              // onChange={restorationPontic.onChange}
                              onChange={() => {
                                if (restorationPontic.value === item.id) {
                                  restorationPontic.onChange({ value: 0 });
                                } else {
                                  restorationPontic.onChange({ value: Number(item.id) });
                                }
                              }}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </Grid>
                <Grid item className="tooth_design_box ceramic">
                  <div className="tooth_design_classify ceramic">
                    <div className="design_title_box">
                      <div className="design_title">
                        <p>
                          <T>PROJECT_OPTION_CERAMIC_METAL</T>
                        </p>
                        <CustomSpan fontColor={'#9F9F9F'}>
                          <T>PROJECT_OPTION_DESIGN_SELECT</T>
                        </CustomSpan>
                      </div>
                    </div>
                    <div className="design_icon_box">
                      {ceramicMetalIconList.map((item, index) => {
                        const checked = item.id === Number(ceramicMetal.value);
                        return (
                          <label
                            className={cx('design_icon_radio_label ceramic', {
                              active: checked,
                            })}
                            key={item.id}
                          >
                            <img src={item.src} alt="tooth design icon" />
                            <input
                              type="checkbox"
                              name="ceramicMetal"
                              className="tooth_design_input"
                              value={item.id}
                              checked={checked}
                              // onChange={ceramicMetal.onChange}
                              onChange={() => {
                                if (ceramicMetal.value === item.id) {
                                  ceramicMetal.onChange({ value: 0 });
                                } else {
                                  ceramicMetal.onChange({ value: Number(item.id) });
                                }
                              }}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </Grid>
                <Grid item className="tooth_design_box occlusal">
                  <div className="tooth_design_classify occlusal">
                    <div className="design_title_box">
                      <div className="design_title">
                        <p>
                          <T>PROJECT_OPTION_OCCLUSAL_SURFACE</T>
                        </p>
                        <CustomSpan fontColor={'#9F9F9F'}>
                          <T>PROJECT_OPTION_DESIGN_SELECT</T>
                        </CustomSpan>
                      </div>
                    </div>
                    <div className="design_icon_box">
                      {occlusalSurfaceIconList.map((item, index) => {
                        const checked = item.id === Number(occlusalSurface.value);
                        return (
                          <label
                            className={cx('design_icon_radio_label occlusal', {
                              active: checked,
                            })}
                            key={item.id}
                          >
                            <img src={item.src} alt="tooth design icon" />
                            <input
                              type="checkbox"
                              name="occlusalSurface"
                              className="tooth_design_input"
                              value={item.id}
                              checked={checked}
                              // onChange={occlusalSurface.onChange}
                              onChange={() => {
                                if (occlusalSurface.value === item.id) {
                                  occlusalSurface.onChange({ value: 0 });
                                } else {
                                  occlusalSurface.onChange({ value: Number(item.id) });
                                }
                              }}
                            />
                          </label>
                        );
                      })}
                    </div>
                  </div>
                </Grid>
              </Grid>

              {/* // */}
            </Grid>

            {/* teeth table */}
            <Grid item container className="projectIndication__table_container">
              {useMemo(
                () => (
                  <>
                    {!!teeth.value?.length && (
                      <Grid container justifyContent="flex-end">
                        <MuiButton
                          config={{
                            bgColor: '#fff',
                            borderColor: '#b5b7c1',
                            width: '105px',
                          }}
                          className="xs projectIndication__reset_btn"
                          variant="outlined"
                          onClick={handleClearAll}
                        >
                          Reset
                        </MuiButton>
                      </Grid>
                    )}
                  </>
                ),
                [teeth.value],
              )}

              <div className="projectIndication__table">
                <div className="projectIndication__table_head">
                  <Grid
                    item
                    container
                    alignItems="center"
                    xs={12}
                    className="projectIndication__table_row"
                  >
                    {/* <Grid item xs={1} className="projectIndication__table_cell">
                  </Grid> */}
                    <Grid
                      item
                      container
                      alignItems="center"
                      justifyContent="center"
                      className="projectIndication__table_cell"
                    >
                      <div>
                        <T>PROJECT_TOOTH</T>
                      </div>
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      className="projectIndication__table_cell"
                    >
                      <div>
                        <T>PROJECT_INDICATORS</T>
                      </div>
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      className="projectIndication__table_cell"
                    >
                      <div>
                        <T>PROJECT_MATERIAL</T>
                      </div>
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      className="projectIndication__table_cell"
                    >
                      <div>abutment</div>
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      justifyContent="center"
                      className="projectIndication__table_cell"
                    >
                      <div>Pre-op</div>
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      justifyContent="center"
                      className="projectIndication__table_cell"
                    >
                      <div>Gingiva</div>
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      justifyContent="center"
                      className="projectIndication__table_cell"
                    >
                      <div>Gap</div>
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      justifyContent="center"
                      className="projectIndication__table_cell"
                    >
                      <div>Minimal</div>
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      justifyContent="center"
                      className="projectIndication__table_cell"
                    >
                      <div>Milling</div>
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      justifyContent="center"
                      className="projectIndication__table_cell"
                    >
                      <div>Virtual</div>
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      justifyContent="center"
                      className="projectIndication__table_cell"
                    >
                      <div>Thimble</div>
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      justifyContent="center"
                      className="projectIndication__table_cell"
                    >
                      <div>Cervical</div>
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      justifyContent="flex-end"
                      className="projectIndication__table_cell"
                    >
                      <div>
                        <CustomSpan style={{ padding: '0 12px' }}>
                          <TrashIcon />
                        </CustomSpan>
                      </div>
                    </Grid>
                  </Grid>
                </div>
                <div ref={teethListTableRef} className="projectIndication__table_body">
                  {teeth.value?.length > 0 &&
                    teeth.value.map((item: Tooth, index: number) => {
                      const indicationName = indicationPartList.find(
                        i => i.idx === item.indicationIdx,
                        // i => i.idx === item.reconstructionIdx,
                      )?.name;
                      const materialName = materialList.find(i => i.idx === item.material)?.name;
                      // item.material !== 0
                      //   ? materialList.find(i => i.idx === item.material)?.name
                      //   : '-';
                      const hasBridge = bridge.value?.some(bridgeItem => {
                        const frontNumber = String(bridgeItem).slice(0, 2);
                        const backNumber = String(bridgeItem).slice(2);
                        const sortedNumber = [frontNumber, backNumber].sort(
                          (a, b) => Number(a) - Number(b),
                        );
                        return String(sortedNumber).slice(2).includes(item.number);
                      });
                      const implantName = implantList.find(i => i.idx === item.implantType)?.type;
                      // item.implantType !== 1
                      //   ? implantList.find(i => i.idx === item.implantType)?.type
                      //   : '-';
                      const isNoBorderBottom = index >= 6 && index === teeth.value.length - 1;

                      // console.log('hasBridge', hasBridge);
                      // console.log('item', item);
                      // color: "#9F00A7"
                      // gapWithCement: 0.08
                      // implantType: 1
                      // indicationIdx: 1
                      // material: 1
                      // millingToolDiameter: 1.2
                      // minimalTickness: 0.6
                      // number: 26
                      // preparationType: 1
                      // reconstructionType: 11
                      // separateGingivaScan: false
                      // situScan: false
                      return (
                        <Grid
                          item
                          container
                          alignItems="center"
                          xs={12}
                          key={item.number}
                          data-index={index}
                          className={cx('projectIndication__table_row', {
                            on: item.number === tooth.value.number,
                            bridge: hasBridge,
                          })}
                          style={{
                            borderBottom: isNoBorderBottom ? 'none' : '',
                          }}
                          onClick={() => onClickTooth(item.number)}
                        >
                          <Grid
                            item
                            container
                            alignItems="center"
                            justifyContent="center"
                            className="projectIndication__table_cell"
                          >
                            <div className="flex-center">
                              {withZeroNum(item.number)}
                              <span
                                className="tooth_color"
                                style={{ backgroundColor: item.color }}
                              ></span>
                            </div>
                          </Grid>
                          <Grid
                            item
                            container
                            alignItems="center"
                            className="projectIndication__table_cell"
                            title={indicationName}
                          >
                            <div>{indicationName}</div>
                          </Grid>
                          <Grid
                            item
                            container
                            alignItems="center"
                            className="projectIndication__table_cell"
                            title={materialName}
                          >
                            <div>{materialName}</div>
                          </Grid>
                          <Grid
                            item
                            container
                            alignItems="center"
                            className="projectIndication__table_cell"
                            title={implantName}
                          >
                            <div>{implantName}</div>
                          </Grid>
                          <Grid
                            item
                            container
                            alignItems="center"
                            justifyContent="center"
                            className="projectIndication__table_cell"
                          >
                            <div>{item.situScan ? 'o' : '-'}</div>
                          </Grid>
                          <Grid
                            item
                            container
                            alignItems="center"
                            justifyContent="center"
                            className="projectIndication__table_cell"
                          >
                            <div>{item.separateGingivaScan ? 'o' : '-'}</div>
                          </Grid>
                          <Grid
                            item
                            container
                            alignItems="center"
                            justifyContent="center"
                            className="projectIndication__table_cell"
                          >
                            <div>{item.gapWithCement}</div>
                          </Grid>
                          <Grid
                            item
                            container
                            alignItems="center"
                            justifyContent="center"
                            className="projectIndication__table_cell"
                          >
                            <div>{item.minimalTickness}</div>
                          </Grid>
                          <Grid
                            item
                            container
                            alignItems="center"
                            justifyContent="center"
                            className="projectIndication__table_cell"
                          >
                            <div>{item.millingToolDiameter}</div>
                          </Grid>
                          <Grid
                            item
                            container
                            alignItems="center"
                            justifyContent="center"
                            className="projectIndication__table_cell"
                          >
                            <div>
                              {item.virtualGingiva === 1
                                ? 'Yes'
                                : item.virtualGingiva === 2
                                ? 'Optional'
                                : 'No'}
                            </div>
                          </Grid>
                          <Grid
                            item
                            container
                            alignItems="center"
                            justifyContent="center"
                            className="projectIndication__table_cell"
                          >
                            <div>{item.thimbleCrown ? 'Yes' : 'No'}</div>
                          </Grid>
                          <Grid
                            item
                            container
                            alignItems="center"
                            justifyContent="center"
                            className="projectIndication__table_cell"
                          >
                            <div>{item.cervicalAdaption ? 'Preserve' : 'Pull'}</div>
                          </Grid>
                          <Grid
                            item
                            container
                            alignItems="center"
                            justifyContent="flex-end"
                            className="projectIndication__table_cell"
                          >
                            <span className="vertical_division"></span>
                            <div>
                              {/* <button
                              className="btn-reset"
                              onClick={e => handleDeleteTooth(e, item.number)}
                            >
                              <CustomSpan width={35}>
                                <TrashIcon />
                              </CustomSpan>
                            </button> */}
                              <IconButton
                                className="btn-reset"
                                onClick={e => handleDeleteTooth(e, item.number)}
                              >
                                <TrashIcon />
                              </IconButton>
                            </div>
                            {/* <ClearRoundedIcon
                            htmlColor={color.navy}
                            onClick={e => handleDeleteTooth(e, item.number)}
                          /> */}
                          </Grid>
                        </Grid>
                      );
                    })}
                </div>
              </div>
            </Grid>
          </Grid>

          {/* // */}
        </Grid>
      </Grid>

      <StyledInShadowButtonOuter height={66} right={70} width={300}>
        <MuiButton
          config={{
            width: '280px',
            color: color.navy_blue,
            endIcon: <ChevronRightIcon style={{ fontSize: '34px' }} />,
            iconMarginAlign: 50,
          }}
          disabled={!(isValidInformationValue && isValidIndicationValue)}
          disableElevation
          variant="contained"
          onClick={onCreateProject}
          className="xl border-radius-round inset-shadow-default projectInformation__next_btn"
          // endIcon={<ChevronRightIcon style={{ fontSize: '34px' }} />}
        >
          Completed
        </MuiButton>
      </StyledInShadowButtonOuter>
    </StyledCreateProjectIndication>
  );
};

export default React.memo(CreateProjectIndication);

interface TextCheckButtonProps {
  children?: React.ReactNode;
  text?: string;
  className?: string;
  active: boolean;
  size?: string;
  width?: string;
  marginRight?: number;
  onClick: () => void;
}

const TextCheckButton = ({
  children,
  text,
  className,
  active,
  // size = 'medium',
  width: widthProp = '',
  marginRight = 15,
  onClick,
}: TextCheckButtonProps) => {
  const gutter = (marginRight * 2) / 3;
  let width = widthProp ? `calc(${widthProp} - ${gutter}px)` : 'auto ';

  return (
    <StyledTextCheckButton
      className={`${className}`}
      variant="outlined"
      activeColor={active ? color.blue : 'white'}
      borderColor={active ? color.blue : '#b5b7c1'}
      width={width}
      marginRight={marginRight}
      onClick={onClick}
    >
      <span className="textCheckButton__check_icon_box">
        <CheckIcon width={8} />
      </span>
      {children}
    </StyledTextCheckButton>
  );
};

const StyledTextCheckButton = styled(HoverButton)`
  margin-right: ${({ marginRight }) => marginRight}px;
  width: ${({ width }) => width};
  padding: 9px 15px;
  font-size: 15px;
  border-radius: 5px;
  overflow: hidden;
  &:last-child {
    margin-right: 0;
  }
  .textCheckButton__check_icon_box {
    position: absolute;
    top: 0;
    right: 0;
    display: block;
    width: 1px;
    height: 1px;
    border: 10px solid transparent;
    border-top-color: ${({ borderColor }) => borderColor};
    border-right-color: ${({ borderColor }) => borderColor};
    svg {
      position: absolute;
      bottom: 1px;
      left: 0px;
    }
  }
`;

const StyledCreateProjectIndication = styled.section<{
  isUnfoldCard: boolean;
  isValidInformationValue: boolean;
  isValidIndicationValue: boolean;
}>`
  ${paperStyle};
  position: relative;
  margin-top: 100px;
  padding-bottom: 80px;
  background-color: white;
  .projectIndication__title_box {
    .projectIndication__title_btn {
      display: flex;
      align-items: center;
    }
    .projectIndication__title_badge {
      ${paperBadgeStyle};
      border-color: ${({ isValidInformationValue }) => isValidInformationValue && color.blue};
      color: ${({ isValidInformationValue }) => isValidInformationValue && color.blue};
      background-color: ${({ isValidInformationValue, isValidIndicationValue }) =>
        isValidInformationValue && isValidIndicationValue && color.blue};
      color: ${({ isValidInformationValue, isValidIndicationValue }) =>
        isValidInformationValue && isValidIndicationValue && 'white'};
    }
    .projectIndication__title {
      font-size: 26px;
    }
  }
  .projectIndication__content_box {
    max-height: ${({ isUnfoldCard }) => (isUnfoldCard ? 5000 : 0)}px;
    overflow: hidden;
    transition: max-height 0.25s;
    .projectIndication__content {
      margin-top: 25px;
      padding: 0 45px 0 85px;
      width: 100%;
      .projectIndication__content_item {
        &.teeth {
          width: 625px;
          padding-right: 50px;
          /* border-right: 1px dashed #b5b7c1; */

          .projectIndication__teeth_item {
            &.teeth_table {
              margin-top: 50px;
              .projectIndication__teeth_reset_btn_box {
                margin-bottom: 15px;
                width: 100%;
                text-align: right;
              }
            }
          }

          .projectIndication__numbering_tab_box {
            position: relative;
            margin-right: 20px;
            width: 200px;
            .projectIndication__numbering_tab {
              min-width: 50%;
            }
          }
          .projectIndication__tooth_shade_box {
            width: 200px;
          }
          .projectIndication__teeth_box {
            position: relative;
            left: -2.5%;
            margin-top: 100px;
            margin-left: auto;
            margin-right: auto;
            width: 385px;
            .projectIndication__selected_number_box {
              position: absolute;
              top: 50%;
              left: 50%;
              transform: translate(-50%, -50%);
              color: #fff;
              width: 80px;
              height: 80px;
              border: 1px solid transparent;
              border-radius: 10px;
              display: flex;
              align-items: center;
              justify-content: center;
              .projectIndication__selected_number_in_box {
              }
              .projectIndication__selected_number_text {
                font-size: 13px;
              }
              .projectIndication__selected_number {
                margin-top: 12px;
                font-size: 26px;
              }
              .projectIndication__copied_number {
                position: absolute;
                top: -20px;
                font-size: 12px;
                color: #fff;
              }
            }
          }
        }

        &.indication {
          width: calc(100% - 625px);
          /* height: 1235px; */
          /* padding-left: 70px; */

          /* material modal */
          .projectIndication__choose_indication_box {
            position: relative;
            font-size: 15px;
            .projectIndication__indication_name {
              display: flex;
              align-items: center;
              justify-content: flex-start;
              width: 100%;
              height: 45px;
              padding: 0 15px;
              border: 1px solid ${color.gray_week};
              border-radius: 5px;
            }
            .projectIndication__choose_indication_btn {
              display: flex;
              align-items: center;
              justify-content: flex-start;
              width: 100%;
              height: 45px;
              padding: 0 15px;
              /* background-color: ${color.blue}; */
              border-radius: 5px;
              color: white;
              svg {
                position: relative;
                top: 1px;
              }
            }
            /* chooseIndicationModal */
            .projectIndication__choose_indication_modal_container {
              z-index: 5;
              position: absolute;
              right: 0;
              top: 45px;
              width: 100%;
              &:not(.implant):before {
                content: '';
                display: block;
                position: absolute;
                top: -7px;
                right: 20px;
                width: 13px;
                height: 13px;
                transform: rotate(45deg);
                background-color: white;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.16);

                /* top: -20px;
                  right: 15px;
                  width: 1px;
                  border: 10px solid transparent;
                  border-left-width: 8px;
                  border-right-width: 8px; 
                  border-bottom-color: white; */
              }
            }
            .projectIndication__choose_indication_modal {
              position: relative;
              background-color: white;
              box-shadow: 0 0 10px rgba(0, 0, 0, 0.16);
              border-radius: 5px;
              &.indication,
              &.material {
                width: 660px;
                padding: 5px;
                [class*='Modal__body'] {
                  padding: 20px;
                }
              }
              &.indication {
              }
              &.material {
              }
              &.implant {
                width: 100%;
              }
            }
            .chooseIndicationModal {
              .chooseIndicationModal__body {
                border: 1px solid #e9e9ec;
                border-radius: 5px;
                .chooseIndicationModal__group {
                  &:not(:first-child) {
                    margin-top: 20px;
                  }
                  .chooseIndicationModal__group_name_box {
                    font-size: 13px;
                    font-weight: 500;
                    .chooseIndicationModal__group_mark {
                      margin-right: 10px;
                    }
                  }
                  .chooseIndicationModal__part_list {
                    display: flex;
                    flex-wrap: wrap;
                    margin-top: 10px;
                    border: 1px solid ${color.gray_week};
                    border-radius: 5px;
                    .chooseIndicationModal__part_item {
                      width: 33.33%;
                      &:not(.no-border-bottom) {
                        border-bottom: 1px solid ${color.gray_da};
                      }
                      &:nth-child(3n-1),
                      &:nth-child(3n-2) {
                        border-right: 1px solid ${color.gray_da};
                      }
                      &.disabled {
                        background-color: ${color.gray_da};
                        pointer-events: none;
                        button {
                          background-color: transparent !important;
                        }
                      }
                      .chooseIndicationModal__part_item_btn {
                        display: flex;
                        align-items: center;
                        position: relative;
                        width: 100%;
                        height: 40px;
                        padding: 0 10px;
                        border-radius: 5px;
                        font-size: 12px;
                        color: ${color.gray_week};
                        line-height: 1;
                        * {
                          pointer-events: none;
                        }
                        .chooseIndicationModal__part_item_check_icon {
                          display: inline-flex;
                          align-items: center;
                          justify-content: center;
                          position: relative;
                          top: 1px;
                          margin-right: 10px;
                          width: 15px;
                          height: 15px;
                          border: 1px solid ${color.gray_week};
                          border-radius: 50%;
                          svg path {
                            stroke: ${color.gray_week};
                          }
                        }
                        .chooseIndicationModal__part_item_version_mark {
                          position: absolute;
                          bottom: 2px;
                          right: 10px;
                          font-size: 10px;
                          color: #888;
                        }

                        &:hover,
                        &.on {
                          color: white;
                          font-weight: 500;
                          .chooseIndicationModal__part_item_check_icon {
                            border-color: white;
                            svg path {
                              stroke: white;
                            }
                          }
                          .chooseIndicationModal__part_item_version_mark {
                            color: white;
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
            .chooseMaterialModal {
              .chooseMaterialModal__body {
                border: 1px solid #e9e9ec;
                border-radius: 5px;
                .chooseMaterialModal__part_list {
                  display: flex;
                  flex-wrap: wrap;
                  border: 1px solid ${color.gray_da};
                  border-radius: 5px;
                  .chooseMaterialModal__part_item {
                    width: 50%;
                    &:not(.no-border-bottom) {
                      border-bottom: 1px solid ${color.gray_da};
                    }
                    &:nth-child(2n-1) {
                      border-right: 1px solid ${color.gray_da};
                    }

                    .chooseMaterialModal__part_item_btn {
                      display: flex;
                      align-items: center;
                      width: 100%;
                      height: 40px;
                      padding: 0 10px;
                      border-radius: 5px;
                      font-size: 12px;
                      color: ${color.gray_week};
                      line-height: 0;
                      background-color: white;

                      .chooseMaterialModal__part_item_check_icon {
                        display: inline-flex;
                        align-items: center;
                        justify-content: center;
                        position: relative;
                        top: 1px;
                        margin-right: 10px;
                        width: 15px;
                        height: 15px;
                        border: 1px solid ${color.gray_week};
                        border-radius: 50%;
                        svg path {
                          stroke: ${color.gray_week};
                        }
                      }

                      &:hover,
                      &.on {
                        background-color: ${color.blue};
                        color: white;
                        font-weight: 500;
                        .chooseMaterialModal__part_item_check_icon {
                          border-color: white;
                          svg path {
                            stroke: white;
                          }
                        }
                      }
                      &:hover {
                        background-color: #33b7e7;
                      }
                    }
                  }
                }
              }
            }
            .chooseImplantModal {
              .chooseImplantModal__body {
                border-radius: 5px;
                box-shadow: 0 0 6px rgba(0, 0, 0, 0.16);
                .chooseImplantModal__part_list {
                  display: flex;
                  flex-wrap: wrap;
                  .chooseImplantModal__part_item {
                    display: flex;
                    align-items: center;
                    width: 100%;
                    height: 45px;
                    padding: 0 15px;
                    font-size: 12px;
                    &.on {
                      background-color: rgba(0, 0, 0, 0.04);
                    }
                    &:hover {
                      background-color: rgba(0, 0, 0, 0.08);
                    }
                  }
                }
              }
            }
          }

          /* indicators sub item */
          .projectIndication__sub_list {
            display: flex;
            .projectIndication__sub_item {
              position: relative;
              width: calc(100% / 4);
              height: 45px;
              padding: 4px;
              cursor: pointer;
              border-radius: 4px;
              &:not(:first-child) {
                margin-left: 5px;
              }
              .projectIndication__sub_item_content {
                position: relative;
                display: flex;
                align-items: center;
                justify-content: center;
                height: 100%;
                text-align: center;
                font-size: 13px;
                color: #fff;
                letter-spacing: -0.2px;
                &.on {
                  border: 1px solid #fff;
                  border-radius: 4px;
                  &:before {
                    /* content: ''; */
                    display: block;
                    position: absolute;
                    top: 0;
                    right: 0;
                    border: 5px solid transparent;
                    border-top-color: #fff;
                    border-right-color: #fff;
                  }
                }
              }
            }
          }

          .form__option_checkbox_box {
            padding: 10px 0;
          }

          .form__option_slider_box {
            /* width: 290px; */
            display: flex;
            flex-wrap: wrap;
            align-items: center;
            margin-top: 15px;
            padding: 8px 0;
            .form__option_slider_label {
              width: 100%;
              margin-bottom: 5px;
            }
          }

          .projectIndication__tooth_design_container {
            margin-top: 10px;
            &:before {
              content: '';
              display: block;
              width: 100%;
              border-top: 1px dashed #bababa;
            }
            .tooth_design_box {
              width: 100%;

              margin-top: 30px;
              &:not(:first-child) {
              }
              &.occlusal {
                /* padding-top: 35px; */
              }
              .tooth_design_classify {
                display: flex;
                align-items: flex-start;
                .design_title_box {
                  display: inline-flex;
                  align-items: flex-start;
                  margin-bottom: 15px;
                  width: 160px;
                  .design_title_icon {
                    position: relative;
                    transform: translateY(-25%);
                    margin-right: 5px;
                  }
                  .design_title {
                    p {
                      font-size: 13px;
                      margin-bottom: 5px;
                      font-weight: 500;
                    }
                    span {
                      font-size: 11px;
                    }
                  }
                }
                .design_icon_box {
                  display: inline-flex;
                  flex-wrap: wrap;
                  padding-left: 20px;
                  width: calc(100% - 160px);

                  .design_icon_radio_label {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    position: relative;
                    margin-bottom: 10px;
                    width: 40px;
                    height: 40px;
                    /* border: 1px solid #bbb; */
                    border: 1px solid transparent;
                    box-shadow: 0 0 3px rgba(0, 0, 0, 0.16);
                    border-radius: 5px;
                    text-align: center;
                    cursor: pointer;
                    user-select: none;

                    &:not(:first-child) {
                      margin-left: 12px;
                    }
                    &.active {
                      background-color: #e6e6e6;
                      border-color: ${color.blue};
                    }
                    &.pontic {
                      align-items: flex-end;
                      img {
                        height: 82%;
                      }
                    }
                    &.ceramic img {
                      height: 65%;
                    }
                    &.occlusal img {
                      width: 75%;
                    }
                    .tooth_design_input {
                      position: absolute;
                      top: 0;
                      left: 0;
                      height: 0;
                      width: 0;
                      overflow: hidden;
                    }
                  }
                }
              }
            }
          }
        }

        .projectIndication__grid_item {
          padding-top: 15px;
          padding-bottom: 15px;
          font-size: 15px;

          &.indicator_sub_list {
            padding-top: 0;
          }
        }
        .form__label {
          display: inline-block;
          padding: 12px 0;
          font-size: 15px;
          font-weight: 500;
        }

        .projectIndication__form_item_label {
          width: 21%;
        }
        .projectIndication__form_item_content {
          width: 79%;
        }
      }

      .projectIndication__table_container {
        margin-top: 50px;
      }
      .projectIndication__table {
        position: relative;
        margin-top: 12px;
        width: 100%;
        overflow: hidden;
        .projectIndication__table_row {
          /* cursor: pointer; */
          position: relative;
          &.bridge {
            /* background-color: ${color.blue};
            color: #fff; */
            &:after {
              content: '';
              display: block;
              position: absolute;
              top: -12.5px;
              left: 72px;
              width: 25px;
              height: 25px;
              background: ${`url(${icon_has_bridge}) no-repeat center`};
            }
          }
          &.on {
            background-color: ${color.blue_week};
          }
        }
        .projectIndication__table_cell {
          font-size: 14px;
          text-align: center;
          padding: 0 5px;
          min-height: 40px;
          line-height: 1.3;
          > div {
            position: relative;
            overflow: hidden;
            white-space: nowrap;
            text-overflow: ellipsis;
          }
          .tooth_color {
            display: inline-block;
            margin-left: 5px;
            width: 13px;
            height: 13px;
            border-radius: 2px;
          }
          .vertical_division {
            display: inline-block;
            position: relative;
            left: -4px;
            height: 40px;
            border-left: 1px dashed ${color.gray_b5};
          }
        }
        .projectIndication__table_head,
        .projectIndication__table_body {
          position: relative;
          overflow-y: overlay;
          overflow-x: hidden;
          /* &.scroll {
            overflow-y: scroll;
          } */
          .projectIndication__table_cell {
            width: 6.5%;
            &:nth-child(1) {
              width: 7%;
            }
            &:nth-child(2) {
              width: 17%;
              padding-left: 30px;
            }
            &:nth-child(3) {
              width: 10%;
            }
            &:nth-child(4) {
              width: 13%;
            }
            &:nth-child(5) {
              width: 5.5%;
            }
            &:nth-child(6) {
              width: 5.5%;
            }
            &:nth-child(7) {
              width: 5.5%;
            }
            &:nth-child(8) {
              width: 5.5%;
            }
            &:nth-child(9) {
              width: 5.5%;
            }
            &:last-child {
              width: 6%;
              /* width: 18%; */
              /* padding-right: 10px; */
            }
          }
        }

        .projectIndication__table_head {
          border-top-left-radius: 10px;
          border-top-right-radius: 10px;
          .projectIndication__table_cell {
            min-height: 35px;
            border-top: none;
            text-transform: capitalize;
            background-color: #0782ed;
            color: white;
            &:not(:first-child) {
            }
          }
        }
        .projectIndication__table_body {
          height: 287px;
          border: 1px solid #0782ed;
          border-top: none;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
          .projectIndication__table_row {
            border-bottom: 1px dashed ${color.gray_b5};
          }
          .projectIndication__table_cell {
            /* min-height: 40px; */
          }
        }
      }
    }
  }
`;
