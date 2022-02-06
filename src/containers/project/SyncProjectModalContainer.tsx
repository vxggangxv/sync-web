import React, { useState } from 'react';
import styled from 'styled-components';
import cx from 'classnames';
import { color } from 'styles/utils';
import MuiWrapper from 'components/common/input/MuiWrapper';
import { Grid, TextField } from '@material-ui/core';
import useInput from 'lib/hooks/useInput';
import { icon_change, icon_magnifier, icon_trash, icon_user_circle } from 'components/base/images';
import MuiButton from 'components/common/button/MuiButton';
import { number } from 'prop-types';
import CustomSpan from 'components/common/text/CustomSpan';
import CustomMuiCheckbox from 'components/common/checkbox/CustomMuiCheckbox';
import ProjectFileUpload from 'components/project/ProjectFileUpload';
import { T } from 'components/common/text';
import ShareIcon from 'components/base/icons/ShareIcon';
import DownloadIcon from 'components/base/icons/DownloadIcon';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';
import DoubleArrowIcon from '@material-ui/icons/DoubleArrow';
import RedoIcon from '@material-ui/icons/Redo';
import { AppActions } from 'store/actionCreators';
import CustomText from 'components/common/text/CustomText';

interface SyncProjectModalContainerProps {}

function SyncProjectModalContainer() {
  const [step, setStep] = useState(2);
  const keyword = useInput('');
  const memo = useInput('asdfasdfasdfasdf');
  const [checkedLocalFileAll, setCheckedLocalFileAll] = useState(false);
  const [checkedCloudFileAll, setCheckedCloudFileAll] = useState(false);
  const [selectedPartnerId, setSelectedPartnerId] = useState<number | null>(null);
  const [syncPartnerId, setSyncPartnerId] = useState<number | null>(null);
  const [movedCloudFileList, setMovedCloudFileList] = useState<any[]>([]);
  // TODO: api mapping
  const partnerListLength = 15;
  const checkedLocalFiles = useCheckSetInput(new Set([]));
  const checkedCloudFiles = useCheckSetInput(new Set([]));

  // method
  const handleSearchPartner = () => {};

  // TODO:
  const handleSelectPartner = (id: number) => {
    // select클릭 후 syncPartnerId설정 - 1단계 완료, 2단계로 이동
    setSyncPartnerId(1);
    setStep(2);
  };

  // TEMP: 임시 데이터
  const localFilesData = Array.from({ length: 50 }).map((item, idx) => ({
    id: idx,
    name: `abuntment_${idx}.stl`,
  }));
  let cloudFilesData: any[] = [];
  cloudFilesData = Array.from({ length: 50 }).map((item, idx) => ({
    id: idx,
    name: `abuntment_${idx}.stl`,
  }));

  // TODO: local, cloud 파일의 id
  const handleCheckLocalFileAll = (e: any) => {
    const isChecked = e.target.checked;
    setCheckedLocalFileAll(isChecked);
    if (isChecked) {
      // 받은 파일의 id 넣기
      const fileIdList = localFilesData.map(item => item.id);
      checkedLocalFiles.setValue(new Set(fileIdList));
    } else {
      // 받은 파일의 id 빼기
      checkedLocalFiles.setValue(new Set([]));
    }
  };
  const handleCheckCloudFileAll = (e: any) => {
    const isChecked = e.target.checked;
    setCheckedCloudFileAll(isChecked);
    if (isChecked) {
      // 받은 파일의 id 넣기
      const fileIdList = cloudFilesData.map(item => item.id);
      checkedCloudFiles.setValue(new Set(fileIdList));
    } else {
      // 받은 파일의 id 빼기
      checkedCloudFiles.setValue(new Set([]));
    }
  };

  const handleMoveLocalToCloud = () => {
    // console.log('movedCloudFileList', movedCloudFileList);
    // 체크된 것과 추가될 것등 동기화
    const localFileList = localFilesData.filter(item =>
      [...checkedLocalFiles.value].includes(item.id),
    );
    setMovedCloudFileList(localFileList);
    // 별도 추가 가능하게 할 경우
    // const localFileIdListToAdd = [...checkedLocalFiles.value].filter(
    //   item => !movedCloudFileList.find(i => i.id === item),
    // );
    // const localFileListToAdd = localFilesData.filter(item =>
    //   localFileIdListToAdd.includes(item.id),
    // );
    // setMovedCloudFileList([...movedCloudFileList, ...localFileListToAdd]);
  };

  // changeIcon click in profile
  const handleChangeSyncPartner = (id: number) => {
    // TODO: partnerId를 sender, receiver로 비교하여 반대값 설정
    // let syncId = null;
    // if (id === senderId) {
    //   syncId = receiverId
    // } else {
    //   syncId = senderId
    // }
    setSyncPartnerId(2);
  };

  const handleSync = () => {
    // memo.value, selectedPartnerId, checkedFile

    let isOk = false;

    AppActions.add_popup({
      isOpen: true,
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
            <span style={{ textDecoration: 'underline' }}>Privacy Policy</span> |{' '}
            <span style={{ textDecoration: 'underline' }}>Terms of Service</span>
          </CustomText>
        </div>
      ),
      // okLink: '/dashboard',
      onClick: () => {
        // request api
        isOk = true;
        console.log('isOk', isOk);
      },
    });

    console.log('isOk', isOk);
  };

  return (
    <StyledSyncProjectModalContainer data-component-name="SyncProjectModalContainer">
      <div className="syncProjectModal__step_box">
        <div className="syncProjectModal__step_partner">
          <button
            className={cx('btn-reset syncProjectModal__step_btn', { active: step === 1 })}
            onClick={() => setStep(1)}
          >
            <span className="syncProjectModal__step_number">1</span>
            <span className="syncProjectModal__step_text">Select the Partner</span>
          </button>
        </div>

        <div className="syncProjectModal__step_division">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="60" viewBox="0 0 15 60">
            <defs>
              <clipPath id="clip-path">
                <rect
                  id="사각형_4721"
                  data-name="사각형 4721"
                  width="15"
                  height="60"
                  transform="translate(958 205)"
                  fill="#fff"
                  stroke="#707070"
                  strokeWidth="1"
                />
              </clipPath>
            </defs>
            <g
              id="마스크_그룹_505"
              data-name="마스크 그룹 505"
              transform="translate(-958 -205)"
              clipPath="url(#clip-path)"
            >
              <path
                id="패스_29747"
                data-name="패스 29747"
                d="M-1089.443-4848l13.357,31.373-13.357,30.724"
                transform="translate(2048 5051.903)"
                fill="none"
                stroke="#dadada"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
              />
            </g>
          </svg>
        </div>

        <div className="syncProjectModal__step_data">
          <button
            className={cx('btn-reset syncProjectModal__step_btn', { active: step === 2 })}
            onClick={() => setStep(2)}
          >
            <span className="syncProjectModal__step_number">2</span>
            <span className="syncProjectModal__step_text">Select the Data</span>
          </button>
        </div>
      </div>

      <div className="syncProjectModal__content_container">
        {step === 1 && (
          <div className="syncProjectModal__partner_content_container">
            <MuiWrapper
              className="syncProjectModal__partner_search_wrapper lg"
              config={{
                borderColor: 'transparent',
                activeBorderColor: 'transparent',
                hoverBorderColor: 'transparent',
              }}
            >
              <>
                <TextField
                  className="radius-md"
                  variant="outlined"
                  fullWidth
                  placeholder="Search for the Partner"
                  value={keyword.value || ''}
                  onChange={keyword.onChange}
                  onKeyPress={e => e.key === 'Enter' && handleSearchPartner()}
                />
                <button
                  className="btn-reset syncProjectModal__partner_search_btn"
                  onClick={handleSearchPartner}
                >
                  <img src={icon_magnifier} alt="search" />
                </button>
              </>
            </MuiWrapper>

            <div className="syncProjectModal__partner_list_table">
              <Grid container className="syncProjectModal__partner_list_thead">
                <Grid item container className="syncProjectModal__partner_list_row">
                  <Grid
                    item
                    container
                    alignItems="center"
                    justifyContent="center"
                    className="syncProjectModal__partner_list_th"
                  >
                    No
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    className="syncProjectModal__partner_list_th"
                  >
                    Partner Name
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    className="syncProjectModal__partner_list_th"
                  >
                    Type
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    justifyContent="center"
                    className="syncProjectModal__partner_list_th"
                  ></Grid>
                </Grid>
              </Grid>
              <Grid container className="syncProjectModal__partner_list_tbody">
                <Grid item container className="syncProjectModal__partner_list_row">
                  <Grid
                    item
                    container
                    alignItems="center"
                    justifyContent="center"
                    className="syncProjectModal__partner_list_td"
                  >
                    1
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    className="syncProjectModal__partner_list_td"
                  >
                    <div className="syncProjectModal__partner_list_text_overflow_box text-overflow-ellipis">
                      웃는내일치과웃는내일치과웃는내일치과웃는내일치과웃는내일치과웃는내일치과웃는내일치과웃는내일치과
                    </div>
                    <span className="syncProjectModal__partner_list_badge">Me</span>
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    className="syncProjectModal__partner_list_td"
                  >
                    기공소
                  </Grid>
                  <Grid
                    item
                    container
                    alignItems="center"
                    justifyContent="center"
                    className="syncProjectModal__partner_list_td"
                  >
                    <MuiButton
                      config={{
                        bgColor: '#fff',
                        borderColor: color.gray_week,
                        width: '120px',
                      }}
                      variant="outlined"
                      disableElevation
                      className="sm border-radius-round syncProjectModal__partner_list_select_btn"
                      onClick={() => handleSelectPartner(1)}
                    >
                      Select
                    </MuiButton>
                  </Grid>
                </Grid>

                {Array.from({ length: partnerListLength - 1 }).map((item, idx) => (
                  <Grid item container key={idx + 2} className="syncProjectModal__partner_list_row">
                    <Grid
                      item
                      container
                      alignItems="center"
                      justifyContent="center"
                      className="syncProjectModal__partner_list_td"
                    >
                      {idx + 2}
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      className="syncProjectModal__partner_list_td"
                    >
                      우리기공소
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      className="syncProjectModal__partner_list_td"
                    >
                      기공소
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      justifyContent="center"
                      className="syncProjectModal__partner_list_td"
                    >
                      <MuiButton
                        config={{
                          bgColor: '#fff',
                          borderColor: color.gray_week,
                          width: '120px',
                        }}
                        variant="outlined"
                        disableElevation
                        className="sm border-radius-round syncProjectModal__partner_list_select_btn"
                        onClick={() => setSelectedPartnerId(idx)}
                      >
                        Select
                      </MuiButton>
                    </Grid>
                  </Grid>
                ))}
              </Grid>
            </div>
          </div>
        )}
        {step === 2 && (
          <div className="syncProjectModal__data_content_container">
            <div className="syncProjectModal__data_file_list_container local">
              <div className="syncProjectModal__data_file_list_title_box">
                <label className="inline-flex-center">
                  <CustomMuiCheckbox
                    name="checkedLocalFileAll"
                    checked={checkedLocalFileAll}
                    onChange={handleCheckLocalFileAll}
                  />
                  <CustomSpan fontSize={15} fontWeight={700} fontColor={color.navy_blue}>
                    [ Local ]
                  </CustomSpan>
                </label>
              </div>
              <div className="syncProjectModal__data_file_list_box">
                <ProjectFileUpload
                  files={localFilesData}
                  hasCheckbox
                  checkedFiles={checkedLocalFiles}
                  listHeight={550}
                />
              </div>
              <div className="syncProjectModal__data_file_list_btn_box">
                <MuiButton
                  config={{
                    width: 150,
                  }}
                  variant="contained"
                  color="primary"
                  disableElevation
                  className="inset-shadow-default"
                  // startIcon={<ShareIcon color="white" width={18} />}
                  startIcon={<DoubleArrowIcon />}
                  // startIcon={<RedoIcon />}
                  disabled={!checkedLocalFiles.value.size}
                  onClick={handleMoveLocalToCloud}
                >
                  Move
                </MuiButton>
              </div>
            </div>

            <div className="syncProjectModal__data_file_list_container cloud">
              <div className="syncProjectModal__data_file_list_title_box">
                <label className="inline-flex-center">
                  <CustomMuiCheckbox
                    name="checkedCloudFileAll"
                    checked={checkedCloudFileAll}
                    onChange={handleCheckCloudFileAll}
                  />
                  <CustomSpan fontSize={15} fontWeight={700} fontColor={color.navy_blue}>
                    [ Cloud ]
                  </CustomSpan>
                </label>
              </div>
              <div className="syncProjectModal__data_file_list_box">
                <ProjectFileUpload
                  files={[...movedCloudFileList, ...cloudFilesData]}
                  hasCheckbox
                  checkedFiles={checkedCloudFiles}
                  listHeight={550}
                />
              </div>
              <div className="syncProjectModal__data_file_list_btn_box">
                <button className="btn-reset flex-center syncProjectModal__data_file_list_delete_btn">
                  <img src={icon_trash} alt="delete" width={13} />
                  <CustomSpan
                    fontSize={13}
                    fontColor={color.gray_week}
                    marginLeft={10}
                    style={{ textDecoration: 'underline' }}
                  >
                    Delete
                  </CustomSpan>
                </button>

                <MuiButton
                  config={{
                    width: 150,
                  }}
                  variant="contained"
                  color="secondary"
                  disableElevation
                  className="inset-shadow-default"
                  startIcon={
                    <DownloadIcon
                      color={!checkedCloudFiles.value.size ? color.btn_disabled_text : 'white'}
                      width={18}
                    />
                  }
                  disabled={!checkedCloudFiles.value.size}
                  onClick={() => {}}
                >
                  Download
                </MuiButton>
              </div>
            </div>

            <div className="syncProjectModal__data_info_container">
              {/* TODO: project partner가 나 자신인지 체크 */}
              <div className="syncProjectModal__profile_box">
                <button
                  className="syncProjectModal__profile_icon_btn btn-reset"
                  onClick={() => handleChangeSyncPartner(1)}
                >
                  <img src={icon_change} alt="change" />
                </button>

                <div className="syncProjectModal__profile_in">
                  <figure className="syncProjectModal__profile">
                    <img src={icon_user_circle} alt="profile" />
                    {/* {user?.profileImg ? (
                      <ImgCrop width={52} isCircle src={user.profileImg} />
                    ) : (
                      <img src={icon_user_circle} alt="account" />
                    )} */}
                  </figure>
                  <p className="syncProjectModal__nickname text-overflow-ellipis">{'Nickname'}</p>
                  <p className="syncProjectModal__clinic text-overflow-ellipis">
                    Clinic: {'Dental lab'}
                  </p>
                  <p className="syncProjectModal__email text-overflow-ellipis">
                    {'info@asmiledental.com'}
                  </p>
                </div>
              </div>

              <div className="syncProjectModal__data_info_memo">
                {/* TODO: sender일 경우 입력 가능 */}
                <div className="syncProjectModal__data_info_memo_label">
                  <label htmlFor="" className="form__label">
                    <T>PROJECT_MEMO</T>
                  </label>
                </div>
                <div className="syncProjectModal__data_info_memo_text">
                  <MuiWrapper config={{ height: 'auto' }}>
                    <TextField
                      multiline
                      rows={25}
                      variant="outlined"
                      fullWidth
                      value={memo.value}
                      onChange={memo.onChange}
                      InputProps={{
                        readOnly: false,
                      }}
                    />
                  </MuiWrapper>
                </div>
                <div className="syncProjectModal__data_info_memo_btn_box">
                  <MuiButton
                    config={{
                      width: 250,
                    }}
                    variant="contained"
                    color="secondary"
                    disableElevation
                    className="inset-shadow-default"
                    // startIcon={<DownloadIcon color="white" width={18} />}
                    // disabled={!checkedCloudFiles.value.size}
                    onClick={handleSync}
                  >
                    Sync
                  </MuiButton>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </StyledSyncProjectModalContainer>
  );
}

const StyledSyncProjectModalContainer = styled.div`
  .syncProjectModal__step_box {
    display: flex;
    align-items: center;
    height: 60px;
    padding: 0 30px;
    border-radius: 8px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.16);
    .syncProjectModal__step_partner {
    }
    .syncProjectModal__step_data {
    }
    .syncProjectModal__step_btn {
      font-size: 13px;
      color: ${color.gray_week};
      .syncProjectModal__step_number {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        width: 30px;
        height: 30px;
        margin-right: 12px;
        border: 1px solid ${color.gray_week};
        border-radius: 50%;
        font-size: 16px;
      }
      .syncProjectModal__step_text {
      }
      &.active {
        color: ${color.blue};
        .syncProjectModal__step_number {
          border-color: ${color.blue};
        }
        .syncProjectModal__step_text {
          text-decoration: underline;
        }
      }
    }
    .syncProjectModal__step_division {
      margin: 0 15px;
      padding-right: 5px;
      line-height: 0;
    }
  }

  .syncProjectModal__content_container {
    padding: 30px;

    .syncProjectModal__partner_content_container {
      .syncProjectModal__partner_search_wrapper {
        position: relative;
        margin-top: -1px;
        width: 100%;
        .MuiInputBase-root {
          background-color: #f4f5fa;
        }
        .syncProjectModal__partner_search_btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          position: absolute;
          right: 0;
          top: 0;
          width: 46px;
          height: 46px;
          border-top-right-radius: 5px;
          border-bottom-right-radius: 5px;
          background-color: ${color.navy_blue};
        }
      }

      .syncProjectModal__partner_list_table {
        position: relative;
        margin-top: 20px;
        width: 100%;

        .syncProjectModal__partner_list_th,
        .syncProjectModal__partner_list_td {
          padding: 0 10px;
          height: 55px;
          font-size: 15px;

          &:nth-child(1) {
            width: 8%;
            padding-right: 50px;
          }
          &:nth-child(2) {
            width: 27%;
          }
          &:nth-child(3) {
            width: 50%;
          }
          &:nth-child(4) {
            width: 15%;
          }
        }
        .syncProjectModal__partner_list_th {
          color: white;
          font-size: 17px;
        }
        .syncProjectModal__partner_list_td {
          /* height: 60px; */
          border-bottom: 1px solid #eff1f8;
        }
        .syncProjectModal__partner_list_row {
          width: 100%;

          &:last-child .syncProjectModal__partner_list_td {
            border-bottom-color: transparent;
          }
        }

        .syncProjectModal__partner_list_thead,
        .syncProjectModal__partner_list_tbody {
          padding: 0 30px;
        }
        .syncProjectModal__partner_list_thead {
          margin-bottom: -20px;
          padding-bottom: 20px;
          background-color: ${color.navy_blue};
          box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.16);
          border-radius: 15px;
        }
        .syncProjectModal__partner_list_tbody {
          max-height: 550px;
          overflow-y: overlay;
          background-color: white;
          box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.16);
          border-radius: 15px;

          .syncProjectModal__partner_list_row {
            &:hover {
              background-color: rgba(51, 181, 228, 0.1);
            }
          }
        }

        .syncProjectModal__partner_list_text_overflow_box {
          display: inline-block;
          width: calc(100% - 88px);
        }
        .syncProjectModal__partner_list_badge {
          display: inline-block;
          margin-left: 20px;
          padding: 3px 25px;
          border: 1px solid ${color.blue};
          border-radius: 15px;
          font-size: 11px;
          color: ${color.blue};
        }
        .syncProjectModal__partner_list_select_btn {
          &:hover {
            color: #fff !important;
            background-color: ${color.blue} !important;
            border-color: ${color.blue} !important;
          }
        }
      }
    }

    .syncProjectModal__data_content_container {
      display: flex;
      justify-content: space-between;

      .syncProjectModal__data_file_list_title_box {
        display: flex;
        align-items: center;
        padding-left: 5px;
        background-color: white;
        border: 4px solid #fafafd;
        border-top-left-radius: 5px;
        border-top-right-radius: 5px;
        user-select: none;
      }
      .syncProjectModal__data_file_list_container {
        width: 516px;
        border-radius: 10px;

        .syncProjectModal__data_file_list_box {
          position: relative;
          z-index: 1;
          padding: 15px 0 15px;
          background-color: #fafafd;
          border-bottom-left-radius: 10px;
          border-bottom-right-radius: 10px;
        }
        .syncProjectModal__data_file_list_btn_box {
          display: flex;
          align-items: center;
          justify-content: flex-end;
          .button {
            margin-top: -20px;
            width: 150px;
            padding-top: 20px;
            height: 60px;
            border-bottom-left-radius: 15px;
            border-bottom-right-radius: 15px;
          }
          .syncProjectModal__data_file_list_delete_btn {
            position: relative;
            top: 1px;
            margin-right: 30px;
          }
        }

        &.local {
        }
        &.cloud {
        }
      }
      .syncProjectModal__data_info_container {
        width: 250px;

        .syncProjectModal__profile_box {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          /* width: 265px;
          height: 290px; */
          padding: 15px 10px;
          background-color: #fafafd;
          border: 1px solid ${color.navy_blue};
          border-radius: 5px;

          .syncProjectModal__profile_icon_btn {
            display: flex;
            align-items: center;
            justify-content: center;
            position: absolute;
            top: 0;
            left: 0;
            width: 27px;
            height: 27px;
            background-color: ${color.navy_blue};
            /* border-top-left-radius: 5px; */
            border-bottom-right-radius: 5px;
          }
          .syncProjectModal__profile_in {
            width: 100%;
            text-align: center;
          }
          .syncProjectModal__profile {
            img {
              width: 75px;
              height: 75px;
            }
          }
          .syncProjectModal__nickname {
            margin-top: 15px;
            font-size: 12px;
            font-weight: 700;
          }
          .syncProjectModal__clinic,
          .syncProjectModal__email {
            font-size: 12px;
          }
          .syncProjectModal__clinic {
            margin-top: 10px;
          }
          .syncProjectModal__email {
            margin-top: 5px;
          }
        }
        .syncProjectModal__data_info_memo {
          margin-top: 30px;
          .syncProjectModal__data_info_memo_label {
            font-size: 13px;
            font-weight: 500;
          }
          .syncProjectModal__data_info_memo_text {
            margin-top: 10px;
            textarea {
              height: 380px;
              font-size: 12px;
            }
          }
          .syncProjectModal__data_info_memo_btn_box {
            margin-top: -11px;
          }
        }
      }
    }
  }
`;

export default React.memo(SyncProjectModalContainer);
