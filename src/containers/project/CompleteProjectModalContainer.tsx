import { Grid, IconButton, TextField } from '@material-ui/core';
import PencilUnderlineIcon from 'components/base/icons/PencilUnderlineIcon';
import TrashIcon from 'components/base/icons/TrashIcon';
import { icon_trash } from 'components/base/images';
import MuiButton from 'components/common/button/MuiButton';
import MuiWrapper from 'components/common/input/MuiWrapper';
import CustomSpan from 'components/common/text/CustomSpan';
import CustomText from 'components/common/text/CustomText';
import {
  Implant,
  IndicationSeq,
  InFormatImplant,
  Material,
  Tooth,
} from 'components/project/ProjectShared';
import useInput from 'lib/hooks/useInput';
import moment from 'moment';
import React, { useEffect, useState, Fragment, useRef, useMemo } from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { addCommas, getMapperTeethNumbering } from 'lib/library';
import { StyledPlainButtonOuter } from 'components/common/styled/Button';
import Color from 'color';
import { UnitActions } from 'store/actionCreators';
import { useShallowAppSelector } from 'store/hooks';
import ExpandMoreRoundedIcon from '@material-ui/icons/ExpandMoreRounded';
import ExpandLessRoundedIcon from '@material-ui/icons/ExpandLessRounded';
import Collapse from '@material-ui/core/Collapse';
import cx from 'classnames';
import TeethSvgV2 from 'components/common/teeth/TeethSvgV2';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';
import {
  ceramicMetalIconList,
  occlusalSurfaceIconList,
  restorationPonticIconList,
} from 'lib/teeth/teethDesignMapper';
import { T } from 'components/common/text';
import { useDidUpdateEffect } from 'lib/utils';

interface UnitPriceData {
  _id: string;
  currency: string;
  unitKey: string;
  price: number;
  updater: string;
  modifyDate: number;
}

interface UnitPrice {
  id: number;
  price: number;
  content: string;
  quantity: number;
  isModify: boolean;
  isRemove: boolean;
  material: number | undefined;
}

interface CompleteProjectModalContainerProps {
  projectInfo: object | any;
  onCancel: () => void;
}

