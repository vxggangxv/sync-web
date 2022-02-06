import { Checkbox } from '@material-ui/core';
import { teeth_v2_bg } from 'components/base/images';
import CustomMuiCheckbox from 'components/common/checkbox/CustomMuiCheckbox';
import useCheckInput from 'lib/hooks/useCheckInput';
import useCheckOneInput from 'lib/hooks/useCheckOneInput';
import { number } from 'prop-types';
import React, { Fragment, useEffect, useState } from 'react';
import styled from 'styled-components';
import { color } from 'styles/utils';
import ListBackgroundVerticalDivision from 'components/common/background/ListBackgroundVeticalDivision';
import useCheckSetInput from 'lib/hooks/useCheckSetInput';

interface ProjectFileUploadProps {
  files?: object[] | any;
  hasCheckbox?: boolean;
  checkedFiles?: { value: object; onChange: (e: any) => void; setValue: React.Dispatch<any> } | any;
  listHeight?: number;
  divisionNumber?: number;
  buttonContent?: React.ReactNode;
}

// TEMP: 임시 데이터 포맷
const filesData = Array.from({ length: 50 }).map((item, idx) => ({
  id: idx,
  name: `abuntment_${idx}.stl`,
}));

function ProjectFileUpload({
  files = filesData,
  hasCheckbox = false,
  checkedFiles,
  listHeight = 370,
  divisionNumber = 2,
  buttonContent,
}: ProjectFileUploadProps) {
  // const isModal = contentType === 'modal';
  // const projectListDivisionNumber = isModal ? 3 : 5;
  // const checkedFiles = useCheckSetInput(new Set([]));

  // 1. checked 객체 만들기
  // 2. checkedFiles = useInput([]); 배열로 생성, checkbox 기능의 컴포넌트 클릭시 배열로 id 값을 담아줌(마치 multi selecbox 와 같은 기능)
  // const files = Array.from({ length: 50 }).map((item, idx) => ({
  //   id: idx,
  //   name: `abuntment_${idx}.stl`,
  // }));

  // // multi checkbox 초기값 객체생성
  // const checkFilesInitialValue = files.reduce((acc, curr) => {
  //   return (acc = { ...acc, ['file-' + curr.id]: false });
  // }, {});
  // const checkedFiles = useCheckInput(checkFilesInitialValue);
  // // data 요청할 id를 가진 배열 생성
  // const checkedFilesSubmitValue = Object.entries(checkedFiles.value).reduce(
  //   (acc, [key, value], index) => {
  //     const checkedId = Number(key.slice(key.indexOf('-') + 1));
  //     if (value) return acc.concat(checkedId);
  //     return acc;
  //   },
  //   [] as number[],
  // );

  // TEST:
  // useEffect(() => {
  //   console.log('checkFilesInitialValue', checkFilesInitialValue);
  // }, [checkFilesInitialValue]);
  // useEffect(() => {
  //   console.log('checkedFiles.value', checkedFiles.value);
  // }, [checkedFiles.value]);
  // useEffect(() => {
  //   console.log('checkedFilesSubmitValue', checkedFilesSubmitValue);
  // }, [checkedFilesSubmitValue]);

  return (
    <StyledProjectFileUpload listHeight={listHeight}>
      <div className="projectFileUpload__list_container">
        <ListBackgroundVerticalDivision divisionNumber={divisionNumber} />

        <div className="projectFileUpload__list_box">
          <div className="projectFileUpload__list">
            {files.map((item: any, idx: number) => (
              <Fragment key={idx}>
                <ProjectFileItem
                  hasCheckbox={hasCheckbox}
                  width={100 / divisionNumber + '%'}
                  file={item}
                  checkedFiles={checkedFiles}
                />
              </Fragment>
            ))}
          </div>
        </div>
      </div>
      {buttonContent && buttonContent}
    </StyledProjectFileUpload>
  );
}

const StyledProjectFileUpload = styled.div<{ listHeight: number }>`
  position: relative;
  width: 100%;

  .projectFileUpload__list_container {
    position: relative;
    z-index: 1;
    width: 100%;
    height: ${({ listHeight }) => listHeight}px;
  }
  .projectFileUpload__list_bg {
    display: flex;
    position: absolute;
    top: 0px;
    width: 100%;
    height: 100%;
    background-color: #fafafd;
    border-radius: 15px;
    .projectFileUpload__list_bg_item {
      height: 100%;
      border-right: 1px dashed ${color.gray_week};
    }
  }
  .projectFileUpload__list_box {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 10px 0;
    overflow-y: overlay;
    .projectFileUpload__list {
      display: flex;
      flex-wrap: wrap;
    }
  }
`;

