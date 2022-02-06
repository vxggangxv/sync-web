import React, { useMemo, useRef, useState } from 'react';
import styled from 'styled-components';
import CustomSpan from 'components/common/text/CustomSpan';
import moment from 'moment';
import MuiButton from 'components/common/button/MuiButton';
import PencilUnderlineIcon from 'components/base/icons/PencilUnderlineIcon';
import { paperStyle } from './ProjectShared';
import { Grid, TextField } from '@material-ui/core';
import CustomText from 'components/common/text/CustomText';
import { color } from 'styles/utils';
import { T } from 'components/common/text';
import MuiWrapper from 'components/common/input/MuiWrapper';
import TeethSvgV2 from 'components/common/teeth/TeethSvgV2';
import useInput from 'lib/hooks/useInput';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';
import { useDidUpdateEffect } from 'lib/utils';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import { indicationFormat } from 'components/common/teeth/teethInformation';
import cx from 'classnames';
import ProjectFileUpload from 'components/project/ProjectFileUpload';
import { getMapperTeethNumbering } from 'lib/library';
import {
  restorationPonticIconList,
  occlusalSurfaceIconList,
  ceramicMetalIconList,
} from 'lib/teeth/teethDesignMapper';
import DownloadIcon from 'components/base/icons/DownloadIcon';
import AppModal from 'components/common/modal/AppModal';
import PlainModal from 'components/common/modal/PlainModal';
import GoldStatusModalContainer from 'containers/project/GoldStatusModalContainer';
import SyncProjectModalContainer from 'containers/project/SyncProjectModalContainer';
import ShareIcon from 'components/base/icons/ShareIcon';

interface ProjectInformationProps {}

