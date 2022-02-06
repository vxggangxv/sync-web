import { Grid, IconButton } from '@material-ui/core';
import PublishIcon from '@material-ui/icons/Publish';
import cx from 'classnames';
import DownloadIcon from 'components/base/icons/DownloadIcon';
import EyeIcon from 'components/base/icons/EyeIcon';
import TrashIcon from 'components/base/icons/TrashIcon';
import { icon_folder_plus, icon_upload } from 'components/base/images';
import CircularLoading from 'components/base/loading/CircularLoading';
import MuiButton from 'components/common/button/MuiButton';
import CustomCheckbox from 'components/common/checkbox/CustomCheckbox';
import DropzoneWrapper from 'components/common/dropzone/DropzoneWrapper';
import AsyncFetchSelect from 'components/common/select/AsyncFetchSelect';
import CustomSpan from 'components/common/text/CustomSpan';
import T from 'components/common/text/T';
import ProjectModelViewer from 'components/project/ProjectModelViewer';
import { CloudFile, ProjectContext } from 'contexts/project/ProjectContext';
import { cutUrl } from 'lib/library';
import { fileExtensionList } from 'lib/mapper';
import { useDidUpdateEffect } from 'lib/utils';
import _ from 'lodash';
import moment from 'moment';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { FileActions, ProjectActions } from 'store/actionCreators';
import { useShallowAppSelector } from 'store/hooks';
import styled from 'styled-components';
import { color } from 'styles/utils';

const imgTypes = ['png', 'jpg', 'jpeg', 'gif'];
const modelTypes = ['obj', 'ply', 'stl'];

interface ProjectUploadProps {
  hasViewer: boolean;
  hasUpload: boolean;
  viewType?: string;
  isEdit?: boolean;
  checkAllLocal: {
    value: any;
    onChange: (e: any) => void;
    setValue: React.Dispatch<any>;
  };
  checkAllCloud: {
    value: any;
    onChange: (e: any) => void;
    setValue: React.Dispatch<any>;
  };
  localFileInput: {
    value: any;
    onChange: (e: any) => void;
    setValue: React.Dispatch<any>;
    reset: () => void;
  };
  localFileInputRef: React.MutableRefObject<any>;
  localFileListCt: any;
  partnerFileList: {
    value: any;
    onChange: (e: any) => void;
    setValue: React.Dispatch<any>;
  };
  cloudFileList: {
    value: any;
    onChange: (e: any) => void;
    setValue: React.Dispatch<any>;
  };
  viewModelFile: {
    value: any;
    onChange: (e: any) => void;
    setValue: React.Dispatch<any>;
  };
  htmlViewerRef: React.MutableRefObject<HTMLIFrameElement | null>;
  viewHtmlFile: {
    value: any;
    onChange: (e: any) => void;
    setValue: React.Dispatch<any>;
  };
  viewImageFile: {
    value: any;
    onChange: (e: any) => void;
    setValue: React.Dispatch<any>;
  };
  onClickCloudFile: (e: any, id: any, data?: any) => Promise<any>;
  onClickLocalFile: (e: any, id: any, data?: any) => void;
  onAddLocalFiles: (data: any) => void;
  //
  syncPartners: {
    email: string;
    groupCode: string;
    isSelf: number;
    name: string;
    partnerType: number | null;
    userGroupIdx: number;
  }[];
  hasMoreSyncPartners: boolean;
  selectedSyncPartner: {
    value: string;
    onChange: (e: any) => void;
    setValue: React.Dispatch<string>;
  };
  onFetchSyncPartners: () => void;
  onSearchSyncPartners: (value: string) => void;
}

