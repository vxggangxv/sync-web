import T from 'components/common/text/T';
import { CloudFile, LocalFile, ProjectContext } from 'contexts/project/ProjectContext';
import useCheckOneInput from 'lib/hooks/useCheckOneInput';
import useInput from 'lib/hooks/useInput';
import useMultiFileInput from 'lib/hooks/useMultiFileInput';
import { getFileDataUrl, shuffleArray } from 'lib/library';
import { projectEventType } from 'lib/mapper';
import { useDidUpdateEffect } from 'lib/utils';
import { debounce, escape } from 'lodash';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import {
  AppActions,
  BinActions,
  FileActions,
  PartnerActions,
  ProjectActions,
} from 'store/actionCreators';
import { useShallowAppSelector } from 'store/hooks';
import { downloadFile } from 'store/utils';
import ProjectUpload from 'components/project/ProjectUpload';
import { fetchProjectFileDownloadUrl } from 'api/file';
import { axs } from 'api/config/axiosConfig';

const imgTypes = ['png', 'jpg', 'jpeg', 'gif'];
const modelTypes = ['obj', 'ply', 'stl'];

interface ProjectUploadContainerProps {
  hasViewer: boolean;
  hasUpload: boolean;
  viewType?: string;
  isEdit?: boolean;
}