function CompleteProjectModalContainer({
  projectInfo,
  onCancel,
}: CompleteProjectModalContainerProps) {
  const { unitData, unitSuccess, indicationFormat, indicationInfo } = useShallowAppSelector(
    state => ({
      unitData: state.unit.unit.data,
      unitSuccess: state.unit.unit.success,
      indicationFormat: state.util.indicationFormat.data?.indicationFormat,
      indicationInfo: state.util.indicationInfo.data?.indicationInfo,
    }),
  );
  const unitPriceData: UnitPriceData[] = unitData?.unitPrice;
  const inFormatIndication: IndicationSeq[] = indicationFormat?.indication;
  const materialList: Material[] = indicationInfo?.materialList;
  const implantList: Implant[] = indicationInfo?.implantList;

  const { projectId, projectName, enrollDate, dueDate, email, clientName, partnerName, manager } =
    projectInfo;
  const {
    teeth,
    bridgeList: bridge,
    notation: numbering,
    restorationPonticDesign,
    occlusalSurfaceDesign,
    ceramicMetalDesign,
  } = projectInfo.indication;

  // state
  const tooth = useInput({
    number: null,
  });
  // const checkTooth = useCheckSetInput(new Set(teeth.map((item: Tooth) => item.number)));
  const checkTooth = useCheckSetInput(new Set([]));
  const teethListTableRef = useRef<HTMLDivElement | null>(null);
  // const isScrollTeethList = teeth.value?.length >= 14;
  const selectedRestorationPontic = restorationPonticIconList.find(
    item => item.id === restorationPonticDesign,
  );
  const selectedceramicMatel = ceramicMetalIconList.find(item => item.id === ceramicMetalDesign);
  const selectedOcclusalSurface = occlusalSurfaceIconList.find(
    item => item.id === occlusalSurfaceDesign,
  );

  const [checkedSummaryExpand, setCheckedSummaryExpand] = useState(false);
  const [checkedInvoiceExpand, setCheckedInvoiceExpand] = useState(true);
  // const teeth: Tooth[] = indication?.teeth;
  // invoice state
  const unitPriceBodyRef = useRef<HTMLDivElement | any>(null);
  const [unitPrice, setUnitPrice] = useState<UnitPrice[] | any>();
  const discount = useInput(0);
  const overdue = useInput(0);
  const totalPrice = useMemo(() => {
    return unitPrice?.reduce((acc: number, curr: UnitPrice) => {
      return (acc = acc + curr.price * curr.quantity);
    }, 0);
  }, [unitPrice]);
  const finalPrice = totalPrice - discount.value + overdue.value;

  // SECTION: function
  const handleChangeUnitContent = ({ id, content }: { id: number; content: string }) => {
    setUnitPrice((draft: any[]) => {
      return draft.reduce((acc, curr) => {
        return acc.concat(curr.id === id ? { ...curr, content } : curr);
      }, [] as object[]);
    });
  };

  const handleChangeUnitPrice = ({ id, price }: { id: number; price: number | string }) => {
    if (isNaN(Number(price))) return;
    setUnitPrice((draft: any[]) => {
      return draft.reduce((acc, curr) => {
        return acc.concat(curr.id === id ? { ...curr, price } : curr);
      }, [] as object[]);
    });
  };

  const handleModifyUnitPrice = ({ id, isModify }: { id: number; isModify: boolean }) => {
    setUnitPrice((draft: any[]) => {
      return draft.reduce((acc, curr) => {
        return acc.concat(curr.id === id ? { ...curr, isModify: !curr.isModify } : curr);
      }, [] as object[]);
    });
    // when modify, focus input
    if (!isModify) {
      unitPriceBodyRef.current
        // .querySelector(`[data-id="${id}"] .completeProjectModal__invoice_input.price`)
        .querySelector(`[data-id="${id}"] .completeProjectModal__invoice_input.content`)
        .focus();
    }
  };

  const handleRemoveUnit = (id: number) => {
    setUnitPrice((draft: any[]) => {
      return draft.reduce((acc, curr) => {
        return acc.concat(curr.id === id ? { ...curr, isRemove: !curr.isRemove } : curr);
      }, [] as object[]);
    });
  };

  const handleToggleSummaryExpand = () => {
    setCheckedSummaryExpand(!checkedSummaryExpand);
    setCheckedInvoiceExpand(false);
  };

  const handleToggleInvoiceExpand = () => {
    setCheckedInvoiceExpand(!checkedInvoiceExpand);
    setCheckedSummaryExpand(false);
  };

  const handleCompleteProject = () => {};

  // SECTION: DidMount

  // init request api
  useEffect(() => {
    // partnershipIdx, currency
    UnitActions.fetch_unit_request({ partnershipIdx: '', currency: 'KRW' });
  }, []);

  // SECTION: DidUpdate

  // reclick setup
  useDidUpdateEffect(() => {
    const isRe = tooth.value.number === undefined;
    checkTooth.onChange({ value: isRe ? tooth.value.reNumber : tooth.value.number });
  }, [tooth.value]);

  // unitPrice setup
  useDidUpdateEffect(() => {
    if (teeth?.length && unitSuccess) {
      setUnitPrice(
        teeth.reduce((acc: any, curr: Tooth) => {
          const { number, preparationType, indicationIdx, material, implantType } = curr;
          const unitKey = `${preparationType}-${indicationIdx}-${material}-${implantType}`;
          const materialName = materialList.find(item => item.idx === implantType)?.name;
          const implantName = implantList.find(item => item.idx === implantType)?.type;
          const unitContent =
            implantType === 7 ? `${materialName}` : `${materialName}, ${implantName}`;
          const price = unitPriceData.find(item => item.unitKey === unitKey)?.price || 0;

          const obj = {
            id: number,
            price: price,
            content: unitContent,
            quantity: 1,
            isModify: false,
            isRemove: false,
            material,
          };

          const existingUnitIndex = acc.findIndex((item: any) => item.material === material);
          const existingUnit = acc[existingUnitIndex];
          if (existingUnit) {
            existingUnit.quantity = existingUnit.quantity + 1;
            return acc;
          }

          return acc.concat(obj);
        }, []),
      );
    }
  }, [teeth, unitSuccess]);

  // teeth click에 따른 teeth list table scroll 높이 조절
  useDidUpdateEffect(() => {
    if (
      teethListTableRef.current &&
      !!teeth?.find((item: Tooth) => item.number === tooth.value?.number)
    ) {
      const rowGutter = 43; // height + marginTop
      const currentTeethRow = teethListTableRef.current.querySelector(
        `div[data-tooth="${tooth.value.number}"]`,
      );
      const currentTeethRowPositionTop = (currentTeethRow as HTMLDivElement).offsetTop;
      setTimeout(() => {
        if (teethListTableRef.current)
          teethListTableRef.current.scrollTop = currentTeethRowPositionTop - rowGutter;
      }, 250);
    }
  }, [tooth.value, teeth.value, teethListTableRef.current]);

  return (
    <StyledCompleteProjectModalContainer data-component-name="CompleteProjectModalContainer">
      <div
        className={cx('completeProjectModal__expand_box summary', {
          'border-none': checkedSummaryExpand,
        })}
      >
        <button
          className="completeProjectModal__expand_btn btn-reset"
          onClick={handleToggleSummaryExpand}
        >
          <span className="completeProjectModal__expand_text">Summary</span>
          <span className="completeProjectModal__expand_icon_box flex-center">
            {checkedSummaryExpand ? (
              <ExpandLessRoundedIcon htmlColor="inherit" fontSize="inherit" />
            ) : (
              <ExpandMoreRoundedIcon htmlColor="inherit" fontSize="inherit" />
            )}
          </span>
        </button>
      </div>
      <Collapse in={checkedSummaryExpand}>
        <div className="completeProjectModal__summary_container">
          <div className="completeProjectModal__summary_info_box">
            <CustomText fontSize={19} fontWeight={500} color={color.navy_blue}>
              {projectName}
            </CustomText>
            <ul>
              <li>
                <CustomText fontSize={12} fontWeight={500} marginTop={15}>
                  {projectId}
                </CustomText>
              </li>
              <li>
                <CustomText fontSize={12} fontWeight={500} marginTop={10}>
                  {partnerName || clientName}
                </CustomText>
              </li>
              <li>
                <CustomText fontSize={12} fontWeight={500} marginTop={10}>
                  {moment.unix(dueDate).format('MMM DD, YYYY')}
                </CustomText>
              </li>
              <li>
                <CustomText fontSize={12} fontWeight={500} marginTop={10}>
                  {manager}
                </CustomText>
              </li>
            </ul>
          </div>

          <Grid container className="completeProjectModal__summary_teeth_grid_container">
            <Grid item xs={6}>
              <div className="completeProjectModal__teeth_box">
                <TeethSvgV2
                  isEdit={false}
                  tooth={tooth}
                  numbering={{ value: numbering }}
                  teeth={{ value: teeth }}
                  bridge={{ value: bridge }}
                />
              </div>
            </Grid>
            <Grid item xs={6}>
              <div className="completeProjectModal__tooth_list" ref={teethListTableRef}>
                {teeth?.length > 0 &&
                  teeth.map((item: Tooth) => {
                    // const toothNumberIndex = NOTATION_CONFIG.fdi.list.indexOf(item.number);
                    // let teethNumberList = NOTATION_CONFIG.fdi.list;
                    // if (numbering === 1) teethNumberList = NOTATION_CONFIG.universal.list;
                    // const toothNumber = teethNumberList[toothNumberIndex];
                    const toothNumber = getMapperTeethNumbering(item.number, numbering);

                    return (
                      <div
                        key={item.number}
                        data-tooth={item.number}
                        className="completeProjectModal__tooth_item"
                      >
                        <div
                          className="completeProjectModal__tooth_number"
                          onClick={() => tooth.setValue({ number: item.number })}
                        >
                          {!![...checkTooth.value].find(i => i === item.number) ? (
                            <RemoveIcon
                              className="completeProjectModal__fold_icon unfold"
                              // style={{ backgroundColor: '#fff' }}
                            />
                          ) : (
                            <AddIcon
                              className="completeProjectModal__fold_icon fold"
                              // style={{ backgroundColor: '#fff' }}
                            />
                          )}
                          <T>PROJECT_TOOTH</T> {toothNumber}
                          <span
                            className="completeProjectModal__fold_color"
                            style={{ backgroundColor: item.color }}
                          ></span>
                        </div>

                        <div
                          className={cx('completeProjectModal__tooth_detail', {
                            on: !![...checkTooth.value].find(i => i === item.number),
                          })}
                        >
                          <Grid
                            container
                            spacing={2}
                            className="completeProjectModal__tooth_detail_grid_container"
                          >
                            <Grid item xs={5} className="completeProjectModal__tooth_detail_label">
                              - <T>PROJECT_TYPE</T>
                            </Grid>
                            <Grid item xs={7} className="completeProjectModal__tooth_detail_text">
                              {inFormatIndication.find(i => i.seq === item.preparationType)?.name}
                            </Grid>

                            <Grid item xs={5} className="completeProjectModal__tooth_detail_label">
                              - <T>PROJECT_INDICATION</T>
                            </Grid>
                            <Grid item xs={7} className="completeProjectModal__tooth_detail_text">
                              {
                                inFormatIndication
                                  .find(i => i.seq === item.preparationType)
                                  ?.list.find(o => o.seq === item.indicationIdx)?.name
                              }
                            </Grid>

                            <Grid item xs={5} className="completeProjectModal__tooth_detail_label">
                              - <T>PROJECT_MATERIAL</T>
                            </Grid>
                            <Grid item xs={7} className="completeProjectModal__tooth_detail_text">
                              {materialList.find(i => i.idx === item.material)?.name}
                            </Grid>

                            <Grid item xs={5} className="completeProjectModal__tooth_detail_label">
                              - <T>PROJECT_IMPLANT</T>
                            </Grid>
                            <Grid item xs={7} className="completeProjectModal__tooth_detail_text">
                              {implantList.find(i => i.idx === item.implantType)?.type}
                            </Grid>

                            <Grid item xs={5} className="completeProjectModal__tooth_detail_label">
                              - <T>PROJECT_OPTION_GAP_WIDTH</T>
                            </Grid>
                            <Grid item xs={7} className="completeProjectModal__tooth_detail_text">
                              {item.gapWithCement}
                            </Grid>

                            <Grid item xs={5} className="completeProjectModal__tooth_detail_label">
                              - <T>PROJECT_OPTION_THICKNESS</T>
                            </Grid>
                            <Grid item xs={7} className="completeProjectModal__tooth_detail_text">
                              {item.minimalTickness}
                            </Grid>
                            <Grid item xs={5} className="completeProjectModal__tooth_detail_label">
                              - <T>PROJECT_OPTION_DIAMETER</T>
                            </Grid>
                            <Grid item xs={7} className="completeProjectModal__tooth_detail_text">
                              {item.millingToolDiameter}
                            </Grid>

                            <Grid item xs={5} className="completeProjectModal__tooth_detail_label">
                              - <T>PROJECT_OPTION_SCAN_PRE_OP</T>?
                            </Grid>
                            <Grid item xs={7} className="completeProjectModal__tooth_detail_text">
                              {item.situScan ? 'Yes' : 'No'}
                            </Grid>

                            <Grid item xs={5} className="completeProjectModal__tooth_detail_label">
                              - <T>PROJECT_OPTION_SCAN_GINGIVA</T>?
                            </Grid>
                            <Grid item xs={7} className="completeProjectModal__tooth_detail_text">
                              {item.separateGingivaScan ? 'Yes' : 'No'}
                            </Grid>
                          </Grid>
                        </div>
                      </div>
                    );
                  })}
              </div>
              <ul className="completeProjectModal__tooth_design_list">
                {selectedRestorationPontic && (
                  <li className="completeProjectModal__tooth_design_item">
                    <figure className="pontic">
                      <img src={selectedRestorationPontic?.src} alt="tooth design" />
                    </figure>
                    <div className="completeProjectModal__tooth_design_name">
                      Restoration
                      <br />
                      Pontic Design
                    </div>
                  </li>
                )}
                {selectedceramicMatel && (
                  <li className="completeProjectModal__tooth_design_item">
                    <figure className="ceramic">
                      <img src={selectedceramicMatel?.src} alt="tooth design" />
                    </figure>
                    <div className="completeProjectModal__tooth_design_name">
                      Ceramic
                      <br />
                      Matel Design
                    </div>
                  </li>
                )}
                {selectedOcclusalSurface && (
                  <li className="completeProjectModal__tooth_design_item">
                    <figure className="occlusal">
                      <img src={selectedOcclusalSurface?.src} alt="tooth design" />
                    </figure>
                    <div className="completeProjectModal__tooth_design_name">
                      Occlusal
                      <br />
                      Surface Design
                    </div>
                  </li>
                )}
                {/* item.id === Number(restorationPonticDesign) */}
              </ul>
            </Grid>
          </Grid>
        </div>
      </Collapse>

      <div
        className={cx('completeProjectModal__expand_box invoice', {
          'border-none': checkedInvoiceExpand,
        })}
      >
        <button
          className="completeProjectModal__expand_btn btn-reset"
          onClick={handleToggleInvoiceExpand}
        >
          <span className="completeProjectModal__expand_text">Invoice</span>
          <span className="completeProjectModal__expand_icon_box flex-center">
            {checkedInvoiceExpand ? (
              <ExpandLessRoundedIcon htmlColor="inherit" fontSize="inherit" />
            ) : (
              <ExpandMoreRoundedIcon htmlColor="inherit" fontSize="inherit" />
            )}
          </span>
        </button>
      </div>
      <Collapse in={checkedInvoiceExpand}>
        <div className="completeProjectModal__invoice_container">
          <div className="completeProjectModal__invoice_info_box">
            <div className="completeProjectModal__invoice_info_card">
              <div className="completeProjectModal__invoice_info_card_partner">
                <div className="completeProjectModal__invoice_info_card_partner_to flex-center">
                  Invoice to
                </div>
                <CustomText fontSize={21} fontWeight={700} marginTop={25}>
                  {partnerName || clientName}
                </CustomText>
              </div>
              {/* <CustomText marginTop={30}>
              <CustomSpan fontSize={16} fontWeight={500}>
                Order Code
              </CustomSpan>
              <CustomSpan fontSize={16} marginLeft={25}>
                #000001
              </CustomSpan>
            </CustomText> */}
              <div className="completeProjectModal__invoice_info_card_date">
                <CustomText fontColor={color.gray_week}>Project Date</CustomText>
                <CustomText fontSize={19} fontWeight={500} marginTop={15}>
                  {moment.unix(enrollDate).format('MMM DD, YYYY')} ~{' '}
                  {moment.unix(dueDate).format('MMM DD, YYYY')}
                </CustomText>
              </div>
              <div className="completeProjectModal__invoice_info_card_email">
                <CustomText fontColor={color.gray_week}>Account Email</CustomText>
                <CustomText fontSize={19} fontWeight={500} marginTop={15}>
                  {email}
                </CustomText>
              </div>
            </div>
          </div>
          <div className="completeProjectModal__invoice_items_box">
            <div className="completeProjectModal__invoice_items_table">
              <Grid container className="completeProjectModal__invoice_items_thead">
                <Grid item container className="completeProjectModal__invoice_items_row">
                  <Grid
                    item
                    container
                    alignItems="center"
                    className="completeProjectModal__invoice_items_th"
                  >
                    Project ID
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    className="completeProjectModal__invoice_items_th"
                  >
                    Content
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    className="completeProjectModal__invoice_items_th"
                  >
                    Quantity
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    className="completeProjectModal__invoice_items_th"
                  >
                    Unit price
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    className="completeProjectModal__invoice_items_th"
                  >
                    Price
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    justifyContent="center"
                    className="completeProjectModal__invoice_items_th"
                  ></Grid>
                </Grid>
              </Grid>
              <Grid
                container
                className="completeProjectModal__invoice_items_tbody"
                ref={unitPriceBodyRef}
              >
                {unitPrice?.length &&
                  unitPrice.map((item: UnitPrice, idx: number) => (
                    <Fragment key={idx}>
                      {item.isRemove ? (
                        ''
                      ) : (
                        <Grid
                          item
                          container
                          className="completeProjectModal__invoice_items_row"
                          data-id={item.id}
                        >
                          <Grid
                            item
                            container
                            alignItems="center"
                            className="completeProjectModal__invoice_items_td"
                          >
                            {idx === 0 && projectId}
                          </Grid>
                          <Grid
                            item
                            container
                            alignItems="center"
                            className="completeProjectModal__invoice_items_td"
                          >
                            <input
                              type="text"
                              readOnly={!item.isModify}
                              placeholder=""
                              value={item.content || ''}
                              onChange={e =>
                                handleChangeUnitContent({ id: item.id, content: e.target.value })
                              }
                              className="completeProjectModal__invoice_input content"
                            />
                          </Grid>
                          <Grid
                            item
                            container
                            alignItems="center"
                            className="completeProjectModal__invoice_items_td"
                          >
                            {item.quantity}
                          </Grid>
                          <Grid
                            item
                            container
                            alignItems="center"
                            className="completeProjectModal__invoice_items_td"
                          >
                            <input
                              type="text"
                              readOnly={!item.isModify}
                              placeholder="0"
                              value={item.price || ''}
                              onChange={e =>
                                handleChangeUnitPrice({ id: item.id, price: e.target.value })
                              }
                              className="completeProjectModal__invoice_input price"
                            />
                          </Grid>
                          <Grid
                            item
                            container
                            alignItems="center"
                            className="completeProjectModal__invoice_items_td"
                          >
                            &#65510; {addCommas(item.price * item.quantity)}
                          </Grid>
                          <Grid
                            item
                            container
                            alignItems="center"
                            className="completeProjectModal__invoice_items_td"
                          >
                            <IconButton
                              aria-label="cancel modal"
                              onClick={() =>
                                handleModifyUnitPrice({ id: item.id, isModify: item.isModify })
                              }
                            >
                              <PencilUnderlineIcon color={color.gray_week} width={15} />
                            </IconButton>
                            <IconButton
                              aria-label="cancel modal"
                              onClick={() => handleRemoveUnit(item.id)}
                            >
                              <TrashIcon />
                            </IconButton>
                          </Grid>
                        </Grid>
                      )}
                    </Fragment>
                  ))}
              </Grid>
              <Grid
                container
                alignItems="center"
                justifyContent="flex-end"
                className="completeProjectModal__invoice_total_price"
              >
                &#65510; {addCommas(totalPrice)}
              </Grid>
              <Grid
                container
                justifyContent="flex-end"
                className="completeProjectModal__invoice_etc_row"
              >
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                  className="completeProjectModal__invoice_etc_td"
                >
                  <CustomSpan fontColor={color.blue}>Discount</CustomSpan>
                  <div className="inline-flex-center">
                    <RemoveIcon htmlColor={color.gray_week} fontSize="small" />
                    <input
                      type="text"
                      placeholder="0"
                      maxLength={11}
                      value={discount.value ? addCommas(discount.value) : ''}
                      onChange={e => {
                        const targetValue = Number(e.target.value.replace(/,/g, ''));
                        if (isNaN(targetValue)) return;
                        discount.onChange({ value: targetValue });
                      }}
                      className="completeProjectModal__invoice_input etc"
                    />
                  </div>
                </Grid>
              </Grid>
              <Grid
                container
                justifyContent="flex-end"
                className="completeProjectModal__invoice_etc_row"
              >
                <Grid
                  container
                  alignItems="center"
                  justifyContent="space-between"
                  className="completeProjectModal__invoice_etc_td"
                >
                  <CustomSpan fontColor={color.blue}>Overdue</CustomSpan>
                  <div className="inline-flex-center">
                    <AddIcon htmlColor={color.gray_week} fontSize="small" />
                    <input
                      type="text"
                      placeholder="0"
                      maxLength={11}
                      value={overdue.value ? addCommas(overdue.value) : ''}
                      onChange={e => {
                        const targetValue = Number(e.target.value.replace(/,/g, ''));
                        if (isNaN(targetValue)) return;
                        overdue.onChange({ value: targetValue });
                      }}
                      className="completeProjectModal__invoice_input etc"
                    />
                  </div>
                </Grid>
              </Grid>
              <Grid
                container
                alignItems="center"
                justifyContent="flex-end"
                className="completeProjectModal__invoice_final_price"
              >
                <CustomSpan fontSize={18} fontWeight={500} marginRight={100}>
                  Total
                </CustomSpan>
                <CustomSpan fontSize={21} fontWeight={700}>
                  &#65510; {addCommas(finalPrice)}
                </CustomSpan>
              </Grid>
            </div>
            {/* <div className="completeProjectModal__invoice_complete_btn_box">
              <MuiButton
                config={{
                  width: 150,
                }}
                variant="contained"
                color="primary"
                disableElevation
                className="md inset-shadow-default border-radius-round"
                onClick={handleCompleteProject}
              >
                <b>Complete</b>
              </MuiButton>
            </div> */}
          </div>
        </div>
      </Collapse>

      <StyledPlainButtonOuter backgroundColor={color.navy_blue} height={76} left={'50%'}>
        {/* <MuiButton
          config={{
            width: '320px',
          }}
          variant="contained"
          disableElevation
          className="xl inset-shadow-default border-radius-round"
          onClick={handleCompleteProject}
        >
          <b>Complete</b>
        </MuiButton> */}
        <div className="completeProjectModal__publish_btn_box">
          <MuiButton
            config={{
              width: '60px',
              color: 'white',
              fontColor: `${color.blue}`,
            }}
            disableElevation
            variant="contained"
            className="xl border-radius-round inset-shadow-default completeProjectModal__reject_btn"
            onClick={onCancel}
          >
            Skip
          </MuiButton>
          <MuiButton
            config={{
              width: '295px',
            }}
            // disabled={!isValidInformationValue}
            disableElevation
            variant="contained"
            className="xl border-radius-round inset-shadow-default completeProjectModal__accept_btn"
            // onClick={() => setIsUnfoldCard(draft => !draft)}
            // endIcon={<ExpandMoreIcon style={{ fontSize: '34px' }} />}
          >
            <span className="btn-shadow-inset"></span>
            {finalPrice ? <> Publish l &#65510; {addCommas(finalPrice)}</> : <>Publish</>}
          </MuiButton>
        </div>
      </StyledPlainButtonOuter>
    </StyledCompleteProjectModalContainer>
  );
}

const StyledCompleteProjectModalContainer = styled.div`
  .completeProjectModal__banner_box {
    height: 240px;
    background-color: #fafafd;
    border-radius: 15px;
  }

  .completeProjectModal__expand_box {
    position: relative;
    width: 100%;
    height: 45px;
    border: 1px solid ${color.gray_b5};
    border-radius: 3px;

    &.border-none {
      border-width: 0;
    }
    &.invoice {
      margin-top: 65px;
    }
    .completeProjectModal__expand_btn {
      display: flex;
      align-items: center;
      position: relative;
      left: -1px;
      top: -25px;
      height: 50px;
      padding-right: 30px;
      background-color: white;
      text-align: left;

      img {
        margin-right: 10px;
      }
      .completeProjectModal__expand_text {
        display: inline-block;
        width: 110px;
        font-size: 20px;
        font-weight: 700;
        color: ${color.navy_blue};
      }
      .completeProjectModal__expand_icon_box {
        width: 34px;
        height: 34px;
        background-color: ${color.navy_blue};
        border-radius: 50%;
        color: white;
        font-size: 34px;
        line-height: 0;
      }
    }
  }

  .completeProjectModal__summary_container {
    display: flex;
    border: 1px solid #f4f5fa;
    border-radius: 5px;

    .completeProjectModal__summary_info_box {
      width: 220px;
      padding: 35px 20px;
      padding-right: 5px;
      > ul {
        padding-left: 9px;
        li {
          list-style-type: '- ';
        }
      }
    }
    .completeProjectModal__summary_teeth_grid_container {
      padding: 20px 0;
      border-radius: 5px;
      box-shadow: 0 0 3px rgba(0, 0, 0, 0.16);

      .completeProjectModal__teeth_box {
        width: 254.5px;
        margin: 0 auto;
      }
      .completeProjectModal__tooth_list {
        position: relative;
        height: 384px;
        overflow-y: overlay;
        overflow-x: hidden;
        .completeProjectModal__tooth_item {
          & + .completeProjectModal__tooth_item {
            margin-top: 15px;
          }
          .completeProjectModal__tooth_number {
            display: flex;
            align-items: center;
            font-size: 16px;
            cursor: pointer;
            .completeProjectModal__fold_icon {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              width: 20px;
              height: 20px;
              margin-right: 15px;
              border-radius: 3px;
              border: 1px solid ${color.blue};
              background-color: ${color.blue};
              color: #fff;
              &.unfold {
                background-color: #fff;
                color: ${color.blue};
              }
            }
            .completeProjectModal__fold_color {
              margin-left: 15px;
              width: 16px;
              height: 16px;
            }
          }
          .completeProjectModal__tooth_detail {
            padding-left: 45px;
            height: 0;
            transition: all 0.25s;
            overflow: hidden;
            font-size: 12px;
            &.on {
              height: 256px;
            }
            .completeProjectModal__tooth_detail_grid_container {
              margin-top: 0px;
            }
            .completeProjectModal__tooth_detail_label {
              letter-spacing: -0.3px;
              font-weight: 300;
            }
            .completeProjectModal__tooth_detail_text {
              color: ${color.gray_font};
              overflow: hidden;
              white-space: nowrap;
              text-overflow: ellipsis;
            }
          }
        }
      }
      .completeProjectModal__tooth_design_list {
        display: flex;
        align-items: center;
        margin-top: 5px;
        padding-top: 30px;
        border-top: 1px dashed ${color.gray_da};
        .completeProjectModal__tooth_design_item {
          display: flex;
          align-items: flex-end;
          width: 33.33%;
          figure {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            position: relative;
            width: 40px;
            height: 40px;
            box-shadow: 0 0 3px rgba(0, 0, 0, 0.16);
            border-radius: 5px;
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
          }
          .completeProjectModal__tooth_design_name {
            margin-left: 10px;
            width: calc(100% - 50px);
            font-size: 11px;
            line-height: 1.2;
          }
        }
      }
    }
  }

  .completeProjectModal__invoice_container {
    display: flex;
    column-gap: 30px;

    .completeProjectModal__invoice_info_box {
      width: 330px;
      .completeProjectModal__invoice_info_card {
        height: 450px;
        padding: 0 30px;
        background-color: ${color.navy_blue};
        border-radius: 10px;
        border-bottom-right-radius: 30px;
        color: white;
        text-align: center;

        > * {
          /* padding: 23px 0 17px; */
          padding: 35px 0;
          min-height: 100px;
          &:not(:last-child) {
            border-bottom: 1px dashed white;
          }
        }
        .completeProjectModal__invoice_info_card_partner {
          padding: 20px 0 25px;
          border-bottom: 3px solid white;
          min-height: 126px;
          .completeProjectModal__invoice_info_card_partner_to {
            margin: 0 auto;
            width: 120px;
            height: 30px;
            border-radius: 15px;
            border: 1px solid white;
            font-size: 13px;
          }
        }
        .completeProjectModal__invoice_info_card_order_code {
        }
        .completeProjectModal__invoice_info_card_date {
        }
        .completeProjectModal__invoice_info_card_email {
        }
      }
    }
    .completeProjectModal__invoice_items_box {
      width: 830px;
      .completeProjectModal__invoice_items_table {
        .completeProjectModal__invoice_items_th,
        .completeProjectModal__invoice_items_td {
          position: relative;
          height: 50px;
          white-space: nowrap;
          overflow-x: overlay;

          &:nth-child(1) {
            width: 28%;
            padding-left: 20px;
          }
          &:nth-child(2) {
            width: 28%;
          }
          &:nth-child(3) {
            width: 10%;
          }
          &:nth-child(4) {
            width: 10%;
          }
          &:nth-child(5) {
            width: 13.5%;
            padding-right: 5px;
          }
          &:nth-child(6) {
            width: 10.5%;
          }
        }
      }
      .completeProjectModal__invoice_items_td {
      }
      .completeProjectModal__invoice_items_row {
        display: flex;
      }
      .completeProjectModal__invoice_items_thead,
      .completeProjectModal__invoice_items_tbody {
        max-height: 230px;
        overflow-y: overlay;
      }
      .completeProjectModal__invoice_items_thead {
        border-top: 3px solid #edf4fb;
        border-bottom: 3px solid #edf4fb;
      }
      .completeProjectModal__invoice_items_tbody {
        .completeProjectModal__invoice_items_row {
          border-bottom: 1px solid #edf4fb;
        }
      }

      .completeProjectModal__invoice_input {
        padding: 5px;
        border: 1px solid transparent;

        &:read-only {
        }
        &:not(:read-only) {
          border-color: ${color.gray_week};
          border-radius: 5px;
          /* border-bottom-color: ${color.gray_week}; */
          /* padding: 5px 10px; */
        }
        &.content {
          width: 95%;
        }
        &.price {
          width: 68px;
        }
        &.etc {
          margin-left: 5px;
          width: 150px;
          text-align: right;
        }
      }
      .completeProjectModal__invoice_total_price {
        margin-bottom: 15px;
        min-height: 50px;
        font-size: 19px;
        font-weight: 700;
        padding-right: calc(10% + 5px);
        text-align: right;
      }
      .completeProjectModal__invoice_etc_row {
        .completeProjectModal__invoice_etc_td {
          position: relative;
          width: 386px;
          min-height: 50px;
          border-top: 1px solid #edf4fb;
          padding-left: 15px;
          padding-right: 88px;
        }
      }
      .completeProjectModal__invoice_final_price {
        min-height: 50px;
        padding-right: calc(10% + 5px);
        border-top: 3px solid #edf4fb;
      }
    }

    /* .completeProjectModal__invoice_complete_btn_box {
      display: flex;
      justify-content: flex-end;
      margin-top: 30px;
    } */
  }

  .completeProjectModal__publish_btn_box {
    display: flex;
    position: relative;
    .completeProjectModal__reject_btn {
      position: relative;
      z-index: 2;
    }
    .completeProjectModal__accept_btn {
      margin-left: -10px;
      background: rgb(0, 166, 226);
      background: linear-gradient(90deg, rgba(0, 166, 226, 1) 0%, rgba(8, 123, 238, 1) 100%);
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
        background-color: ${color.navy_blue};
        box-shadow: 3px 3px 6px rgba(0, 0, 0, 0.16);
      }
    }
  }
`;

export default React.memo(CompleteProjectModalContainer);