function ProjectInformation(props: ProjectInformationProps) {
  const [goldStatusModalOpen, setGoldStatusModalOpen] = useState(false);
  const [syncProjectModalOpen, setSyncProjectModalOpen] = useState(false);
  // TODO: UNS 일 경우 tooth 번호 변경 적용

  // TEMP: 임시데이타
  const memo =
    'sdlkfjsdlkfjsdlkfjsdsdlkfjsdlkfjsdlkfjsdsdlkfjsdlkfjsdlkfjsdsdlkfjsdlkfjsdlkfjsdsdlkfjsdlkfjsdlkf';

  const indicationData = {
    shade: { idx: 4, group: 'A', code: 'A3.5' },
    notation: 1,
    restorationPonticDesign: 4,
    ceramicMetalDesign: 3,
    occlusalSurfaceDesign: 2,
    teethTreatmentIdx: 852,
  };

  const teeth = [
    {
      indicationIdx: 11,
      preparationType: 3,
      number: 22,
      reconstructionType: 31,
      material: 5,
      color: '#335C15',
      implantType: 4,
      situScan: 1,
      separateGingivaScan: 0,
      gapWithCement: 0.08,
      minimalTickness: 0.6,
      millingToolDiameter: 1.2,
    },
    {
      indicationIdx: 11,
      preparationType: 3,
      number: 23,
      reconstructionType: 31,
      material: 5,
      color: '#335C15',
      implantType: 4,
      situScan: 1,
      separateGingivaScan: 0,
      gapWithCement: 0.08,
      minimalTickness: 0.6,
      millingToolDiameter: 1.2,
    },
  ];
  // end temporary data

  // TODO: indicationFormat
  const materialList = indicationFormat?.materialList;
  const implantList = indicationFormat?.implantList;
  const indication = indicationFormat?.indication;
  const toothShadeList = indicationFormat?.toothShadeList;
  // TODO: data mapping
  // const shade = indicationData.shade.code;
  const {
    shade: { code: shadeCode },
    notation: numbering,
    restorationPonticDesign,
    occlusalSurfaceDesign,
    ceramicMetalDesign,
  } = indicationData;
  const toothDesignList = [
    {
      id: restorationPonticDesign,
      name: 'Restoration Pontic Design',
      iconSrc: restorationPonticIconList.find(item => item.id === restorationPonticDesign)?.src,
    },
    {
      id: occlusalSurfaceDesign,
      name: 'Occlusal Surface Design',
      iconSrc: occlusalSurfaceIconList.find(item => item.id === occlusalSurfaceDesign)?.src,
    },
    {
      id: ceramicMetalDesign,
      name: 'Ceramic Metal Design',
      iconSrc: ceramicMetalIconList.find(item => item.id === ceramicMetalDesign)?.src,
    },
  ];
  // state
  const tooth = useInput({
    number: null,
  });
  const checkTooth = useCheckSetInput(new Set([]));
  const teethListTableRef = useRef<null | any>(null);

  // method
  const handleCloseGoldStatusModal = () => setGoldStatusModalOpen(false);
  const handleCloseSyncProjectModal = () => setSyncProjectModalOpen(false);

  // DidUpdate
  useDidUpdateEffect(() => {
    const isRe = tooth.value.number === undefined;
    checkTooth.onChange({ value: isRe ? tooth.value.reNumber : tooth.value.number });
  }, [tooth.value]);

  // teeth click에 따른 teeth list table scroll 높이 조절
  useDidUpdateEffect(() => {
    if (teethListTableRef.current && !!teeth?.find(item => item.number === tooth.value?.number)) {
      const rowGutter = 43; // height + marginTop
      const currentTeethRow = teethListTableRef.current.querySelector(
        `li[data-tooth="${tooth.value.number}"]`,
      );
      // console.log('tooth.value', tooth.value);
      // console.log('currentTeethRow', currentTeethRow);
      const currentTeethRowPositionTop = currentTeethRow.offsetTop;
      setTimeout(() => {
        teethListTableRef.current.scrollTop = currentTeethRowPositionTop - rowGutter;
      }, 250);
    }
    // TODO: change teeth -> teeth.value
  }, [tooth.value, teeth, teethListTableRef.current]);

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

      {/* SyncProject */}
      {useMemo(
        () => (
          <PlainModal
            isOpen={syncProjectModalOpen}
            onClose={handleCloseSyncProjectModal}
            width={1425}
          >
            <AppModal
              title={'Sync Project'}
              headerCenterText={'Dof_project_123(project name)'}
              headerCenterTextStyle={{ width: 600 }}
              content={<SyncProjectModalContainer />}
              contentCardStyle={{
                padding: '0',
                borderRadius: '8px',
              }}
              isCloseIcon={true}
              onCancel={handleCloseSyncProjectModal}
              hideButton={true}
            />
          </PlainModal>
        ),
        [syncProjectModalOpen],
      )}

      <StyledProject data-component-name="Project">
        <div className="project__title_box">
          <span className="project__title_badge" />
          <h1 className="project__title">
            <span className="project__title_text">Project Name</span>
            <span className="project__title_date">{moment().format('MMM. DD. YYYY')}</span>
          </h1>
          <MuiButton
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
          </MuiButton>
        </div>

        {/* information, file */}
        <section className="project__content_container">
          {/* information */}
          <Grid container className="project__content_info_container">
            <Grid item className="project__content_info_box">
              <h1 className="project__content_info_title">
                <CustomText fontSize={26} fontColor={color.blue} fontWeight={500}>
                  Information
                </CustomText>
              </h1>

              <Grid container alignItems="center" className="project__content_info_item">
                <Grid item className="project__content_info_label">
                  <label htmlFor="" className="form__label">
                    <T>GLOBAL_PARTNER</T>
                  </label>
                </Grid>
                <Grid item className="project__content_info_text">
                  {'웃는내일치과'}
                </Grid>
              </Grid>

              <Grid container alignItems="center" className="project__content_info_item">
                <Grid item className="project__content_info_label">
                  <label htmlFor="" className="form__label">
                    <T>PROJECT_ID</T>
                  </label>
                </Grid>
                <Grid item className="project__content_info_text">
                  {'20210323-0000'}
                  <CustomSpan fontColor={color.blue}>_RE</CustomSpan>
                </Grid>
              </Grid>

              <Grid container alignItems="center" className="project__content_info_item">
                <Grid item className="project__content_info_label">
                  <label htmlFor="" className="form__label">
                    <T>PROJECT_NAME</T>
                  </label>
                </Grid>
                <Grid item className="project__content_info_text">
                  {'Project Name__ '}
                </Grid>
              </Grid>

              <Grid container alignItems="center" className="project__content_info_item">
                <Grid item className="project__content_info_label">
                  <label htmlFor="" className="form__label">
                    <T>PROJECT_DUE_DATE</T>
                  </label>
                </Grid>
                <Grid item className="project__content_info_text">
                  {moment().format('YYYY-MM-DD')}
                </Grid>
              </Grid>

              <Grid container alignItems="center" className="project__content_info_item">
                <Grid item className="project__content_info_label">
                  <label htmlFor="" className="form__label">
                    <T>PROJECT_MANAGER</T>
                  </label>
                </Grid>
                <Grid item className="project__content_info_text">
                  {'홍길동'}
                </Grid>
              </Grid>

              <Grid container alignItems="center" className="project__content_info_item">
                <Grid item className="project__content_info_label">
                  <label htmlFor="" className="form__label">
                    Gold Hold Status
                  </label>
                </Grid>
                <Grid item className="project__content_info_text">
                  <MuiButton
                    config={{ width: 150, color: color.navy_blue }}
                    variant="outlined"
                    className="sm border-radius-round inset-shadow-default gold_status_btn"
                    onClick={() => setGoldStatusModalOpen(true)}
                  >
                    <CustomSpan fontWeight={700}>Check Out</CustomSpan>
                  </MuiButton>
                </Grid>
              </Grid>

              <Grid container alignItems="center" className="project__content_info_item memo">
                <Grid item xs={12} className="project__content_info_label">
                  <label htmlFor="" className="form__label">
                    {/* <T>PROJECT_MEMO</T> */}
                    My Memo
                  </label>
                </Grid>
                <Grid item xs={12} className="project__content_info_text">
                  <MuiWrapper config={{ height: 'auto' }}>
                    <TextField
                      multiline
                      rows={25}
                      variant="outlined"
                      fullWidth
                      value={memo}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </MuiWrapper>
                </Grid>
              </Grid>
            </Grid>

            <Grid item className="project__content_teeth_box">
              <div className="project__content_teeth_numbering_box">
                <span className="project__content_teeth_numbering_badge">
                  {numbering ? 'FDI' : 'UNS'}
                </span>
                {/* TODO: if shade is not none, show */}
                <span className="project__content_teeth_shade">Shade Option: {shadeCode}</span>
              </div>

              <TeethSvgV2
                isEdit={false}
                tooth={tooth}
                numbering={{ value: numbering }}
                teeth={{ value: teeth }}
                bridge={{ value: '' }}
              />
            </Grid>

            <Grid item className="project__content_data_box">
              <div className="project__content_data_title">
                <CustomText fontSize={19} fontWeight={500}>
                  Data
                </CustomText>
              </div>

              <ul className="project__content_data_tooth_list" ref={teethListTableRef}>
                {teeth?.length > 0 &&
                  teeth.map(item => {
                    // TODO: numbering matching
                    // const toothNumberIndex = NOTATION_CONFIG.fdi.list.indexOf(item.number);
                    // let teethNumberList = NOTATION_CONFIG.fdi.list;
                    // if (numbering === 1) teethNumberList = NOTATION_CONFIG.universal.list;
                    // const toothNumber = teethNumberList[toothNumberIndex];
                    const toothNumber = getMapperTeethNumbering(item.number, numbering);

                    return (
                      <li
                        key={item.number}
                        data-tooth={item.number}
                        className="project__content_data_tooth_item"
                      >
                        <div
                          className="project__content_data_tooth_number"
                          onClick={() => tooth.setValue({ number: item.number })}
                        >
                          {!![...checkTooth.value].find(i => i === item.number) ? (
                            <RemoveIcon
                              className="project__content_data_fold_icon unfold"
                              style={{ backgroundColor: item.color }}
                            />
                          ) : (
                            <AddIcon
                              className="project__content_data_fold_icon fold"
                              style={{ backgroundColor: item.color }}
                            />
                          )}
                          <T>PROJECT_TOOTH</T> {toothNumber}
                          <CustomSpan fontSize={12} marginLeft={20}>
                            {indication.find(i => i.seq === item.preparationType)?.name}
                          </CustomSpan>
                        </div>

                        <div
                          className={cx('project__content_data_tooth_detail', {
                            on: !![...checkTooth.value].find(i => i === item.number),
                          })}
                        >
                          <Grid
                            container
                            spacing={2}
                            className="project__content_data_tooth_detail_grid_container"
                          >
                            <Grid item xs={12} className="project__content_data_tooth_detail_label">
                              - {indication.find(i => i.seq === item.preparationType)?.name}
                            </Grid>

                            <Grid item xs={12} className="project__content_data_tooth_detail_label">
                              -{' '}
                              {
                                indication
                                  .find(i => i.seq === item.preparationType)
                                  ?.list.find(o => o.id === item.indicationIdx)?.name
                              }
                            </Grid>

                            <Grid item xs={12} className="project__content_data_tooth_detail_label">
                              - {materialList.find(i => i.idx === item.material)?.name}
                            </Grid>

                            <Grid item xs={12} className="project__content_data_tooth_detail_label">
                              - {implantList.find(i => i.idx === item.implantType)?.type}
                            </Grid>

                            <Grid item xs={12} className="project__content_data_tooth_detail_label">
                              - <T>PROJECT_OPTION_GAP_WIDTH</T>
                            </Grid>
                            <Grid item xs={12} className="project__content_data_tooth_detail_text">
                              {item.gapWithCement}
                            </Grid>

                            <Grid item xs={12} className="project__content_data_tooth_detail_label">
                              - <T>PROJECT_OPTION_THICKNESS</T>
                            </Grid>
                            <Grid item xs={12} className="project__content_data_tooth_detail_text">
                              {item.minimalTickness}
                            </Grid>

                            <Grid item xs={12} className="project__content_data_tooth_detail_label">
                              - <T>PROJECT_OPTION_DIAMETER</T>
                            </Grid>
                            <Grid item xs={12} className="project__content_data_tooth_detail_text">
                              {item.millingToolDiameter}
                            </Grid>

                            <Grid item xs={12} className="project__content_data_tooth_detail_label">
                              - <T>PROJECT_OPTION_SCAN_PRE_OP</T>?
                            </Grid>
                            <Grid item xs={12} className="project__content_data_tooth_detail_text">
                              {item.situScan ? 'Yes' : 'No'}
                            </Grid>

                            <Grid item xs={12} className="project__content_data_tooth_detail_label">
                              - <T>PROJECT_OPTION_SCAN_GINGIVA</T>?
                            </Grid>
                            <Grid item xs={12} className="project__content_data_tooth_detail_text">
                              {item.separateGingivaScan ? 'Yes' : 'No'}
                            </Grid>
                          </Grid>
                        </div>
                      </li>
                    );
                  })}
              </ul>

              <ul className="project__content_data_tooth_design_list">
                {toothDesignList.map((item, idx) => (
                  <li className="project__content_data_tooth_design_item" key={idx}>
                    <div className="project__content_data_tooth_design_arrow_box">
                      <div className="project__content_data_tooth_design_arrow"></div>
                    </div>
                    <div className="project__content_data_tooth_design_name_box">
                      <div className="project__content_data_tooth_design_name">{item.name}</div>
                    </div>
                    <div className="project__content_data_tooth_design_img_box">
                      <img src={item.iconSrc} alt="tooth design icon" />
                    </div>
                  </li>
                ))}
              </ul>
            </Grid>
          </Grid>

          {/* file */}
          <div className="project__content_file_container">
            <h1>
              <CustomText fontSize={26} fontColor={color.blue} fontWeight={500} marginBottom={20}>
                File Upload
              </CustomText>
            </h1>

            <div className="project__content_file_box">
              <ProjectFileUpload
                divisionNumber={5}
                buttonContent={
                  <div className="project__content_file_download_btn_box">
                    <MuiButton
                      config={{
                        width: 150,
                      }}
                      variant="contained"
                      color="primary"
                      disableElevation
                      className="lg inset-shadow-default"
                      startIcon={<ShareIcon color="white" width={18} />}
                      onClick={() => setSyncProjectModalOpen(true)}
                    >
                      Sync
                    </MuiButton>
                  </div>
                }
              />
            </div>
          </div>
        </section>
      </StyledProject>
    </>
  );
}

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

  .project__content_container {
    ${paperStyle};
    position: relative;
    margin-top: 30px;

    .project__content_info_container {
      .project__content_info_box {
        width: 45%;
        border-right: 1px dashed #b5b7c1;
        padding-right: 55px;
        font-size: 15px;
        .project__content_info_title {
          margin-bottom: 20px;
        }

        .project__content_info_item {
          padding-left: 20px;
        }
        .project__content_info_item:not(.memo) {
          .project__content_info_label {
            width: 27%;
          }
          .project__content_info_text {
            width: 73%;
          }
        }
        .gold_status_btn {
          margin: 10px 0;
        }
      }
      .project__content_teeth_box {
        width: 32.5%;
        padding-left: 55px;
        padding-right: 55px;
        border-right: 1px dashed #b5b7c1;

        .project__content_teeth_numbering_box {
          display: flex;
          align-items: center;
          .project__content_teeth_numbering_badge {
            display: inline-flex;
            align-items: center;
            justify-content: center;
            width: 120px;
            height: 30px;
            background-color: ${color.blue};
            border-radius: 15px;
            font-size: 15px;
            color: white;
            font-weight: 500;
          }
          .project__content_teeth_shade {
            margin-left: 20px;
            font-size: 13px;
            color: #b5b7c1;
          }
        }

        .teethSvg {
          width: 340px;
          margin: 0 auto;
          margin-top: 40px;
        }
      }

      .project__content_data_box {
        width: 22.5%;
        padding-left: 30px;

        .project__content_data_tooth_list {
          position: relative;
          margin-top: 30px;
          height: 545px;
          max-height: 545px;
          overflow-y: auto;
          overflow-x: hidden;
          .project__content_data_tooth_item {
            & + .project__content_data_tooth_item {
              /* margin-top: 25px; */
              margin-top: 15px;
            }
            .project__content_data_tooth_number {
              display: flex;
              align-items: center;
              font-size: 18px;
              /* font-weight: 700; */
              cursor: pointer;
              .project__content_data_fold_icon {
                display: inline-flex;
                align-items: center;
                justify-content: center;
                width: 28px;
                height: 28px;
                margin-right: 15px;
                border-radius: 15px;
                color: #fff;
              }
            }
            .project__content_data_tooth_detail {
              padding-left: 45px;
              height: 0;
              transition: all 0.25s;
              overflow: hidden;
              font-size: 12px;
              &.on {
                height: 336px;
              }
              .project__content_data_tooth_detail_grid_container {
                margin-top: 0px;
              }
              .project__content_data_tooth_detail_label {
                font-weight: 500;
                letter-spacing: -0.3px;
              }
              .project__content_data_tooth_detail_text {
                margin-top: -10px;
                padding-left: 15px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
              }
            }
          }
        }

        .project__content_data_tooth_design_list {
          margin-top: 25px;
          .project__content_data_tooth_design_item {
            display: flex;
            align-items: center;
            .project__content_data_tooth_design_arrow_box {
              width: 30px;
              .project__content_data_tooth_design_arrow {
                border: 7px solid transparent;
                border-left-color: #b5b7c1;
              }
            }
            .project__content_data_tooth_design_name_box {
              width: 135px;
              margin-right: 30px;
              .project__content_data_tooth_design_name {
                font-size: 14px;
                line-height: 1.5;
              }
            }
            .project__content_data_tooth_design_img_box {
              display: flex;
              justify-content: center;
              position: relative;
              width: 42px;
              height: 42px;
              border-radius: 5px;
              box-shadow: 0 0 3px rgba(0, 0, 0, 0.16);
            }
            &:first-child {
              .project__content_data_tooth_design_img_box {
                align-items: flex-end;
                img {
                  height: 82%;
                }
              }
            }
            &:not(:first-child) {
              margin-top: 30px;
              .project__content_data_tooth_design_img_box {
                align-items: center;
                img {
                  width: 78%;
                }
              }
            }
          }
        }
      }
    }

    .project__content_file_container {
      margin-top: 50px;
      .project__content_file_box {
        .project__content_file_download_btn_box {
          display: flex;
          justify-content: flex-end;
          .button {
            margin-top: -20px;
            width: 150px;
            padding-top: 20px;
            height: 66px;
            border-bottom-left-radius: 15px;
            border-bottom-right-radius: 15px;
          }
        }
      }
    }
  }

  .form__label {
    display: inline-block;
    min-width: 115px;
    /* padding: 10px 30px 10px 20px; */
    padding: 10px 0px;
    font-size: 15px;
    font-weight: 500;
  }
`;

// const DownloadButton = () => {
//   return <StyledDownloadButton className="">
//     <T>GLOBAL_DOWNLOAD</T>
//   </StyledDownloadButton>
// }

// const StyledDownloadButton = styled.button`

// `

export default React.memo(ProjectInformation);
