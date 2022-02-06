import React, { Fragment, useContext, useMemo, useState } from 'react';
import styled from 'styled-components';
import CustomSpan from 'components/common/text/CustomSpan';
import { ButtonGroup, FormControl, Grid, MenuItem, Select, TextField } from '@material-ui/core';
import { Controller } from 'react-hook-form';
import MuiWrapper from 'components/common/input/MuiWrapper';
import { useEffect } from 'react';
import MuiButton from 'components/common/button/MuiButton';
import { color } from 'styles/utils';
import { paperBadgeStyle, paperStyle } from './ProjectShared';
import { StyledInShadowButtonOuter } from 'components/common/styled/Button';
import CustomText from 'components/common/text/CustomText';
import cx from 'classnames';
import CustomDatePicker from 'components/common/input/CustomDatePicker';
import AppModal from 'components/common/modal/AppModal';
import PlainModal from 'components/common/modal/PlainModal';
import { T } from 'components/common/text';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import ProjectListModalContainer from 'containers/project/ProjectListModalContainer';
import AsyncFetchSelect from 'components/common/select/AsyncFetchSelect';
import { useDidUpdateEffect } from 'lib/utils';
import { useShallowAppSelector } from 'store/hooks';
import moment from 'moment';
import { ProjectActions } from 'store/actionCreators';
import { useLocation, useParams } from 'react-router-dom';
import queryString from 'query-string';
import { cutUrl } from 'lib/library';
import { ProjectContext } from 'contexts/project/ProjectContext';