// detailPage에서 hasViewser true 로 호출
function ProjectUploadContainer({
  hasViewer = false,
  hasUpload = false,
  viewType,
  isEdit,
}: // tablebodyHeight = 287,
ProjectUploadContainerProps) {
  const {
    user,
    accessToken,
    syncPartnersData,
    syncPartnersSuccess,
    deleteProjectFileSuccess,
    uploadProjectFileSuccess,
    // projectSyncCloudData
  } = useShallowAppSelector(state => ({
    user: state.user.user,
    accessToken: state.auth.accessToken,
    syncPartnersData: state.partner.syncPartners.data,
    syncPartnersSuccess: state.partner.syncPartners.success,
    deleteProjectFileSuccess: state.bin.deleteProjectFile.success,
    uploadProjectFileSuccess: state.file.uploadProjectFile.success,
    // projectSyncCloudData: state.file.projectSyncCloudData
  }));
  const { pcode } = useParams() as { pcode: string };
  const projectCode = pcode;
  const company = user?.company;
  const [syncPartners, setSyncPartners] = useState([]);
  const setSyncPartnersValue = useMemo(() => {
    return syncPartnersSuccess && setSyncPartners(draft => draft.concat(syncPartnersData?.list));
  }, [syncPartnersSuccess]);
  const syncPartnersPagingData = syncPartnersData?.pagingData;
  const hasMoreSyncPartners = syncPartnersPagingData?.page < syncPartnersPagingData?.totalPage;
  const htmlViewerRef = useRef<HTMLIFrameElement | null>(null);

  // select partner state
  const syncPartnerKeyword = useInput('');
  const selectedSyncPartner = useInput('');
  // const isSender = userType === 'sender';
  // const { pathname } = useLocation();
  // const isDetailPage = cutUrl(pathname, 1) === 'detail';
  // viewModelFile = {
  //   isView: Boolean
  //   isValidObj: Boolean
  //   name: String
  //   url: String
  //   textureUrl: String
  //   mtlUrl: String
  // }
  const viewModelFile = useInput([]);
  const viewHtmlFile = useInput(null);
  const viewImageFile = useInput(null);
  const localFileInput = useMultiFileInput([]);
  const localFileInputRef = useRef<HTMLDivElement | any>(null);
  const checkAllCloud = useCheckOneInput(false);
  const checkAllLocal = useCheckOneInput(false);
  const { partnerFileListCt, cloudFileListCt, localFileListCt } = useContext(ProjectContext);
  const partnerFileList = useInput([]);
  const cloudFileList = useInput([]);
  // cloudFileList parsing, onChange context - cloudFileListCt

  const viewColors = useMemo(() => {
    const array = [
      '#f44336',
      '#e91e63',
      '#9c27b0',
      '#673ab7',
      '#3f51b5',
      // '#2196f3',
      // '#03a9f4',
      // '#00bcd4',
      // '#009688',
      '#4caf50',
      '#8bc34a',
      '#cddc39',
      '#ffeb3b',
      '#ffc107',
      '#ff9800',
      '#ff5722',
      '#aa2e25',
      '#a31545',
      '#6d1b7b',
      '#2c387e',
      '#482880',
      '#b28704',
      '#b26a00',
      '#b23c17',
    ];
    return shuffleArray(array);
  }, []);

  const handleFetchSyncPartners = debounce((first?: boolean) => {
    console.log('handleFetchSyncPartners');
    if (first) return PartnerActions.fetch_sync_partners_request({ keyword: '', page: 1 });

    const { page, totalPage } = syncPartnersPagingData;
    if (page >= totalPage) return;
    PartnerActions.fetch_sync_partners_request({
      keyword: syncPartnerKeyword.value || '',
      page: page + 1,
    });
  }, 500);

  const handleSearchSyncPartners = debounce((value: string) => {
    console.log('handleSearchSyncPartners');
    // console.log('syncPartnerKeyword.value', syncPartnerKeyword.value);
    syncPartnerKeyword.setValue(value);
    setSyncPartners([]);
    PartnerActions.fetch_sync_partners_request({ keyword: value || '', page: 1 });
  }, 500);

  const partnerFileListValue: CloudFile[] = useMemo(() => {
    let modelNumber = 0;
    return partnerFileListCt.value?.reduce((acc: CloudFile[], curr: CloudFile) => {
      // uploadState: {0, 1}: loading, {2}: success, {3}: error
      // cloudDirectory: downlaod클릭시 링크
      const { originName } = curr;
      const type = originName.slice(originName.lastIndexOf('.') + 1);
      // 사용X
      const groupName =
        originName.substring(0, originName.lastIndexOf('-')) +
        originName.slice(originName.lastIndexOf('.'));
      if (modelTypes.includes(type)) modelNumber = modelNumber + 1;
      const obj = {
        ...curr,
        type,
        groupName,
        isDownload: false,
        isView: false,
        viewColor:
          modelTypes.includes(type) && modelNumber <= 20 ? viewColors[modelNumber - 1] : null,
        isChecked: false,
      };
      return acc.concat(obj);
    }, []);
  }, [partnerFileListCt.value]);

  const cloudFileListValue: CloudFile[] = useMemo(() => {
    let modelNumber = 0;
    return cloudFileListCt.value?.reduce((acc: CloudFile[], curr: CloudFile) => {
      // uploadState: {0, 1}: loading, {2}: success, {3}: error
      // cloudDirectory: downlaod클릭시 링크
      const { originName } = curr;
      const type = originName.slice(originName.lastIndexOf('.') + 1);
      // 사용X
      const groupName =
        originName.substring(0, originName.lastIndexOf('-')) +
        originName.slice(originName.lastIndexOf('.'));
      if (modelTypes.includes(type)) modelNumber = modelNumber + 1;
      const obj = {
        ...curr,
        type,
        groupName,
        isDownload: false,
        isView: false,
        viewColor:
          modelTypes.includes(type) && modelNumber <= 20 ? viewColors[modelNumber - 1] : null,
        isChecked: false,
      };
      return acc.concat(obj);
    }, []);
  }, [cloudFileListCt.value]);

  // localFileList parsing
  const updateLocalFileList = useCallback(items => {
    // console.log('items', items);
    const returnValue = items?.reduce((acc: any[], curr: any, index: number) => {
      // console.log('curr', curr);
      const { id, file, name } = curr;
      const type = name.slice(name.lastIndexOf('.') + 1);
      // const id = index;
      const obj = {
        index,
        id,
        file: !!file ? file : curr,
        name,
        type,
        isView: false,
        isChecked: true,
      };
      return acc.concat(obj);
    }, []);

    // console.log('returnValue', returnValue);
    return returnValue;
  }, []);
  // toggleView 이전 파일 프리릭스 비교용
  const [filePrefixList, setFilePrefixList] = useState('');
  const [fileUrlList, setFileUrlList] = useState([]);

  // onChange cloueFileList: ProjectContainer 에서 cloudFileList변경에 따라 적용
  // init list after data fetch
  useEffect(() => {
    console.log('------------------------------- cloudFileList.value change');
    // console.log('cloudFileList.value', cloudFileList.value);
    console.log('cloudFileListValue', cloudFileListValue);
    cloudFileList.setValue(cloudFileListValue);
    viewModelFile.setValue([]);
    viewImageFile.setValue(null);
    viewHtmlFile.setValue(null);
  }, [cloudFileListCt.value]);

  useEffect(() => {
    console.log('------------------------------- partnerFileList.value change');
    // console.log('partnerFileList.value', partnerFileList.value);
    console.log('partnerFileListValue', partnerFileListValue);
    partnerFileList.setValue(partnerFileListValue);
    viewModelFile.setValue([]);
    viewImageFile.setValue(null);
    viewHtmlFile.setValue(null);
  }, [partnerFileListCt.value]);

  // onChange localFileInput: localFileInput의 변경에 따라 Context변수 변경(상위 onUpload이벤트에서 사용)
  useDidUpdateEffect(() => {
    // console.log(localFileInput.value, 'localFileInput.value');
    // localFileListCt.setValue(localFileListValue);
    localFileListCt.setValue((draft: any) =>
      draft.concat(updateLocalFileList(localFileInput.value)),
    );
  }, [localFileInput.value]);

  // onChange checkAll
  useDidUpdateEffect(() => {
    console.log('checkAllCloud.value', checkAllCloud.value);
    // console.log('cloudFileListCt', cloudFileListCt);
    cloudFileList.setValue((draft: any) => {
      return draft.reduce((acc: any[], curr: any) => {
        if (checkAllCloud.value === true) {
          curr.isChecked = true;
        } else {
          curr.isChecked = false;
        }

        return acc.concat(curr);
      }, []);
    });
  }, [checkAllCloud.value]);

  // useEffect(() => {
  //   console.log('fileUrlList', fileUrlList);
  // }, [fileUrlList]);
  // useEffect(() => {
  //   console.log('viewModelFile.value', viewModelFile.value);
  // }, [viewModelFile.value]);

  const handleClickCloudFile = useCallback(
    async (e: any, id: number, data = { action: '', shareType: '', value: null }) => {
      const { action, shareType, value } = data;
      const currentCloudFileList = shareType === 'partner' ? partnerFileList : cloudFileList;
      const otherCloudFileList = shareType === 'partner' ? cloudFileList : partnerFileList;

      if (action === 'checkCloudFile') {
        currentCloudFileList.setValue(
          currentCloudFileList.value.reduce((acc: any[], curr: any) => {
            if (curr.cloudDataIdx === id) {
              curr.isChecked = !curr.isChecked;
            } else {
              // curr.isChecked = false;
            }
            return acc.concat(curr);
          }, []),
        );

        if (otherCloudFileList.value.find((item: CloudFile) => item.isChecked)) {
          otherCloudFileList.setValue(
            otherCloudFileList.value.reduce((acc: any[], curr: any) => {
              curr.isChecked = false;
              return acc.concat(curr);
            }, []),
          );
        }

        if (localFileListCt.value.find((item: LocalFile) => item.isChecked)) {
          localFileListCt.setValue(
            localFileListCt.value.reduce((acc: any[], curr: any) => {
              curr.isChecked = false;
              return acc.concat(curr);
            }, []),
          );
        }
      }

      if (action === 'toggleViewCloudHtmlFile') {
        const { data } = await fetchProjectFileDownloadUrl({ cloudDataIdx: id });
        const { signedUrl } = data;

        if (!signedUrl) return;
        console.log(signedUrl);

        const { data: fileData } = await axs({
          url: signedUrl,
          method: 'get',
          responseType: 'text',
        });

        if (!fileData) return;
        console.log('fileData,', fileData);

        // const iframe = document.getElementById('htmlViewerRef') as HTMLIFrameElement;
        const iframe = htmlViewerRef.current as HTMLIFrameElement;
        if (!iframe) return;
        // const iframedoc = (iframe?.contentDocument || iframe?.contentWindow?.document) as Document;
        iframe.srcdoc = 'data:text/html;charset=utf-8,' + fileData;
        // iframe.srcdoc = fileData;
        // iframedoc.open('text/html', 'replace');
        // iframedoc.write(fileData);
        // iframedoc.close();

        // html 파일 view 클릭시 나머지 view 다 꺼짐
        currentCloudFileList.setValue(
          currentCloudFileList.value.reduce((acc: any[], curr: any) => {
            if (curr.cloudDataIdx === id) {
              curr.isView = !curr.isView;
              viewHtmlFile.setValue(curr.isView ? true : null);
            } else {
              curr.isView = false;
            }
            return acc.concat(curr);
          }, []),
        );

        // ModelViewer컴포넌트 끄기
        viewModelFile.setValue([]);
        viewImageFile.setValue(null);

        return;
      }

      if (action === 'toggleViewCloudImageFile') {
        const { data } = await fetchProjectFileDownloadUrl({ cloudDataIdx: id });
        const { signedUrl } = data;

        if (!signedUrl) return;

        const { data: fileData } = await axs({
          url: signedUrl,
          method: 'get',
          responseType: 'blob',
        });

        if (!fileData) return;

        const file = await getFileDataUrl(fileData);
        console.log('img file', file);

        // view 클릭시 나머지 view 다 꺼짐
        currentCloudFileList.setValue(
          currentCloudFileList.value.reduce((acc: any[], curr: any) => {
            if (curr.cloudDataIdx === id) {
              curr.isView = !curr.isView;
              viewImageFile.setValue(curr.isView ? file : null);
            } else {
              curr.isView = false;
            }
            return acc.concat(curr);
          }, []),
        );

        // ModelViewer컴포넌트 끄기
        viewModelFile.setValue([]);
        viewHtmlFile.setValue(null);

        return;
      }

      // TODO: 기존 기능 추가(그룹및 타입별 파일 보기)
      if (action === 'toggleViewCloudModelFile') {
        // file name format YYYY-MM-DD_case ID-다른이름.stl
        const { name, type, groupName, isView, viewColor, url, resourceFileList = [] } = value;

        let file: any = null;
        try {
          const { data } = await fetchProjectFileDownloadUrl({ cloudDataIdx: id });
          const { signedUrl } = data;

          if (!signedUrl) return;

          const { data: fileData } = await axs({
            url: signedUrl,
            method: 'get',
            responseType: 'blob',
          });

          if (!fileData) return;

          const file = await getFileDataUrl(fileData);

          const modelData = {
            isView: !isView,
            viewColor,
            isValidObj: true,
            name,
            url: file,
            id,
            // textureUrl: !!textureUrl ? `${textureUrl}&token=${accessToken}` : '',
            // mtlUrl: !!mtlUrl ? `${mtlUrl}&token=${accessToken}` : '',
          };

          viewModelFile.setValue((draft: any) => {
            // 최초 생성
            if (!draft.length) {
              return draft.concat(modelData);
            } else {
              // re click 경우
              if (draft.some((item: any) => item.id === id)) {
                return draft.filter((item: any) => item.id !== id);
              } else {
                return draft.concat(modelData);
              }
            }
          });

          // ui view toggle
          currentCloudFileList.setValue((draft: any) => {
            return draft.reduce((acc: any[], curr: any) => {
              if (curr.cloudDataIdx === id) {
                curr.isView = !curr.isView;
              } else {
                // curr.isView = false;
              }
              // else if (curr.groupName === groupName) {
              //   // curr.isView = false;
              // }

              return acc.concat(curr);
            }, []);
          });

          // 컴포넌트 끄기
          viewHtmlFile.setValue(null);
          viewImageFile.setValue(null);
        } catch (error) {
          AppActions.show_toast({
            type: 'error',
            message: (error as { message: string })?.message,
          });
        }

        // let signedUrl = '';
        // if (!signedUrl) return;
        // // TODO: 발급받은 url로 교체
        // const currentUrl = `${signedUrl}`;
        // const modelData = {
        //   isView: !isView,
        //   viewColor,
        //   isValidObj: true,
        //   name,
        //   url: currentUrl,
        //   // textureUrl: !!textureUrl ? `${textureUrl}&token=${accessToken}` : '',
        //   // mtlUrl: !!mtlUrl ? `${mtlUrl}&token=${accessToken}` : '',
        // };
        // console.log('modelData', modelData);

        // console.log('viewModelFile.value.prefixName', viewModelFile.value.prefixName);
        // console.log('groupName', groupName);
        // const isSameGroup = viewModelFile.value.prefixName === groupName;

        // validation check
        // if (!isValidObj) {
        //   return AppActions.show_toast({
        //     type: 'error',
        //     message: 'This is not valid file.\n Please check your file source.',
        //   });
        // }

        // viewModelFile.setValue((draft: any) => {
        //   // 최초 생성
        //   if (!draft.length) {
        //     return draft.concat(modelData);
        //   } else {
        //     // re click 경우
        //     if (draft.some((item: any) => item.id === id)) {
        //       return draft.filter((item: any) => item.id !== id);
        //     } else {
        //       return draft.concat(modelData);
        //     }
        //   }
        // });

        // // ui view toggle
        // currentCloudFileList.setValue((draft: any) => {
        //   return draft.reduce((acc: any[], curr: any) => {
        //     if (curr.cloudDataIdx === id) {
        //       curr.isView = !isView;
        //     } else {
        //       // curr.isView = false;
        //     }
        //     // else if (curr.groupName === groupName) {
        //     //   // curr.isView = false;
        //     // }

        //     return acc.concat(curr);
        //   }, []);
        // });

        // // 컴포넌트 끄기
        // viewHtmlFile.setValue(null);
        // viewImageFile.setValue(null);

        return;
      }

      // if (action === 'toggleViewCloudModelFile') {
      //   // file name format YYYY-MM-DD_case ID-다른이름.stl
      //   const { name, type, groupName, isView, viewColor, url, resourceFileList = [] } = value;

      //   // image, html 끄기
      //   currentCloudFileList.setValue((draft: any) => {
      //     return draft.reduce((acc: any[], curr: any) => {
      //       if ([...imgTypes, 'html'].includes(curr.type)) {
      //         curr.isView = false;
      //       }
      //       return acc.concat(curr);
      //     }, []);
      //   });

      //   // 연결 resourceFile 찾기
      //   const resourceFileListValue = currentCloudFileList.value.filter((item: any) =>
      //     resourceFileList.includes(item.cloudDataIdx),
      //   );
      //   // mtl file
      //   const mtlUrl = resourceFileListValue.find(
      //     (item: any) => item.type === 'mtl',
      //   )?.viewDirectory;
      //   // texture file, 없을 경우에는 check no
      //   let textureUrl = '';
      //   if (!!resourceFileListValue.length) {
      //     textureUrl = resourceFileListValue.find((item: any) => {
      //       // console.log([...imgTypes].includes(item.type));
      //       return [...imgTypes].includes(item.type);
      //     })?.viewDirectory;
      //   }
      //   // console.log('textureUrl', textureUrl);

      //   // url여부로 3d canvas show 결정, url값을 주지 않을 경우 modelViewer valid 체크에서 걸림
      //   let isValidObj = true;
      //   if (type === 'obj') {
      //     isValidObj = !!textureUrl && !!mtlUrl;
      //   }

      //   let signedUrl = '';
      //   if (!signedUrl) return;
      //   // TODO: 발급받은 url로 교체
      //   const currentUrl = `${signedUrl}`;
      //   const modelData = {
      //     isView: !isView,
      //     viewColor,
      //     isValidObj,
      //     name,
      //     url: currentUrl,
      //     textureUrl: !!textureUrl ? `${textureUrl}&token=${accessToken}` : '',
      //     mtlUrl: !!mtlUrl ? `${mtlUrl}&token=${accessToken}` : '',
      //   };
      //   // console.log('modelData', modelData);

      //   // console.log('viewModelFile.value.prefixName', viewModelFile.value.prefixName);
      //   // console.log('groupName', groupName);
      //   // const isSameGroup = viewModelFile.value.prefixName === groupName;

      //   // validation check
      //   if (!isValidObj) {
      //     return AppActions.show_toast({
      //       type: 'error',
      //       message: 'This is not valid file.\n Please check your file source.',
      //     });
      //   }

      //   viewModelFile.setValue((draft: any) => {
      //     // 최초 생성
      //     if (!draft.length) {
      //       return draft.concat(modelData);
      //     } else {
      //       // re click 경우
      //       if (draft.some((item: any) => item.url === currentUrl)) {
      //         return draft.filter((item: any) => item.url !== currentUrl);
      //       } else {
      //         return draft.concat(modelData);
      //       }
      //     }
      //   });

      //   // ui view toggle
      //   currentCloudFileList.setValue((draft: any) => {
      //     return draft.reduce((acc: any[], curr: any) => {
      //       if (curr.cloudDataIdx === id) {
      //         curr.isView = !isView;
      //       } else {
      //         // curr.isView = false;
      //       }
      //       // else if (curr.groupName === groupName) {
      //       //   // curr.isView = false;
      //       // }

      //       return acc.concat(curr);
      //     }, []);
      //   });

      //   // 컴포넌트 끄기
      //   viewHtmlFile.setValue(null);
      //   viewImageFile.setValue(null);

      //   return;
      // }

      // TODO: link 변경 예정
      if (action === 'downloadCloudFile') {
        const { name } = value as { name: string };

        try {
          const { data } = await fetchProjectFileDownloadUrl({ cloudDataIdx: id });
          const { signedUrl } = data;

          downloadFile({
            url: signedUrl,
            name,

            success() {
              cloudFileList.setValue((draft: any) => {
                return draft.reduce((acc: any[], curr: any) => {
                  if (curr.cloudDataIdx === id) {
                    curr.isDownload = true;
                  }

                  return acc.concat(curr);
                }, []);
              });

              const createHistoryData = {
                projectCode,
                type: projectEventType.fileDownload,
                params: {
                  content: `${company}, ${name}`,
                },
              };
              ProjectActions.create_project_history_request(createHistoryData);
            },
          });
        } catch (error) {
          AppActions.show_toast({
            type: 'error',
            message: (error as { message: string })?.message,
          });
        }

        // console.log('value', value);
        // console.log('`${url}&token=${accessToken}`', `${url}&token=${accessToken}`);
        // if (disabled) {
        //   AppActions.add_popup({
        //     isOpen: true,
        //     title: <T>GLOBAL_ALERT</T>,
        //     content: <T>PROJECT_DOWNLOAD_ALARM</T>,
        //     isTitleDefault: true,
        //     isContentDefault: true,
        //   });

        //   return;
        // }

        // downloadFile({
        //   url: signedUrl,
        //   name,
        //   // config: {
        //   //   headers: {
        //   //     'x-access-token': accessToken,
        //   //   },
        //   // },
        //   success() {
        //     cloudFileList.setValue((draft: any) => {
        //       return draft.reduce((acc: any[], curr: any) => {
        //         if (curr.cloudDataIdx === id) {
        //           curr.isDownload = true;
        //         }

        //         return acc.concat(curr);
        //       }, []);
        //     });

        //     const createHistoryData = {
        //       projectCode,
        //       type: projectEventType.fileDownload,
        //       params: {
        //         content: `${company}, ${name}`,
        //       },
        //     };
        //     ProjectActions.create_project_history_request(createHistoryData);
        //   },
        // });
        return;
      }

      if (action === 'deleteCloudFile') {
        const { name } = value;
        const deleteData = {
          projectCode,
          cloudFileList: [id],
        };
        console.log('deleteData-', deleteData);
        // request api - delete
        BinActions.delete_project_file_request(deleteData);

        const createHistoryData = {
          projectCode,
          type: projectEventType.fileDelete,
          params: {
            content: `${company}, ${name}`,
          },
        };
        ProjectActions.create_project_history_request(createHistoryData);
        return;
      }
    },
    [cloudFileList.value, localFileListCt.value],
  );

  // projectFile delete 한후 fetch
  // response deleteProjectFileSuccess
  useDidUpdateEffect(() => {
    if (deleteProjectFileSuccess) {
      FileActions.fetch_project_files_request(projectCode);
    }
  }, [deleteProjectFileSuccess]);

  const handleClickLocalFile = useCallback(
    async (e, id, data = { action: '', value: null }) => {
      const { action, value } = data;
      console.log('id', id);
      console.log('data', data);

      if (action === 'checkLocalFile') {
        localFileListCt.setValue((draft: any) => {
          return draft.reduce((acc: any[], curr: any) => {
            if (curr.id === id) curr.isChecked = !curr.isChecked;

            return acc.concat(curr);
          }, []);
        });

        if (cloudFileList.value.find((item: CloudFile) => item.isChecked)) {
          cloudFileList.setValue(
            cloudFileList.value.reduce((acc: any[], curr: any) => {
              curr.isChecked = false;
              return acc.concat(curr);
            }, []),
          );
        }

        if (partnerFileList.value.find((item: CloudFile) => item.isChecked)) {
          partnerFileList.setValue(
            partnerFileList.value.reduce((acc: any[], curr: any) => {
              curr.isChecked = false;
              return acc.concat(curr);
            }, []),
          );
        }
      }

      if (action === 'toggleViewLocalHtmlFile') {
        const { isView, file } = value;

        // html 파일 view 클릭시 나머지 view 다 꺼짐
        localFileListCt.setValue((draft: any) => {
          return draft.reduce((acc: any[], curr: any) => {
            if (curr.id === id) {
              curr.isView = !isView;
            } else {
              curr.isView = false;
            }
            return acc.concat(curr);
          }, []);
        });

        // ModelViewer컴포넌트 끄기
        viewModelFile.setValue([]);
        viewImageFile.setValue(null);
        const dataUrl = await getFileDataUrl(file);
        console.log('file', file);
        console.log('dataUrl', dataUrl);
        viewHtmlFile.setValue(dataUrl);
        // viewHtmlFile.setValue(file);

        return;
      }

      // TEMP:
      if (action === 'toggleViewLocalModelFile') {
        // file name format YYYY-MM-DD_case ID-다른이름.stl
        const {
          name,
          type,
          groupName,
          isView,
          viewColor,
          file: fileData,
          resourceFileList = [],
        } = value;

        // image, html 끄기
        localFileListCt.setValue((draft: any) => {
          return draft.reduce((acc: any[], curr: any) => {
            if ([...imgTypes, 'html'].includes(curr.type)) {
              curr.isView = false;
            }
            return acc.concat(curr);
          }, []);
        });

        // const objectData = await getFile3dModelUrl(file);
        // console.log('objectData', objectData);

        const file = await getFileDataUrl(fileData);

        const modelData = {
          isView: !isView,
          // viewColor,
          isValidObj: true,
          name,
          // url: objectData,
          url: file,
          // textureUrl: !!textureUrl ? `${textureUrl}&token=${accessToken}` : '',
          // mtlUrl: !!mtlUrl ? `${mtlUrl}&token=${accessToken}` : '',
        };

        viewModelFile.setValue((draft: any) => {
          // 최초 생성
          if (!draft.length) {
            return draft.concat(modelData);
          } else {
            // re click 경우
            if (draft.some((item: any) => item.name === name)) {
              return draft.filter((item: any) => item.name !== name);
            } else {
              return draft.concat(modelData);
            }
          }
        });

        // ui view toggle
        localFileListCt.setValue((draft: any) => {
          return draft.reduce((acc: any[], curr: any) => {
            if (curr.id === id) {
              curr.isView = !isView;
            } else {
              // curr.isView = false;
            }
            // else if (curr.groupName === groupName) {
            //   // curr.isView = false;
            // }

            return acc.concat(curr);
          }, []);
        });

        // 컴포넌트 끄기
        viewHtmlFile.setValue(null);
        viewImageFile.setValue(null);

        return;
      }

      if (action === 'toggleViewLocalImageFile') {
        const { isView, file } = value;

        // view 클릭시 나머지 view 다 꺼짐
        localFileListCt.setValue((draft: any) => {
          return draft.reduce((acc: any[], curr: any) => {
            if (curr.id === id) {
              curr.isView = !isView;
            } else {
              curr.isView = false;
            }
            return acc.concat(curr);
          }, []);
        });

        // ModelViewer컴포넌트 끄기
        viewModelFile.setValue([]);
        viewHtmlFile.setValue(null);
        // const currentUrl = !isView ? `${url}&token=${accessToken}` : null;
        const dataUrl = await getFileDataUrl(file);
        console.log('dataUrl', dataUrl);
        viewImageFile.setValue(dataUrl);

        return;
      }

      if (action === 'deleteLocalFile') {
        localFileListCt.setValue((draft: any) => draft.filter((item: any) => item.id !== id));
        // console.log('ref.current', ref.current.files[0]);
        // console.log('ref.current', ref.current.files[1]);
        localFileInputRef.current.value = null;
        return;
      }
    },
    [localFileListCt.value, cloudFileList, partnerFileList],
  );

  // TEST:
  // useEffect(() => {
  //   console.log('viewImageFile', viewImageFile.value);
  // }, [viewImageFile.value]);

  const handleAddLocalFiles = (data: any) => {
    // console.log('data', data);
    const { dropFiles } = data;
    // console.log('dropFiles', dropFiles);
    // localFileInput.setValue((draft:any) => draft.concat(dropFiles));
    localFileInput.setValue(dropFiles);
    if (cloudFileList.value?.find((item: CloudFile) => item.isChecked)) {
      cloudFileList.setValue(
        cloudFileList.value.reduce((acc: any[], curr: any) => {
          curr.isChecked = false;
          return acc.concat(curr);
        }, []),
      );
    }
    if (partnerFileList.value?.find((item: CloudFile) => item.isChecked)) {
      partnerFileList.setValue(
        partnerFileList.value.reduce((acc: any[], curr: any) => {
          curr.isChecked = false;
          return acc.concat(curr);
        }, []),
      );
    }
  };

  useDidUpdateEffect(() => {
    if (uploadProjectFileSuccess) {
      localFileInput.setValue([]);
      localFileInputRef.current.value = null;
    }
  }, [!!uploadProjectFileSuccess]);

  // SECTION: DidMount

  // init api 요청
  useEffect(() => {
    PartnerActions.fetch_sync_partners_request({ keyword: '', page: 1 });
  }, []);

  // SECTION: DidUpdate

  return (
    <ProjectUpload
      hasViewer={hasViewer}
      hasUpload={hasUpload}
      viewType={viewType}
      isEdit={isEdit}
      checkAllLocal={checkAllLocal}
      checkAllCloud={checkAllCloud}
      localFileInput={localFileInput}
      localFileInputRef={localFileInputRef}
      localFileListCt={localFileListCt}
      partnerFileList={partnerFileList}
      cloudFileList={cloudFileList}
      viewModelFile={viewModelFile}
      htmlViewerRef={htmlViewerRef}
      viewHtmlFile={viewHtmlFile}
      viewImageFile={viewImageFile}
      onClickCloudFile={handleClickCloudFile}
      onClickLocalFile={handleClickLocalFile}
      onAddLocalFiles={handleAddLocalFiles}
      //
      syncPartners={syncPartners}
      hasMoreSyncPartners={hasMoreSyncPartners}
      selectedSyncPartner={selectedSyncPartner}
      onFetchSyncPartners={handleFetchSyncPartners}
      onSearchSyncPartners={handleSearchSyncPartners}
    />
  );
}

export default ProjectUploadContainer;