function ProjectUpload({
  hasViewer,
  hasUpload,
  viewType,
  isEdit,
  checkAllLocal,
  checkAllCloud,
  localFileInput,
  localFileInputRef,
  localFileListCt,
  partnerFileList,
  cloudFileList,
  viewModelFile,
  htmlViewerRef,
  viewHtmlFile,
  viewImageFile,
  onClickCloudFile,
  onClickLocalFile,
  onAddLocalFiles,
  //
  syncPartners,
  hasMoreSyncPartners,
  selectedSyncPartner,
  onFetchSyncPartners,
  onSearchSyncPartners,
}: ProjectUploadProps) {
  const {
    projectInfo,
    userGroupIdx,
    accessToken,
    syncPartnersPending,
    editProjectShareSuccess,
    createProjectSyncSuccess,
  } = useShallowAppSelector(state => ({
    projectInfo: state.project.project.data?.projectInfo,
    userGroupIdx: state.user.user?.userGroupIdx,
    accessToken: state.auth.accessToken,
    syncPartnersPending: state.partner.syncPartners.pending,
    editProjectShareSuccess: state.file.editProjectShare.success,
    createProjectSyncSuccess: state.project.createProjectSync.success,
  }));
  const { pathname } = useLocation();
  const isDetailPage = cutUrl(pathname, 1) === 'detail';
  const projectCode = projectInfo?.projectCode;

  const { onCheckExistingUploadUserFile, onUploadLocalFile, localFileToUpload } =
    useContext(ProjectContext);
  const [hasPartner, setHasPartner] = useState(false);
  const setHasPartnerValue = useMemo(() => {
    return setHasPartner(projectInfo?.partnerIdx || selectedSyncPartner.value);
  }, [projectInfo?.partnerIdx, selectedSyncPartner.value]);

  // function
  // TODO: uploadPartner, uploadGroup 분리
  const handleSyncProject = () => {
    // 파일선택이 없을 경우, cloudDataList 빈배열로 api만 호출
    if (!localFileToUpload?.length) {
      ProjectActions.create_project_sync_request({
        projectCode,
        partnerGroupIdx: selectedSyncPartner.value,
        cloudDataList: [],
      });
    } else {
      onCheckExistingUploadUserFile(() => onUploadLocalFile(1, selectedSyncPartner.value));
    }
  };
  const handleUploadToPartner = () => {
    const checkedCloudFileIdxList = cloudFileList.value.reduce((acc: any, curr: CloudFile) => {
      if (curr.isChecked) {
        return acc.concat(curr.cloudDataIdx);
      }
      return acc;
    }, []);

    // console.log('cloudFileList.value', cloudFileList.value);
    // console.log('checkedCloudFileIdxList', checkedCloudFileIdxList);

    if (localFileToUpload?.length) {
      onCheckExistingUploadUserFile(() => onUploadLocalFile(2), 2);
    } else if (checkedCloudFileIdxList.length) {
      FileActions.edit_project_share_request({
        projectCode,
        cloudDataList: checkedCloudFileIdxList,
        isShare: 2,
      });
    }
  };
  const handleUploadToGroup = () => {
    const checkedPartnerFileIdxList = partnerFileList.value.reduce((acc: any, curr: CloudFile) => {
      if (curr.isChecked) {
        return acc.concat(curr.cloudDataIdx);
      }
      return acc;
    }, []);

    if (localFileToUpload?.length) {
      onCheckExistingUploadUserFile(() => onUploadLocalFile(1));
    } else if (checkedPartnerFileIdxList.length) {
      FileActions.edit_project_share_request({
        projectCode,
        cloudDataList: checkedPartnerFileIdxList,
        isShare: 1,
      });
    }
  };

  // useEffect(() => {
  //   console.log('selectedSyncPartner.value', selectedSyncPartner.value);
  // }, [selectedSyncPartner.value]);
  // SECTION: DidUpdate

  // edit share (isShare -> 2) 요청 후 파일 refetch
  useDidUpdateEffect(() => {
    if (editProjectShareSuccess) {
      FileActions.fetch_project_files_request(projectCode);
    }
  }, [!!editProjectShareSuccess]);

  // refetch하지 않고 파트너만 있도록 변경
  useDidUpdateEffect(() => {
    if (createProjectSyncSuccess) {
      setHasPartner(true);
    }
  }, [!!createProjectSyncSuccess]);

  return (
    <Styled.ProjectUpload data-component-name="ProjectUpload">
      {/* <div className="projectUpload__file_open_box">
        <div className="projectUpload__file_open_btn_box">
          <input
            type="file"
            multiple
            name="localFileInput"
            id="localFileInput"
            onChange={localFileInput.onChange}
            hidden
          />
          <MuiButton
            data-type="label"
            disableElevation
            variant="outlined"
            color="primary"
            className="sm projectUpload__file_open_btn"
          >
            <label htmlFor="localFileInput" className="cursor-pointer">
              Folder Open
            </label>
          </MuiButton>
        </div>
      </div> */}

      {/* <Grid item container>
          <Grid item xs={6}>
            아
          </Grid>
          <Grid item xs={6}>
            아
          </Grid>
        </Grid> */}
      <Grid container className={cx('projectUpload__grid_container', { detail: isDetailPage })}>
        {useMemo(() => {
          return (
            <>
              {hasViewer && (
                <Grid item container className="projectUpload__grid_item viewer">
                  <div className="projectUpload__viewer_box">
                    {!!viewModelFile.value?.length && (
                      <ProjectModelViewer
                        model={viewModelFile.value}
                        width={900}
                        className="projectUpload__modelViewer"
                      />
                    )}
                    {/* <div dangerouslySetInnerHTML={{ __html: viewHtmlFile.value }} /> */}
                    {/* {viewHtmlFile.value && (
                      <div className="projectUpload__htmlViewer">
                        <iframe
                          id="htmlViewerRef"
                          ref={htmlViewerRef}
                          // src={viewHtmlFile.value}
                          src=""
                          frameBorder="0"
                          title="3D model web viewer"
                        ></iframe>
                      </div>
                    )} */}
                    <div className={cx('projectUpload__htmlViewer', { on: !!viewHtmlFile.value })}>
                      <iframe
                        // id="htmlViewerRef"
                        ref={htmlViewerRef}
                        src=""
                        frameBorder="0"
                        title="3D model web viewer"
                      ></iframe>
                    </div>
                    {viewImageFile.value && (
                      <div className="projectUpload__imageViewer">
                        <img src={viewImageFile.value} />
                      </div>
                    )}
                  </div>
                </Grid>
              )}
            </>
          );
        }, [hasViewer, viewModelFile.value, viewHtmlFile.value, viewImageFile.value])}

        {/* TODO: 최초 선택된 partner가 없을 경우 show */}
        {!projectInfo?.partnerIdx && (
          <div className="projectUpload__select_partner_box">
            <AsyncFetchSelect
              className="sm"
              fullWidth
              fontColor="white"
              bgColor="#0782ED"
              borderColor="#7CBEF8"
              hoverBorderColor="#7CBEF8"
              loadingIconColor="white"
              dropIconColor="white"
              placeholderColor="white"
              inputProps={{
                placeholder: 'Select partner',
                selectedValue: selectedSyncPartner.value,
                setSelectedValue: selectedSyncPartner.setValue,
                data: syncPartners,
                hasMoreData: hasMoreSyncPartners,
                idKey: 'userGroupIdx',
                labelKey: 'name',
                exceptId: userGroupIdx,
                onFetch: onFetchSyncPartners,
                searchLoading: syncPartnersPending,
                onSearch: onSearchSyncPartners,
              }}
            />
          </div>
        )}

        <Grid container className={cx('projectUpload__grid_item table')}>
          <div className="projectUpload__table_wrapper">
            <div className="projectUpload__table_container">
              <div aria-label="project file table" className={cx('projectUpload__table')}>
                <div className="projectUpload__table_head">
                  {isDetailPage && (
                    <Grid
                      item
                      container
                      alignItems="center"
                      justifyContent="center"
                      className="projectUpload__table_group"
                    >
                      <div>{/* <T>GLOBAL_LOCATION</T> */}</div>
                    </Grid>
                  )}
                  <Grid item container alignItems="center" className="projectUpload_file_list_cell">
                    <div className="projectUpload_file_list head">
                      <Grid container className="projectUpload_file_item_grid_container">
                        <Grid
                          item
                          container
                          alignItems="center"
                          justifyContent="center"
                          className="projectUpload__file_list_item_cell check_item inhead"
                        >
                          <div>
                            {/* <label className="cursor-pointer">
                              <CustomCheckbox
                              marginRight={0}
                                width={15}
                                borderColor="white"
                                checked={checkAllCloud.value}
                                onChange={checkAllCloud.onChange}
                              />
                            </label> */}
                          </div>
                        </Grid>
                        <Grid
                          item
                          container
                          alignItems="center"
                          className="projectUpload__file_list_item_cell filename inhead"
                        >
                          <div>
                            <T>GLOBAL_FILE_NAME</T>
                          </div>
                        </Grid>
                        <Grid
                          item
                          container
                          alignItems="center"
                          justifyContent="flex-end"
                          className="projectUpload__file_list_item_cell actions"
                        >
                          <div>
                            {isDetailPage && (
                              <>
                                <CustomSpan style={{ padding: '0 12px' }}>
                                  <DownloadIcon width={16} color={color.gray_b5} />
                                </CustomSpan>
                                {hasViewer && (
                                  <CustomSpan style={{ padding: '0 12px' }}>
                                    <EyeIcon width={18} color={color.gray_b5} />
                                  </CustomSpan>
                                )}
                              </>
                            )}

                            <CustomSpan style={{ padding: '0 12px' }}>
                              <TrashIcon width={14} />
                            </CustomSpan>
                          </div>
                        </Grid>
                      </Grid>
                    </div>
                  </Grid>
                </div>

                <div className="projectUpload__table_body">
                  {/* partner */}
                  <div className="projectUpload__table_body_partner">
                    <Grid
                      item
                      container
                      alignItems="center"
                      justifyContent="center"
                      className="projectUpload__table_group"
                    >
                      <div className="projectUpload__table_check_all_box">
                        <span className="label">
                          <T>Partner</T>
                        </span>
                      </div>
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      className="projectUpload_file_list_cell"
                    >
                      <div className={cx('projectUpload_file_list cloud')}>
                        {partnerFileList.value?.length > 0 &&
                          partnerFileList.value.map((item: CloudFile, idx: number) => {
                            const itemType = item.type || '';
                            const isModelType = modelTypes.includes(itemType);
                            const isImageType = [...imgTypes].includes(itemType);
                            const isViewType = isModelType || isImageType || itemType === 'html';
                            const extensionSrc = fileExtensionList.includes(itemType)
                              ? require(`static/images/icons/icon_extension_${itemType}.svg`)
                              : require(`static/images/icons/icon_extension_etc.svg`);
                            const activeEyeColor = item.viewColor || color.blue;
                            const unactiveEyeColor = isViewType
                              ? color.gray_b5
                              : color.gray_deep_weak;
                            const eyeIconColor = item.isView ? activeEyeColor : unactiveEyeColor;

                            return (
                              <Grid
                                container
                                alignItems="center"
                                className="projectUpload_file_item_grid_container"
                                key={item.cloudDataIdx}
                              >
                                <Grid
                                  item
                                  container
                                  alignItems="center"
                                  justifyContent="center"
                                  className="projectUpload__file_list_item_cell check_item"
                                >
                                  <div>
                                    <label>
                                      <CustomCheckbox
                                        marginRight={0}
                                        width={15}
                                        checked={item.isChecked}
                                        onChange={e =>
                                          onClickCloudFile(_, item.cloudDataIdx, {
                                            action: 'checkCloudFile',
                                            shareType: 'partner',
                                          })
                                        }
                                      />
                                    </label>
                                  </div>
                                </Grid>
                                <Grid
                                  item
                                  container
                                  alignItems="center"
                                  className="projectUpload__file_list_item_cell filename"
                                >
                                  <div>
                                    <img src={extensionSrc} alt={item.type} />

                                    <span
                                      className={cx('projectUpload__table_from_mark', {
                                        client: item.uploadUserType === 0,
                                        partner: item.uploadUserType === 1,
                                      })}
                                    ></span>
                                    <span
                                      className="text-overflow-ellipis projectUpload__file_list_item_text"
                                      title={item.originName}
                                    >
                                      {item.originName}
                                    </span>
                                    {/* - */}
                                    {/* <span
                                        className={cx('projectUpload__table_from_badge', {
                                          client: item.uploadUserType === 'client',
                                          designer: item.uploadUserType === 'designer',
                                        })}
                                      >
                                        {item.uploadUserType}
                                      </span> */}
                                  </div>
                                  {/* <div className="projectUpload__file_list_item_date">
                                      {moment.unix(item.enrollDate).format('MMM. DD. YYYY')}
                                    </div> */}
                                </Grid>
                                <Grid
                                  item
                                  container
                                  alignItems="center"
                                  justifyContent="flex-end"
                                  className="projectUpload__file_list_item_cell actions"
                                >
                                  <div>
                                    <span className="vertical_division"></span>
                                    {/* 0: 업로드중, 1: 서버에 업로드, 2: s3업로드, 3: 에러 */}
                                    <>
                                      {item.uploadState === 0 && (
                                        <IconButton
                                          disabled
                                          style={{ paddingTop: 0, paddingBottom: 0 }}
                                        >
                                          <CircularLoading size={15} />
                                        </IconButton>
                                      )}
                                      {item.uploadState === 2 && (
                                        <IconButton
                                          // disabled={downloadDisabled || !item.downloadDirectory}
                                          onClick={() =>
                                            onClickCloudFile(_, item.cloudDataIdx, {
                                              action: 'downloadCloudFile',
                                              shareType: 'partner',
                                              value: {
                                                // isDownload: item.isDownload,
                                                name: item.originName,
                                                cloudDataIdx: item.cloudDataIdx,
                                              },
                                            })
                                          }
                                        >
                                          <>
                                            {item.isDownload ? (
                                              <DownloadIcon width={16} color={color.gray_b5} />
                                            ) : (
                                              <DownloadIcon width={16} color={color.blue} />
                                            )}
                                          </>
                                        </IconButton>
                                      )}
                                      {item.uploadState === 3 && (
                                        <IconButton disabled>
                                          {/* <CloudOffIcon htmlColor="#bdbdbd" /> */}
                                          <DownloadIcon width={16} color={color.gray_deep_weak} />
                                        </IconButton>
                                      )}
                                    </>

                                    {hasViewer && (
                                      <IconButton
                                        disabled={!isViewType}
                                        onClick={() => {
                                          if ('html' === itemType) {
                                            return onClickCloudFile(_, item.cloudDataIdx, {
                                              action: 'toggleViewCloudHtmlFile',
                                              shareType: 'partner',
                                              value: {
                                                // isView: item.isView,
                                                // url: item.cloudDataIdx,
                                              },
                                            });
                                          }
                                          if (imgTypes.includes(itemType)) {
                                            return onClickCloudFile(_, item.cloudDataIdx, {
                                              action: 'toggleViewCloudImageFile',
                                              shareType: 'partner',
                                              value: {
                                                // isView: item.isView,
                                                // url: item.cloudDataIdx,
                                              },
                                            });
                                          }
                                          if (modelTypes.includes(itemType)) {
                                            return onClickCloudFile(_, item.cloudDataIdx, {
                                              action: 'toggleViewCloudModelFile',
                                              shareType: 'partner',
                                              value: {
                                                name: item.originName,
                                                type: item.type,
                                                isView: item.isView,
                                                viewColor: item.viewColor,
                                                // url: item.cloudDataIdx,
                                                resourceFileList: item.resourceFileList,
                                                groupName: item.groupName,
                                                // url: item.downloadDirectory,
                                              },
                                            });
                                          }
                                        }}
                                      >
                                        <EyeIcon width={18} color={eyeIconColor} />
                                      </IconButton>
                                    )}

                                    <IconButton
                                      disabled={!item.isOwner}
                                      onClick={() =>
                                        onClickCloudFile(_, item.cloudDataIdx, {
                                          action: 'deleteCloudFile',
                                          shareType: 'partner',
                                          value: {
                                            name: item.originName,
                                          },
                                        })
                                      }
                                    >
                                      <TrashIcon
                                        width={14}
                                        color={!item.isOwner ? color.gray_deep_weak : color.gray_b5}
                                      />
                                    </IconButton>
                                  </div>
                                </Grid>
                                {/* <Grid item container alignItems="center" className="projectUpload__file_list_item_cell upload">
                                      <MuiWrapper data-type="default">
                                        <Checkbox
                                          checked={item.checkUpload}
                                          color="primary"
                                          style={{ padding: 0 }}
                                          disabled
                                        />
                                      </MuiWrapper>
                                    </Grid> */}
                              </Grid>
                            );
                          })}
                      </div>
                    </Grid>
                  </div>

                  {/* cloud */}
                  <div className="projectUpload__table_body_cloud">
                    <Grid
                      item
                      container
                      alignItems="center"
                      justifyContent="center"
                      className="projectUpload__table_group"
                    >
                      <div className="projectUpload__table_check_all_box">
                        <span className="label">
                          <T>Group</T>
                        </span>
                      </div>
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      className="projectUpload_file_list_cell"
                    >
                      <div className={cx('projectUpload_file_list cloud')}>
                        {cloudFileList.value?.length > 0 &&
                          cloudFileList.value.map((item: CloudFile, idx: number) => {
                            const itemType = item.type || '';
                            const isModelType = modelTypes.includes(itemType);
                            const isImageType = [...imgTypes].includes(itemType);
                            const isViewType = isModelType || isImageType || itemType === 'html';
                            const extensionSrc = fileExtensionList.includes(itemType)
                              ? require(`static/images/icons/icon_extension_${itemType}.svg`)
                              : require(`static/images/icons/icon_extension_etc.svg`);
                            const activeEyeColor = item.viewColor || color.blue;
                            const unactiveEyeColor = isViewType
                              ? color.gray_b5
                              : color.gray_deep_weak;
                            const eyeIconColor = item.isView ? activeEyeColor : unactiveEyeColor;

                            return (
                              <Grid
                                container
                                alignItems="center"
                                className="projectUpload_file_item_grid_container"
                                key={item.cloudDataIdx}
                              >
                                <Grid
                                  item
                                  container
                                  alignItems="center"
                                  justifyContent="center"
                                  className="projectUpload__file_list_item_cell check_item"
                                >
                                  <div>
                                    <label>
                                      <CustomCheckbox
                                        marginRight={0}
                                        width={15}
                                        checked={item.isChecked}
                                        onChange={e =>
                                          onClickCloudFile(_, item.cloudDataIdx, {
                                            action: 'checkCloudFile',
                                          })
                                        }
                                      />
                                    </label>
                                  </div>
                                </Grid>
                                <Grid
                                  item
                                  container
                                  alignItems="center"
                                  className="projectUpload__file_list_item_cell filename"
                                >
                                  <div>
                                    <img src={extensionSrc} alt={item.type} />

                                    <span
                                      className={cx('projectUpload__table_from_mark', {
                                        client: item.uploadUserType === 0,
                                        partner: item.uploadUserType === 1,
                                      })}
                                    ></span>
                                    <span
                                      className="text-overflow-ellipis projectUpload__file_list_item_text"
                                      title={item.originName}
                                    >
                                      {item.originName}
                                    </span>
                                    {/* - */}
                                    {/* <span
                                        className={cx('projectUpload__table_from_badge', {
                                          client: item.uploadUserType === 'client',
                                          designer: item.uploadUserType === 'designer',
                                        })}
                                      >
                                        {item.uploadUserType}
                                      </span> */}
                                  </div>
                                  {/* <div className="projectUpload__file_list_item_date">
                                      {moment.unix(item.enrollDate).format('MMM. DD. YYYY')}
                                    </div> */}
                                </Grid>
                                <Grid
                                  item
                                  container
                                  alignItems="center"
                                  justifyContent="flex-end"
                                  className="projectUpload__file_list_item_cell actions"
                                >
                                  <div>
                                    <span className="vertical_division"></span>
                                    {/* 0: 업로드중, 1: 서버에 업로드, 2: s3업로드, 3: 에러 */}
                                    <>
                                      {item.uploadState === 0 && (
                                        <IconButton
                                          disabled
                                          style={{ paddingTop: 0, paddingBottom: 0 }}
                                        >
                                          <CircularLoading size={15} />
                                        </IconButton>
                                      )}
                                      {item.uploadState === 2 && (
                                        <IconButton
                                          // disabled={downloadDisabled || !item.downloadDirectory}
                                          onClick={() =>
                                            onClickCloudFile(_, item.cloudDataIdx, {
                                              action: 'downloadCloudFile',
                                              value: {
                                                // isDownload: item.isDownload,
                                                name: item.originName,
                                                cloudDataIdx: item.cloudDataIdx,
                                              },
                                            })
                                          }
                                        >
                                          <>
                                            {item.isDownload ? (
                                              <DownloadIcon width={16} color={color.gray_b5} />
                                            ) : (
                                              <DownloadIcon width={16} color={color.blue} />
                                            )}
                                          </>
                                        </IconButton>
                                      )}
                                      {item.uploadState === 3 && (
                                        <IconButton disabled>
                                          {/* <CloudOffIcon htmlColor="#bdbdbd" /> */}
                                          <DownloadIcon width={16} color={color.gray_deep_weak} />
                                        </IconButton>
                                      )}
                                    </>

                                    {hasViewer && (
                                      <IconButton
                                        disabled={!isViewType}
                                        onClick={() => {
                                          if ('html' === itemType) {
                                            return onClickCloudFile(_, item.cloudDataIdx, {
                                              action: 'toggleViewCloudHtmlFile',
                                              value: {
                                                // isView: item.isView,
                                                // url: item.cloudDataIdx,
                                              },
                                            });
                                          }
                                          if (imgTypes.includes(itemType)) {
                                            return onClickCloudFile(_, item.cloudDataIdx, {
                                              action: 'toggleViewCloudImageFile',
                                              value: {
                                                // isView: item.isView,
                                                // url: item.cloudDataIdx,
                                              },
                                            });
                                          }
                                          if (modelTypes.includes(itemType)) {
                                            return onClickCloudFile(_, item.cloudDataIdx, {
                                              action: 'toggleViewCloudModelFile',
                                              value: {
                                                name: item.originName,
                                                type: item.type,
                                                isView: item.isView,
                                                viewColor: item.viewColor,
                                                // url: item.cloudDataIdx,
                                                resourceFileList: item.resourceFileList,
                                                groupName: item.groupName,
                                                // url: item.downloadDirectory,
                                              },
                                            });
                                          }
                                        }}
                                      >
                                        <EyeIcon width={18} color={eyeIconColor} />
                                      </IconButton>
                                    )}

                                    <IconButton
                                      disabled={!item.isOwner}
                                      onClick={() =>
                                        onClickCloudFile(_, item.cloudDataIdx, {
                                          action: 'deleteCloudFile',
                                          value: {
                                            name: item.originName,
                                          },
                                        })
                                      }
                                    >
                                      <TrashIcon
                                        width={14}
                                        color={!item.isOwner ? color.gray_deep_weak : color.gray_b5}
                                      />
                                    </IconButton>
                                  </div>
                                </Grid>
                                {/* <Grid item container alignItems="center" className="projectUpload__file_list_item_cell upload">
                                      <MuiWrapper data-type="default">
                                        <Checkbox
                                          checked={item.checkUpload}
                                          color="primary"
                                          style={{ padding: 0 }}
                                          disabled
                                        />
                                      </MuiWrapper>
                                    </Grid> */}
                              </Grid>
                            );
                          })}
                      </div>
                    </Grid>
                  </div>

                  {/* local */}
                  <div className="projectUpload__table_body_local">
                    <Grid
                      item
                      container
                      alignItems="center"
                      justifyContent="center"
                      className="projectUpload__table_group"
                    >
                      <div className="projectUpload__table_check_all_box">
                        <span className="label">Local</span>
                      </div>
                    </Grid>
                    <Grid
                      item
                      container
                      alignItems="center"
                      className="projectUpload_file_list_cell"
                    >
                      <DropzoneWrapper apiRequest={onAddLocalFiles}>
                        <div className="projectUpload_file_list local">
                          {useMemo(
                            () => (
                              <>
                                {localFileListCt.value?.length > 0 &&
                                  localFileListCt.value.map((item: any, idx: number) => {
                                    const isModelType = modelTypes.includes(item.type);
                                    const isImageType = [...imgTypes].includes(item.type);
                                    const isViewType =
                                      isModelType || isImageType || item.type === 'html';
                                    const extensionSrc = fileExtensionList.includes(item.type)
                                      ? require(`static/images/icons/icon_extension_${item.type}.svg`)
                                      : require(`static/images/icons/icon_extension_etc.svg`);
                                    // const isNoBorderBottom =
                                    //   idx >= 6 && idx === localFileListCt.value.length - 1;
                                    return (
                                      <Grid
                                        container
                                        alignItems="center"
                                        className="projectUpload_file_item_grid_container"
                                        key={item.id}
                                      >
                                        <Grid
                                          item
                                          container
                                          alignItems="center"
                                          justifyContent="center"
                                          className="projectUpload__file_list_item_cell check_item"
                                        >
                                          <div>
                                            <label>
                                              <CustomCheckbox
                                                marginRight={0}
                                                width={15}
                                                checked={item.isChecked}
                                                onChange={e =>
                                                  onClickLocalFile(_, item.id, {
                                                    action: 'checkLocalFile',
                                                  })
                                                }
                                                // checked={checkAllLocal.value}
                                                // onChange={checkAllLocal.onChange}
                                              />
                                            </label>
                                          </div>
                                        </Grid>
                                        <Grid
                                          item
                                          container
                                          alignItems="center"
                                          className="projectUpload__file_list_item_cell filename"
                                        >
                                          <div>
                                            <img src={extensionSrc} alt={item.type} />

                                            <span
                                              className="text-overflow-ellipis projectUpload__file_list_item_text"
                                              title={item.name}
                                            >
                                              {item.name}
                                            </span>
                                          </div>
                                        </Grid>
                                        <Grid
                                          item
                                          container
                                          alignItems="center"
                                          justifyContent="flex-end"
                                          className="projectUpload__file_list_item_cell actions"
                                        >
                                          <span className="vertical_division"></span>

                                          <IconButton disabled>
                                            <DownloadIcon width={16} color={color.gray_deep_weak} />
                                          </IconButton>

                                          {hasViewer && (
                                            <IconButton
                                              disabled
                                              // disabled={!isViewType}
                                              // onClick={() => {
                                              //   if (item.type === 'html') {
                                              //     return onClickLocalFile(_, item.id, {
                                              //       action: 'toggleViewLocalHtmlFile',
                                              //       value: {
                                              //         isView: item.isView,
                                              //         file: item.file,
                                              //       },
                                              //     });
                                              //   }
                                              //   if (imgTypes.includes(item.type)) {
                                              //     return onClickLocalFile(_, item.id, {
                                              //       action: 'toggleViewLocalImageFile',
                                              //       value: {
                                              //         isView: item.isView,
                                              //         file: item.file,
                                              //       },
                                              //     });
                                              //   }
                                              //   if (modelTypes.includes(item.type)) {
                                              //     return onClickLocalFile(_, item.id, {
                                              //       action: 'toggleViewLocalModelFile',
                                              //       value: {
                                              //         name: item.name,
                                              //         type: item.type,
                                              //         isView: item.isView,
                                              //         // viewColor: item.viewColor,
                                              //         file: item.file,
                                              //         // resourceFileList: item.resourceFileList,
                                              //         // groupName: item.groupName,
                                              //         // url: item.downloadDirectory,
                                              //       },
                                              //     });
                                              //   }
                                              // }}
                                            >
                                              <EyeIcon width={18} color={color.gray_deep_weak} />
                                            </IconButton>
                                          )}

                                          <div>
                                            <IconButton
                                              // style={{ padding: 0 }}
                                              onClick={() =>
                                                onClickLocalFile(_, item.id, {
                                                  action: 'deleteLocalFile',
                                                })
                                              }
                                            >
                                              <TrashIcon width={14} color={'#b5b5b5'} />
                                            </IconButton>
                                          </div>
                                        </Grid>
                                        {/* <Grid item className="projectUpload__file_list_item_cell upload">
                                    <MuiWrapper data-type="default">
                                      <Checkbox
                                        checked={item.checkUpload}
                                        color="primary"
                                        style={{ padding: 0 }}
                                        onChange={e =>
                                          onClickLocalFile(e, item.id, {
                                            action: 'checkLocalFile',
                                          })
                                        }
                                      />
                                    </MuiWrapper>
                                  </Grid> */}
                                      </Grid>
                                    );
                                  })}

                                {!localFileListCt.value?.length && (
                                  <label
                                    // htmlFor="localFileInput"
                                    onClick={() => localFileInputRef.current.click()}
                                    className="projectUpload__table_file_open_btn_box cursor-pointer"
                                  >
                                    <div className="projectUpload__table_file_open_in_box">
                                      <img
                                        src={icon_folder_plus}
                                        alt="folder open"
                                        className="icon"
                                      />{' '}
                                      <div className="projectUpload__table_file_open_info_box">
                                        {/* <span className="projectUpload__table_file_open_btn add">
                                          + <T>GLOBAL_ADD_FILES</T>
                                        </span>{' '}
                                        <span className="projectUpload__table_file_open_btn drag">
                                          <T>GLOBAL_DRAG_DROP</T>
                                        </span>{' '}
                                        <span className="projectUpload__table_file_open_btn click">
                                          <T>GLOBAL_CLICK</T>
                                        </span> */}
                                        <span className="projectUpload__table_file_open_btn drag">
                                          <T>GLOBAL_DRAG_DROP</T>
                                          {', '}
                                        </span>
                                        <span className="projectUpload__table_file_open_btn click">
                                          <T>GLOBAL_BROWSE_FILES</T>
                                        </span>{' '}
                                        <p className="projectUpload__table_file_open_notice">
                                          <T>GLOBAL_FILE_UPLOAD_INFO</T>
                                        </p>
                                      </div>
                                    </div>
                                  </label>
                                )}
                              </>
                            ),
                            [localFileListCt.value],
                          )}
                        </div>
                      </DropzoneWrapper>
                    </Grid>
                  </div>
                </div>
              </div>
            </div>

            <input
              type="file"
              multiple
              name="localFileInput"
              id="localFileInput"
              ref={localFileInputRef}
              onChange={localFileInput.onChange}
              hidden
            />
            {/* <button className="projectUpload__table_file_plus_btn btn-reset">
            <label htmlFor="localFileInput" className="cursor-pointer">
              <img src={icon_folder_plus} alt="folder plus" className="icon" />
            </label>
          </button> */}
            {!!localFileListCt.value?.length && (
              <button
                className="projectUpload__table_file_plus_btn btn-reset"
                onClick={() => localFileInputRef.current.click()}
              >
                <img src={icon_folder_plus} alt="folder plus" className="icon" />
              </button>
            )}
          </div>

          <div className="projectUpload__submit_box">
            <MuiButton
              config={{
                width: '155px',
                color: '#0782ED',
              }}
              disabled={!hasPartner}
              disableElevation
              variant="contained"
              // color="primary"
              className="sm"
              onClick={() => {
                if (projectInfo?.partnerIdx) {
                  handleUploadToPartner();
                } else {
                  handleSyncProject();
                }
              }}
            >
              <img src={icon_upload} alt="upload" />
              {projectInfo?.partnerIdx ? 'Partner' : 'Sync'}
            </MuiButton>
            <MuiButton
              config={{
                width: '155px',
              }}
              // data-type="label"
              disableElevation
              variant="contained"
              color="primary"
              className="sm"
              onClick={() => handleUploadToGroup()}
            >
              {/* <PublishIcon /> */}
              {/* <T>GLOBAL_UPLOAD</T> */}
              <img src={icon_upload} alt="upload" />
              Group
            </MuiButton>
          </div>
        </Grid>
      </Grid>
    </Styled.ProjectUpload>
  );
}