// Props와 export할 interface가 동일한 경우,
// 다른경우 interface와 props interface분리
export interface CreateProjectInformationProps {
  isValidInformationValue: boolean;
  projectPartners: {
    accountType: number;
    isSelf: number;
    name: string;
    userGroupIdx: number;
  }[];
  hasMoreProjectPartners: boolean;
  employeeList: {
    employeeIdx: number;
    userName: string;
    employeeNum: number;
    postPosition: string;
  }[];
  caseId: string;
  informationControl: any;
  informationErrors: object | any;
  setInformation: any;
  informationWatch: any;
  onFetchProjectPartners: () => void;
}
const CreateProjectInformation = ({
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
}: CreateProjectInformationProps) => {
  // console.log('-------------------------- render CreateProjectInformation');
  const {
    projectData: { projectInfo },
    reworkProjectData: { projectInfo: reworkProjectInfo },
  } = useShallowAppSelector(state => ({
    projectData: state.project.project.data || {},
    reworkProjectData: state.project.reworkProject.data || {},
  }));
  const { pcode } = useParams() as { pcode: string };
  const { pathname } = useLocation();
  const isEditPage = cutUrl(pathname, 1) === 'edit';
  const [isUnfoldCard, setIsUnfoldCard] = useState<boolean>(true);
  const [projectListModalOpen, setProjectListModalOpen] = useState(false);
  const { reworkProjectCode } = useContext(ProjectContext);

  // SECTION: function
  const handleCloseProjectListModal = () => {
    setProjectListModalOpen(false);
    if (!reworkProjectCode.value) setInformation('createType', 0);
  };

  // SECTION: DidMount
  useEffect(() => {
    return () => {
      ProjectActions.fetch_rework_project_clear();
      ProjectActions.fetch_project_clear();
    };
  }, []);

  // isValidInformationValue and isUnfold equalize
  // useEffect(() => {
  //   if (isValidInformationValue) return setIsUnfoldCard(false);
  // }, [isValidInformationValue]);

  // NOTE: controller rendering은 presenter component에서 default value 설정
  // reworkProjectCode와 reworkProjectInfo는 history.replace로 설정하여 둘다 의존성에 넣어줌
  useEffect(() => {
    let projectInfoData = null;
    if (pcode) projectInfoData = projectInfo;
    if (reworkProjectCode.value) {
      projectInfoData = reworkProjectInfo;
    }

    if (!(pcode || reworkProjectCode)) return;
    // react-hook-form
    setInformation('projectTitle', projectInfoData?.projectName || '');
    setInformation(
      'dueDate',
      projectInfoData?.dueDate ? moment.unix(projectInfoData?.dueDate) : null,
    );
    setInformation('senderMemo', projectInfoData?.senderMemo || '');
    setInformation('client', projectInfoData?.clientIdx || '');
    setInformation(
      'manager',
      typeof projectInfoData?.managerIdx === 'number' ? projectInfoData?.managerIdx : '',
    );
  }, [pcode, reworkProjectCode.value, reworkProjectInfo]);

  return (
    <>
      {/* Rework - ProjectListModal */}
      {useMemo(
        () => (
          <PlainModal
            isOpen={projectListModalOpen}
            onClose={handleCloseProjectListModal}
            width={1690}
          >
            <AppModal
              title={'Project List'}
              content={
                <ProjectListModalContainer onCloseProjectListModal={handleCloseProjectListModal} />
              }
              contentCardStyle={{
                padding: '30px 35px 25px',
              }}
              isCloseIcon={true}
              onClick={handleCloseProjectListModal}
              onCancel={handleCloseProjectListModal}
              hideButton={true}
            />
          </PlainModal>
        ),
        [projectListModalOpen],
      )}

      <StyledCreateProjectInformation
        data-component-name="CreateProjectInformation"
        isUnfoldCard={isUnfoldCard}
        isValidInformationValue={isValidInformationValue}
      >
        <Grid container className="projectInformation__container">
          <Grid item xs={12} className="projectInformation__title_box">
            <button
              className="button btn-reset projectInformation__title_btn"
              onClick={() => setIsUnfoldCard(draft => !draft)}
            >
              <span className="projectInformation__title_badge">1</span>
              <h1 className="projectInformation__title">Information</h1>
            </button>
          </Grid>

          <Grid item xs={12} className="projectInformation__content_box">
            <Grid container alignItems="flex-start" className="projectInformation__content">
              {/* 1 */}
              <Grid item className="projectInformation__content_item title">
                {!isEditPage && (
                  <Grid
                    container
                    alignItems="center"
                    className="projectInformation__form_item title"
                  >
                    <Grid item xs={3}>
                      <label htmlFor="" className="form__label">
                        Type
                        <CustomSpan fontColor={color.red}>*</CustomSpan>
                      </label>
                    </Grid>
                    <Grid item xs={9}>
                      <Controller
                        name="createType"
                        control={informationControl}
                        render={({ onChange, value }) => (
                          <ButtonGroup className="projectInformation__type_btn_group">
                            <MuiButton
                              className={cx('projectInformation__type_btn md', {
                                active: value === 0,
                              })}
                              data-type="radio"
                              onClick={() => onChange(0)}
                            >
                              New
                            </MuiButton>
                            <MuiButton
                              className={cx('projectInformation__type_btn md', {
                                active: value === 1,
                              })}
                              data-type="radio"
                              onClick={() => {
                                onChange(1);
                                setProjectListModalOpen(true);
                              }}
                            >
                              Re-work
                            </MuiButton>
                          </ButtonGroup>
                        )}
                      />
                    </Grid>
                  </Grid>
                )}

                <Grid container alignItems="center" className="projectInformation__form_item title">
                  <Grid item xs={3}>
                    <label htmlFor="" className="form__label">
                      <T>PROJECT_ID</T>
                      <CustomSpan fontColor={color.red}>*</CustomSpan>
                    </label>
                  </Grid>
                  <Grid item xs={9}>
                    <span
                      className="form__text"
                      dangerouslySetInnerHTML={{ __html: caseId }}
                    ></span>
                  </Grid>
                </Grid>

                <Grid container className="projectInformation__form_item title">
                  <Grid item xs={3}>
                    <label htmlFor="" className="form__label">
                      Client
                      <CustomSpan fontColor={color.red}>*</CustomSpan>
                    </label>
                  </Grid>
                  <Grid item xs={9}>
                    <Controller
                      name="clientType"
                      control={informationControl}
                      render={({ onChange, value }) => (
                        <ButtonGroup className="projectInformation__client_btn_group">
                          <MuiButton
                            className={cx('projectInformation__client_btn md', {
                              active: value === 0,
                            })}
                            data-type="radio"
                            onClick={() => onChange(0)}
                          >
                            Clinic
                          </MuiButton>
                          <MuiButton
                            className={cx('projectInformation__client_btn md', {
                              active: value === 1,
                            })}
                            data-type="radio"
                            onClick={() => onChange(1)}
                          >
                            Laboratory
                          </MuiButton>
                          {/* <MuiButton
                            className={cx('projectInformation__client_btn md', {
                              active: value === 2,
                            })}
                            data-type="radio"
                            onClick={() => onChange(2)}
                          >
                            Both
                          </MuiButton> */}
                        </ButtonGroup>
                      )}
                    />

                    <Controller
                      name="client"
                      control={informationControl}
                      defaultValue=""
                      rules={{ required: true }}
                      render={({ onChange, value }) => (
                        <AsyncFetchSelect
                          className="form__input_box client__select_box"
                          fullWidth
                          drondownHeight="200px"
                          inputProps={{
                            defaultValue: value,
                            selectedValue: value,
                            setSelectedValue: onChange,
                            data: projectPartners,
                            hasMoreData: hasMoreProjectPartners,
                            idKey: 'userGroupIdx',
                            labelKey: 'name',
                            onFetch: onFetchProjectPartners,
                            fetchType: 'fetch',
                            // searchLoading: fetchProjectPartnersPending,
                          }}
                        />
                      )}
                    />
                    {informationErrors.client?.type === 'required' && (
                      <div className="form__valid_text">
                        <T>REGISTER_REQUIRED</T>
                      </div>
                    )}
                    <CustomText fontColor={color.blue} fontSize={12} marginTop={5}>
                      * Additional dental registration can be done on the Partner page.
                    </CustomText>
                  </Grid>
                </Grid>

                <Grid container alignItems="center" className="projectInformation__form_item title">
                  <Grid item xs={3}>
                    <label htmlFor="" className="form__label">
                      <T>PROJECT_NAME</T>
                      <CustomSpan fontColor={color.red}>*</CustomSpan>
                    </label>
                  </Grid>
                  <Grid item xs={9}>
                    <Controller
                      name="projectTitle"
                      control={informationControl}
                      defaultValue=""
                      rules={{ required: true }}
                      render={({ onChange, value }) => (
                        <MuiWrapper>
                          <TextField
                            className="radius-md form__input_box"
                            variant="outlined"
                            fullWidth
                            placeholder="Please enter it"
                            error={informationErrors.projectTitle?.type === 'required'}
                            value={value}
                            onChange={onChange}
                          />
                        </MuiWrapper>
                      )}
                    />
                    {informationErrors.projectTitle?.type === 'required' && (
                      <div className="form__valid_text">
                        <T>REGISTER_REQUIRED</T>
                      </div>
                    )}
                  </Grid>
                </Grid>

                <Grid container alignItems="center" className="projectInformation__form_item title">
                  <Grid item xs={3}>
                    <label htmlFor="" className="form__label">
                      <T>PROJECT_DUE_DATE</T>
                      <CustomSpan fontColor={color.red}>*</CustomSpan>
                    </label>
                  </Grid>
                  <Grid item xs={9}>
                    <Controller
                      name="dueDate"
                      control={informationControl}
                      rules={{ required: true }}
                      render={({ onChange, value }) => (
                        <CustomDatePicker
                          fullWidth
                          borderColor={color.gray_week}
                          height={40}
                          // disabledDate
                          value={value}
                          onChange={onChange}
                          className={cx({
                            error: informationErrors.dueDate?.type === 'required',
                          })}
                        />
                      )}
                    />
                    {informationErrors.dueDate?.type === 'required' && (
                      <div className="form__valid_text">
                        <T>REGISTER_REQUIRED</T>
                      </div>
                    )}
                  </Grid>
                </Grid>

                <Grid container alignItems="center" className="projectInformation__form_item title">
                  <Grid item xs={3}>
                    <label htmlFor="" className="form__label">
                      <T>PROJECT_MANAGER</T>
                    </label>
                  </Grid>
                  <Grid item xs={9}>
                    <Controller
                      name="manager"
                      control={informationControl}
                      defaultValue=""
                      // rules={{ required: true }}
                      render={({ onChange, value }) => (
                        <MuiWrapper className="form__input_box" isGlobalStyle>
                          <FormControl
                            fullWidth
                            variant="outlined"
                            error={informationErrors.client?.type === 'required'}
                          >
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
                              // multiple
                              // name="preferedProgram"
                              value={value}
                              onChange={onChange}
                              // renderValue={selected => {
                              //   if (selected.length === 0) return '';
                              //   const selectedLabelList = toolList.reduce((acc, curr) => {
                              //     if (selected.includes(curr.id)) return acc.concat(curr.label);
                              //     return acc;
                              //   }, []);

                              //   return selectedLabelList.join(', ');
                              // }}
                            >
                              <MenuItem value="" disabled>
                                <CustomSpan fontColor={'#00000065'}>
                                  Select from the list
                                </CustomSpan>
                              </MenuItem>
                              {!!employeeList?.length &&
                                employeeList.map((item, idx) => (
                                  <MenuItem key={idx} value={item.employeeIdx}>
                                    {item.userName}
                                  </MenuItem>
                                ))}
                            </Select>
                          </FormControl>
                        </MuiWrapper>
                      )}
                    />
                    {/* {informationErrors.manager?.type === 'required' && (
                          <div className="form__valid_text">
                            <T>REGISTER_REQUIRED</T>
                          </div>
                        )} */}
                  </Grid>
                </Grid>
              </Grid>

              {/* 2 */}
              <Grid item container className="projectInformation__content_item memo">
                <Grid item container className="projectInformation__form_item memo">
                  <Grid item>
                    <label htmlFor="" className="form__label">
                      {/* <T>PROJECT_MEMO</T> */}
                      My Memo
                    </label>
                  </Grid>
                  <Grid item>
                    <Controller
                      name="senderMemo"
                      control={informationControl}
                      render={({ onChange, value }) => (
                        <MuiWrapper config={{ height: 'auto' }}>
                          <TextField
                            multiline
                            rows={25}
                            variant="outlined"
                            fullWidth
                            value={value}
                            onChange={onChange}
                          />
                        </MuiWrapper>
                      )}
                    />
                  </Grid>
                </Grid>
              </Grid>
              {/* // */}
            </Grid>
          </Grid>
        </Grid>

        <StyledInShadowButtonOuter height={66} right={110} width={220}>
          <MuiButton
            config={{
              width: '200px',
            }}
            disabled={!isValidInformationValue}
            disableElevation
            variant="contained"
            onClick={() => setIsUnfoldCard(draft => !draft)}
            className="xl border-radius-round inset-shadow-default projectInformation__next_btn"
            endIcon={<ExpandMoreIcon style={{ fontSize: '34px' }} />}
          >
            Next
          </MuiButton>
        </StyledInShadowButtonOuter>
      </StyledCreateProjectInformation>
    </>
  );
};