export default React.memo(ProjectFileUpload);

interface ProjectFileItemProps {
  file: object | any;
  hasCheckbox?: boolean;
  checkedFiles?: { value: object; onChange: (e: any) => void; setValue: React.Dispatch<any> } | any;
  width?: string | number;
}

const ProjectFileItem = ({
  file,
  hasCheckbox,
  checkedFiles,
  width = '20%',
}: ProjectFileItemProps) => {
  // const checkedFile = useCheckOneInput(false);

  return (
    <StyledProjectFileItem width={width}>
      {hasCheckbox && (
        <div className="projectFileItem__checkbox">
          <CustomMuiCheckbox
            name={`file-${file.id}`}
            // checked={checkedFiles.value['file-' + file.id]}
            // onChange={checkedFiles.onChange}
            checked={checkedFiles.value.has(file.id)}
            onChange={() => checkedFiles.onChange({ value: file.id })}
          />
        </div>
      )}
      <div className="projectFileItem__teeth_img_box">
        <div className="projectFileItem__bg">
          <svg xmlns="http://www.w3.org/2000/svg" width="40" height="50" viewBox="0 0 40 50">
            <g
              id="패스_20964"
              data-name="패스 20964"
              transform="translate(259 -232)"
              fill="none"
              fillRule="evenodd"
            >
              <path
                d="M-223.179,282h-31.642A4.174,4.174,0,0,1-259,277.831V236.169A4.174,4.174,0,0,1-254.821,232h20.951a4.186,4.186,0,0,1,2.483.816l10.691,7.879a4.166,4.166,0,0,1,1.7,3.353v33.783A4.174,4.174,0,0,1-223.179,282Z"
                stroke="none"
              />
              <path
                d="M -223.1788177490234 281.4999694824219 C -221.1503143310547 281.4999694824219 -219.5 279.8541870117188 -219.5 277.8312377929688 L -219.5 244.0480499267578 C -219.5 242.8891296386719 -220.0579681396484 241.7859954833984 -220.9925384521484 241.0971832275391 L -231.6835784912109 233.2183837890625 C -232.3122863769531 232.755126953125 -233.0887298583984 232.4999847412109 -233.8698883056641 232.4999847412109 L -254.8211822509766 232.4999847412109 C -256.8497009277344 232.4999847412109 -258.5 234.1457824707031 -258.5 236.1687164306641 L -258.5 277.8312377929688 C -258.5 279.8541870117188 -256.8497009277344 281.4999694824219 -254.8211822509766 281.4999694824219 L -223.1788177490234 281.4999694824219 M -223.1788177490234 281.9999694824219 L -254.8211822509766 281.9999694824219 C -257.129150390625 281.9999694824219 -259 280.1336364746094 -259 277.8312377929688 L -259 236.1687164306641 C -259 233.8663177490234 -257.129150390625 231.9999847412109 -254.8211822509766 231.9999847412109 L -233.8698883056641 231.9999847412109 C -232.9763946533203 231.9999847412109 -232.1060180664062 232.2860260009766 -231.3869781494141 232.8158569335938 L -220.6959075927734 240.6946716308594 C -219.62939453125 241.4807434082031 -219 242.7249755859375 -219 244.0480499267578 L -219 277.8312377929688 C -219 280.1336364746094 -220.870849609375 281.9999694824219 -223.1788177490234 281.9999694824219 Z"
                stroke="none"
                fill="#17288a"
              />
            </g>
          </svg>
        </div>
        <img src={teeth_v2_bg} alt="teeth" />
      </div>
      <div className="projectFileItem__name text-overflow-ellipis" title={file.name}>
        {file.name}
      </div>
    </StyledProjectFileItem>
  );
};

const StyledProjectFileItem = styled.div<{ width: string | number }>`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  width: ${({ width }) => width};
  flex-wrap: wrap;

  .projectFileItem__checkbox {
    margin-left: -9px;
  }
  .projectFileItem__teeth_img_box {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: center;
    margin-right: 10px;
    width: 40px;
    height: 50px;
    border-radius: 5px;
    img {
      width: 21px;
    }

    .projectFileItem__bg {
      position: absolute;
      top: 0;
      left: 0;
    }
  }
  .projectFileItem__name {
    width: calc(100% - 40px - 43px);
    font-size: 13px;
  }
`;

/* {Array.from({ length: 50 }).map((item, idx) => (
              <Fragment key={idx}>
                <ProjectFileItem file={{ id: 1, name: 'abuntment_1.2.stl' }}  />
              </Fragment>
            ))} */
