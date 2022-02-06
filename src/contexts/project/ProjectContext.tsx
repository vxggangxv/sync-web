import useInput from 'lib/hooks/useInput';
import { cutUrl } from 'lib/library';
import { useDidUpdateEffect, useShallowSelector } from 'lib/utils';
import { useShallowAppSelector } from 'store/hooks';
import React, { createContext, useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useHistory, useLocation } from 'react-router-dom';
import { AppActions, FileActions } from 'store/actionCreators';

export interface CloudFile {
  // changeName: string;
  cloudDataIdx: number;
  // downloadDirectory: string;
  modifyDate: number;
  extension: string;
  fileGroupId: string;
  originName: string;
  uploadState: number;
  uploadUserType: number;
  ownerGroupIdx: number;
  // isUploader: number;
  isOwner: number;
  // viewDirectory: string;
  resourceFileList: string;
  //
  // custom add
  type?: string;
  groupName?: string;
  isDownload?: boolean;
  isView?: boolean;
  viewColor?: string | null;
  isChecked?: boolean;
}

export interface LocalFile {
  file: File;
  id: string;
  index: number;
  isChecked: boolean;
  isView: boolean;
  name: string;
  type: string;
}

export const ProjectContext = createContext<any>(null);

// ProjectUploadContainer 와 CreateProjectContainer, ProjectContainer, 를 Provider로서 state 관리
export function ProjectProvider({ children }: { children: React.ReactNode }) {
  const {
    user,
    accessToken,
    projectFilesData: { fileData },
    projectInfo,
    uploadProjectFileSuccess,
    fetchProjectSuccess,
  } = useShallowAppSelector(state => ({
    user: state.user.user,
    accessToken: state.auth.accessToken,
    projectFilesData: state.file.projectFiles.data || {},
    // projectFileList: state.project.projectFiles.data?.fileList,
    projectInfo: state.project.project.data?.projectInfo,
    fetchProjectSuccess: state.project.project.success,
    uploadProjectFileSuccess: state.bin.uploadProjectFile.success,
  }));
  const { t } = useTranslation();
  const { pathname, search } = useLocation();
  const isCreatePage = `${cutUrl(pathname)}/${cutUrl(pathname, 1)}` === 'project/create';
  const isCreateEditPage = ['project/create', 'project/edit'].includes(
    `${cutUrl(pathname)}/${cutUrl(pathname, 1)}`,
  );
  const isDetailPage = `${cutUrl(pathname)}/${cutUrl(pathname, 1)}` === 'project/detail';
  const history = useHistory();
  // const queryParse = queryString.parse(search);
  // const queryProjectCode = queryParse?.projectCode;
  const userGroupIdx = user?.userGroupIdx;
  const company = user?.company;
  const projectCode = projectInfo?.projectCode;
  // const syncUid = user?.syncUid;
  // const isSender = syncUid === projectInfo?.ownerSyncUid;
  // const isReceiver = userCode === projectInfo?.receiverCode;
  // const isAdmin = userCode === projectInfo?.adminCode;
  const projectGroupFileList = fileData?.groupFileList;
  const projectPartnerFileList = fileData?.partnerFileList;
  // const hasNewProjectUploadFile = projectFilesData?.hasNewFile;

  const reworkProjectCode = useInput('');
  // const stage = projectInfo?.stage;
  // const senderCode = projectInfo?.senderCode;
  // const fromActionCt = useInput('matching');
  // const fromActionCt = useInput('');
  // 프로젝트 Create(Save)한 후 fileUplaod 를 위한 projectCode, editSuccess이후 전달받음, stage 진행시 별도 테이블에서 파일 요청시 필요함
  const projectCodeCt = useInput('');
  // Upload Component localFileList
  const localFileListCt = useInput([]) as {
    value: LocalFile[];
    onChange: (e: any) => void;
    setValue: React.Dispatch<any>;
  };

  // fetchProject data 안에 fileList를 담아서 UploadTable로 전달용
  // const [cloudFileListCtValue, setCloudFileListCtValue] = useState<CloudFile[]>([]);
  const cloudFileListCt = useInput([]) as {
    value: CloudFile[];
    onChange: (e: any) => void;
    setValue: React.Dispatch<any>;
  };
  const partnerFileListCt = useInput([]) as {
    value: CloudFile[];
    onChange: (e: any) => void;
    setValue: React.Dispatch<any>;
  };

  // projectFileList data연동
  const setPartnerFileListCtValue = useMemo(() => {
    console.log('projectPartnerFileList', projectPartnerFileList);
    // NOTE: state사용시 기본값을 넣어주기, fetchData(selector)에 넣어주면([], {}) 랜더링 횟수 추가되어 loop발생 가능
    // console.log('cloudFileListCt projectPartnerFileList', projectPartnerFileList);
    // console.log('cloudFileListCtValue', cloudFileListCtValue);
    return partnerFileListCt.setValue(projectPartnerFileList ? projectPartnerFileList : []);
  }, [projectPartnerFileList]);
  const setCloudFileListCtValue = useMemo(() => {
    console.log('projectGroupFileList', projectGroupFileList);
    // NOTE: state사용시 기본값을 넣어주기, fetchData(selector)에 넣어주면([], {}) 랜더링 횟수 추가되어 loop발생 가능
    // console.log('cloudFileListCt projectGroupFileList', projectGroupFileList);
    // console.log('cloudFileListCtValue', cloudFileListCtValue);
    return cloudFileListCt.setValue(projectGroupFileList ? projectGroupFileList : []);
  }, [projectGroupFileList]);

  const localFileToUpload = useMemo(() => {
    return localFileListCt.value?.length
      ? localFileListCt.value.filter((item: LocalFile) => !!item.isChecked)
      : [];
  }, [localFileListCt.value]);

  // TEST:
  useEffect(() => {
    console.log('-localFileListCt.value', localFileListCt.value);
  }, [localFileListCt.value]);
  useEffect(() => {
    console.log('-cloudFileListCt.value', cloudFileListCt.value);
  }, [cloudFileListCt.value]);
  // useEffect(() => {
  //   console.log('-projectCodeCt.value', projectCodeCt.value);
  // }, [projectCodeCt.value]);

  // 데이터가 내가 올린 파일인지를 확인, owner일 경우는 1이 내가 올린, owner 아닐 경우는 0이 내가 올린,
  const matchingUploadUserTypeData = (data: any) => {
    return data.find(
      // (item: any) => userGroupIdx === item.ownerGroupIdx,
      (item: any) => data.isOwner,
      // return isSender ? item.isOwner === 1 : item.isOwner === 0;
      // (isSender && item?.uploadUserType === 'client') ||
      // (isReceiver && item?.uploadUserType === 'designer') ||
      // (isAdmin && item?.uploadUserType === 'admin'),
    );
  };

  // NOTE: 중복 파일 확인시 handleUploadLocalFile 호출 전에 확인용
  const createMatchingUserData = (isShare?: number) => {
    // cloudFile과의 matching cloudDataIdx를 찾기 위해
    // const localFileToUpload = localFileListCt.value.filter((item: LocalFile) => !!item.isChecked);
    console.log('localFileToUpload', localFileToUpload);
    const localFileListData = localFileToUpload?.map((item: any) => {
      const { name, file } = item;
      const currentCloudFileList = isShare === 2 ? partnerFileListCt.value : cloudFileListCt.value;
      const cloudData = currentCloudFileList?.filter(cloudFile => cloudFile.originName === name);
      console.log('cloudData', cloudData);
      const machingData = matchingUploadUserTypeData(cloudData);
      console.log('machingData', machingData);
      return {
        cloudDataIdx: machingData?.cloudDataIdx || null,
        file,
        uploadUserType: machingData?.uploadUserType || null,
      };
    });

    return localFileListData;
  };

  // NOTE: done, remake, uploadLocalFile 등의 함수 실행전 파일 중복여부 확인시 사용
  // TODO: uploadPartner, uploadGroup 분리
  const handleCheckExistingUploadUserFile = (callback: () => void, isShare?: number) => {
    const localFileListData = createMatchingUserData(isShare);
    const existingCloudFile = localFileListData?.find((item: any) => item.cloudDataIdx);
    // console.log('existingCloudFile', existingCloudFile);

    if (!!existingCloudFile) {
      return AppActions.add_popup({
        isOpen: true,
        content: t('MODAL_FILE_DUPLICATE'),
        isCloseIcon: true,
        // contentCardStyle: {
        //   fontSize: '16px',
        // },
        onClick() {
          callback();
        },
      });
    }

    callback();
  };

  // NOTE: handleUploadLocalFile은 handleCheckExistingUploadUserFile를 거쳐서 실행
  // createPage, detailPage에서 사용가능하도록 Context에 등록
  const handleUploadLocalFile = (isShare: number, syncPartnerId?: number) => {
    // if (!data) data = { id: '', isRemake: false };
    // const { id, isRemake } = data;

    // console.log('cloudFileListCt.value', cloudFileListCt.value);
    console.log('localFileListCt.value', localFileListCt.value);

    // const hasFile = localFileListCt.value?.length > 0;
    // const hasFile = localFileToUpload?.length > 0;

    const projectCodeValue = projectCode;
    if (!projectCodeValue)
      return AppActions.show_toast({ type: 'error', message: 'Bad Request 400' });

    // if (!isRemake && !hasFile)
    // if (!hasFile)
    //   return AppActions.show_toast({ type: 'error', message: 'Check your upload files' });

    const localFileListData = createMatchingUserData();
    // console.log('localFileListData', localFileListData);
    if (!localFileListData?.length) return;

    const submitData = {
      company,
      projectCode: projectCodeValue,
      // project: localFileListCt.value.map(item => item.file),
      project: localFileListData,
      isShare,
      syncPartnerId,
    };

    // console.log('uploadLocalFile submit');
    // TODO: request api
    FileActions.upload_project_file_request(submitData);
  };

  // NOTE: 파일이름 중복을 막을 경우
  // const uploadPossible =
  //   (isSender && existingCloudFile?.uploadUserType === 'client') ||
  //   (isReceiver && existingCloudFile?.uploadUserType === 'designer') ||
  //   (isAdmin && existingCloudFile?.uploadUserType === 'admin');
  // console.log('uploadPossible', uploadPossible);
  // if (!uploadPossible) {
  //   return AppActions.add_popup({
  //     isOpen: true,
  //     content: t('MODAL_FILE_DUPLICATE_NOT_OWNER'),
  //     isCloseIcon: true,
  //   });
  // }

  // project 변경시 마다 초기화 FileListCt 초기화
  useDidUpdateEffect(() => {
    console.log('ALL FileListCt Init');
    // cloudFileListCt.setValue([]);
    localFileListCt.setValue([]);
  }, [projectCode]);

  // NOTE: project create page, edit page에서 파일 업로드 성공 후 detail page 이동
  // request project file, response
  useDidUpdateEffect(() => {
    if (uploadProjectFileSuccess) {
      console.log('uploadProjectFileSuccess');
      // 성공시 초기화(list reset)
      localFileListCt.setValue([]);
      if (isCreateEditPage) {
        // createPage에서 Create버튼 눌른 후 page이동(detailPage이동 후 fetchProject에서 fileList를 가지고옴)
        console.log('createPage');
        console.log('projectCodeCt.value', projectCodeCt.value);
        // history.push(`${pageUrl.project.detail}?projectCode=${projectCodeCt.value}`);
        history.push(`/project/detail/${projectCodeCt.value}`);
      } else {
        // Upload후 파일 fet는 store/bin에서 관리
        // detailPage에서 Uplaod버튼 눌른 후 fetch ProjectFiles
        // console.log('not createPage');
        // console.log('queryProjectCode', queryProjectCode);
        // ProjectActions.fetch_project_files_request({ projectCode: queryProjectCode });
      }
    }
  }, [uploadProjectFileSuccess === true]);

  // projectFiles data연동
  // useEffect(() => {
  //   if (!!projectFiles) cloudFileListCt.setValue(projectFiles);
  // }, [projectFiles]);
  // cloudFileListCt

  return (
    <ProjectContext.Provider
      value={{
        // fromActionCt,
        reworkProjectCode,
        projectCodeCt,
        localFileListCt,
        cloudFileListCt,
        partnerFileListCt,
        localFileToUpload,
        // hasNewProjectUploadFile,
        onCheckExistingUploadUserFile: handleCheckExistingUploadUserFile,
        onUploadLocalFile: handleUploadLocalFile,
      }}
    >
      {children}
    </ProjectContext.Provider>
  );
}

// export const useProjectContextValue = () => {
//   const value = useContext(ProjectContext);
//   return value;
// };