export default React.memo(ProjectUpload);

const checkboxWidth = 35; // 40, 20
const Styled = {
  ProjectUpload: styled.div`
    /* margin-top: 10px; */
    /* padding: 0 8px; */
    .projectUpload__grid_container {
      &.detail {
      }
      .projectUpload__grid_item {
        &.table {
        }
        &.viewer {
          margin-bottom: 10px;
        }
      }
      .projectUpload__grid_item {
        position: relative;
        justify-content: flex-end;
      }
    }

    .projectUpload__select_partner_box {
      width: 270px;
      margin-bottom: 10px;
    }

    /* 사용X */
    .projectUpload__file_open_box {
      margin-bottom: 10px;
      text-align: right;
    }
    .projectUpload__file_open_btn_box {
      display: inline-block;
      .projectUpload__file_open_btn {
        padding: 0;
        label {
          padding-left: 10px;
          padding-right: 10px;
          img {
            margin-right: 5px;
          }
        }
      }
    }

    .projectUpload__table_wrapper {
      position: relative;
      width: 100%;
    }
    .projectUpload__table_container {
      position: relative;
      &:before {
        /* content: ''; */
        display: block;
        position: absolute;
        top: 0;
        right: 0;
        width: 7px;
        height: 100%;
        background-color: #ddd;
      }
      .projectUpload__table {
        position: relative;
      }

      .projectUpload__table_head {
      }
      .projectUpload__table_body {
        overflow-x: hidden;
      }
      .projectUpload__table_head,
      .projectUpload__table_body_partner,
      .projectUpload__table_body_cloud,
      .projectUpload__table_body_local {
        display: flex;
      }
      .projectUpload__table_head {
        .projectUpload__table_group {
          color: white;
        }
      }
      .projectUpload__table_body_cloud,
      .projectUpload__table_body_local {
        border-top: 1px solid ${color.gray_b5};
      }
      .projectUpload__table_group {
        position: relative;
        width: 12%;
        border-right: 1px solid ${color.gray_b5};
        font-size: 14px;

        .projectUpload__table_check_all_box {
          position: relative;
          text-align: center;
        }
        .projectUpload__table_from_mark_list {
          position: absolute;
          top: 25px;
          left: -15px;
          font-size: 12px;
          white-space: nowrap;
          .projectUpload__table_from_mark_item {
            display: flex;
            align-items: center;
            &:not(:first-child) {
              margin-top: 2px;
            }
          }
        }
      }
      .projectUpload__table_from_mark {
        display: inline-block;
        position: relative;
        top: 1px;
        width: 8px;
        height: 8px;
        margin-right: 3px;
        border-radius: 50%;
        &.client {
          background-color: ${color.client_color};
        }
        &.partner {
          background-color: ${color.designer_color};
        }
        &.admin {
          background-color: ${color.admin_color};
        }
      }

      /* file list grid cell in table */
      .projectUpload_file_list_cell {
        width: 88%;
        padding: 0;
      }
      .projectUpload_file_list {
        position: relative;
        overflow-y: overlay;
        width: 100%;
        &.head {
        }
        &.cloud,
        &.local {
          height: 205px;
          .projectUpload_file_item_grid_container {
            border-bottom: 1px dashed ${color.gray_b5};
          }
        }
        &.cloud {
        }
        &.local {
        }
        .projectUpload_file_item_grid_container {
          align-items: center;
          justify-content: space-between;
        }
        .projectUpload__file_list_item_cell {
          position: relative;
          display: flex;
          /* width: 10%; */
          padding: 0 5px;
          height: 40px;
          > div {
            display: flex;
            align-items: center;
            line-height: 1.3;
          }
          &.check_item {
            &:not(.inhead) {
              width: ${checkboxWidth}px;
            }
            &.inhead {
              width: 0px;
              padding: 0;
              /* margin-right: -${checkboxWidth}px; */
            }
            label {
              cursor: pointer;
              /* display: none; */
            }
          }
          &.filename {
            justify-content: flex-start;
            width: 79%;
            height: 30px;
            padding-right: 80px;
            &.inhead {
              width: ${`calc(79% + ${checkboxWidth}px - 10px)`};
            }
            img:first-of-type {
              margin-right: 10px;
            }
            .projectUpload__file_list_item_text {
              display: inline-block;
              max-width: 450px;
            }
            .projectUpload__file_list_item_date {
              position: absolute;
              top: 50%;
              right: 5px;
              transform: translateY(-50%);
              font-size: 12px;
              color: ${color.gray_b5};
              font-weight: 300;
            }
          }
          &.type {
            .projectUpload__view_icon {
              color: ${color.blue};
              padding: 0;
            }
          }
          &.actions {
            width: ${`calc(21% - ${checkboxWidth}px)`};
          }

          .vertical_division {
            display: inline-block;
            position: relative;
            margin-left: -1px;
            left: -5px;
            height: 40px;
            border-left: 1px dashed ${color.gray_b5};
          }
          .projectUpload__table_from_badge {
            display: flex;
            align-items: center;
            justify-content: center;
            margin-left: 3px;
            height: 18px;
            padding: 0px 8px;
            border-radius: 15px;
            font-size: 12px;
            color: #fff;
            &.client {
              background-color: ${color.navy_blue};
            }
            &.designer {
              background-color: ${color.blue};
            }
          }
        }
      }

      .projectUpload__table_head {
        background-color: ${({ theme }) => theme.color.secondary};
        border-top-left-radius: 10px;
        border-top-right-radius: 10px;
        border: 1px solid transparent;
        .projectUpload__file_list_item_cell {
          min-height: 35px;
          font-size: 14px;
          color: white;
        }
      }
      .projectUpload__table_body {
        border: 1px solid ${color.gray_b5};
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
        .projectUpload__file_list_item_cell {
          font-size: 13px;
          &:first-child {
          }
          &:last-child {
          }
        }
      }
    }
    .projectUpload__viewer_box {
      position: relative;
      width: 100%;
      height: 425px;
      background-color: #fbfbfb;
      border: 1px dotted ${color.gray_b5};
      border-radius: 10px;
      overflow: hidden;
    }
    .projectUpload__htmlViewer,
    .projectUpload__modelViewer,
    .projectUpload__imageViewer {
    }
    .projectUpload__htmlViewer {
      overflow: overlay;
      display: none;
      &.on {
        display: block;
      }
      &,
      iframe {
        width: 900px;
        height: 425px;
      }
      iframe {
      }
    }
    .projectUpload__imageViewer {
      img {
        width: 900px;
        height: 425px;
      }
    }
    .projectUpload__submit_box {
      margin-top: 10px;
      > *:not(:first-child) {
        margin-left: 10px;
      }
      .button {
        img {
          margin-right: 7px;
        }
      }
    }
    .projectUpload__table_file_open_btn_box {
      display: flex;
      align-items: center;
      width: 100%;
      height: 100%;
      padding-left: 55px;
      /* background-color: #fff; */
      .projectUpload__table_file_open_in_box {
        display: flex;
        align-items: center;
        .projectUpload__table_file_open_info_box {
          margin-left: 20px;
          font-size: 14px;
          line-height: 1.15;
          text-align: left;
        }
      }
      label {
        display: inline-flex;
        align-items: center;
      }
      .projectUpload__table_file_open_btn {
        &:not(:first-of-type) {
        }
        &.add {
        }
        &.drag,
        &.click {
          color: #bababa;
        }
        &.drag {
        }
        &.click {
          text-decoration: underline;
        }
      }
      .projectUpload__table_file_open_notice {
        color: ${color.blue};
      }
    }
    .projectUpload__table_file_plus_btn {
      display: flex;
      align-items: center;
      justify-content: center;
      position: absolute;
      bottom: 0px;
      right: 0px;
      transform: translateX(50%);
      width: 38px;
      height: 38px;
      background-color: ${color.navy_blue};
      /* background-color: #fff; */
      box-shadow: 0 0 6px rgba(0, 0, 0, 0.16);
      border-radius: 50%;
      img {
        position: relative;
        left: 4px;
        bottom: 5px;
        width: 38px;
        height: 38px;
      }
    }
  `,
};