export default React.memo(CreateProjectInformation);

const StyledCreateProjectInformation = styled.section<{
  isUnfoldCard: boolean;
  isValidInformationValue: boolean;
}>`
  ${paperStyle};
  position: relative;
  margin-top: 30px;
  background-color: white;
  .projectInformation__title_box {
    .projectInformation__title_btn {
      display: flex;
      align-items: center;
    }
    .projectInformation__title_badge {
      ${paperBadgeStyle};
      border-color: ${color.blue};
      color: ${({ isValidInformationValue }) => (isValidInformationValue ? 'white' : color.blue)};
      background-color: ${({ isValidInformationValue }) => isValidInformationValue && color.blue};
    }
    .projectInformation__title {
      font-size: 26px;
    }
  }
  .projectInformation__content_box {
    max-height: ${({ isUnfoldCard }) => (isUnfoldCard ? 700 : 0)}px;
    overflow: hidden;
    transition: max-height 0.25s;
    .projectInformation__content {
      margin-top: 25px;
      padding: 0 85px 30px;
      width: 100%;
      .projectInformation__content_item {
        &.title {
          width: 50%;
          padding-right: 50px;

          .projectInformation__form_item {
            > .MuiGrid-item {
              &:nth-child(2) {
                /* width: 370px; */
                max-width: 370px;
                flex-basis: 370px;
              }
            }
          }
          .projectInformation__type_btn_group {
            width: 100%;
            .projectInformation__type_btn {
              /* min-width: 125px; */
              width: 30%;
            }
          }
          .projectInformation__client_btn_group {
            width: 100%;
            .projectInformation__client_btn {
              width: 50%;
            }
          }
        }

        &.memo {
          width: 50%;
          height: 450px;
          padding-left: 50px;
          border-left: 1px dashed #b5b7c1;

          .projectInformation__form_item.memo {
            > .MuiGrid-item {
              &:nth-child(1) {
                width: 12%;
              }
              &:nth-child(2) {
                width: 88%;
              }
            }
          }
        }

        .projectInformation__form_item {
          padding-top: 15px;
          padding-bottom: 15px;
          .form__label {
            display: inline-block;
            padding: 12px 0;
            font-size: 15px;
            font-weight: 500;
          }
          .client__select_box {
            margin-top: 10px;
          }
          .form__valid_text {
            position: relative;
            top: 5px;
            height: 0;
            font-size: 12px;
            color: ${color.red};
          }
        }
      }
    }
  }

  .projectInformation__next_btn_box {
    position: absolute;
    bottom: 0;
    right: 125px;
    transform: translateY(50%);
    padding: 10px;
    /* background-color: white; */
    &:before {
      content: '';
      display: block;
      position: absolute;
      top: 50%;
      left: 50%;
      width: 98.5%;
      height: 39px;
      background-color: red;
      transform: translate(-50%, 0px);
      background-color: white;
    }
    &:after {
      content: '';
      display: block;
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 66px;
      border-top-left-radius: 39px;
      border-top-right-radius: 39px;
      box-shadow: inset 0 0 10px rgba(0, 0, 0, 0.16);
      clip: rect(0px, 220px, 39px, 0px);
    }
    .projectInformation__next_btn {
      z-index: 1;
    }
  }
`;

// content={
//   <AppModal
//     isOpen={true}
//     isCloseIcon={true}
//     title="Agreement"
//     content={
//       <div>
//         <CustomText fontSize={21}>Agreement of Participation</CustomText>
//         <CustomText fontSize={15} marginTop={20}>
//           I confirmed that the project does not contain any personal information specified
//           in the terms and conditions.
//         </CustomText>
//         <CustomText fontSize={13} fontColor={color.blue} marginTop={10}>
//           <span style={{ textDecoration: 'underline' }}>Privacy Policy</span> |{' '}
//           <span style={{ textDecoration: 'underline' }}>Terms of Service</span>
//         </CustomText>
//       </div>
//     }
//     okLink="/dashboard"
//   />
// }
// content={<div style={{ backgroundColor: 'white', height: '100px' }}>HiHi </div>}
