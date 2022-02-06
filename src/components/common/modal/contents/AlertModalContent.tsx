import React, { useState, useEffect, useMemo, useRef } from 'react';
import styled from 'styled-components';

interface AlertModalContentProps {
  title?: string | null;
  mainText?: string | null;
  subText?: string | null;
}

/**
 * @param {AlertModalContentProps} { selectedPartner }
 * @return {*}
 */
function AlertModalContent({ title, mainText, subText }: AlertModalContentProps) {
  return (
    <StyledAlertModalContent data-component-name="AlertModalContent">
      <div className="alertModalContent__title_box">
        <h1 className="alertModalContent__title">{title}</h1>
        <div className="alertModalContent__title_underbar"></div>
      </div>
      <div className="alertModalContent__main_content_box">
        <p>{mainText}</p>
      </div>
      <div className="alertModalContent__sub_content_box">
        <p>{subText}</p>
      </div>
    </StyledAlertModalContent>
  );
}

const StyledAlertModalContent = styled.section<{}>`
  .alertModalContent__title_box {
    position: relative;
    padding-bottom: 12px;
    text-align: center;
    .alertModalContent__title {
      color: #0f0f0f;
      font-size: 22px;
      font-weight: 700;
    }
    .alertModalContent__title_underbar {
      position: absolute;
      width: 80px;
      height: 2px;
      background-color: #1da7e0;
      transform: translate(-50%, -50%);
      left: 50%;
      bottom: 0;
    }
  }

  .alertModalContent__main_content_box {
    width: inherit;
    height: 125px;
    padding: 0 35px;
    margin-left: -35px;
    margin-right: -35px;
    border-bottom: 1px dashed #707070;
    display: flex;
    align-items: center;
    justify-content: center;
    p {
      color: #303030;
      font-size: 20px;
      font-weight: 500;
      text-align: center;
      white-space: break-spaces;
    }
  }
  .alertModalContent__sub_content_box {
    height: 60px;
    padding: 10px 0 0 0;
    display: flex;
    justify-content: center;
    p {
      color: #bcbcbc;
      text-align: center;
      font-size: 13px;
      font-weight: 200;
      line-height: 25px;
      white-space: break-spaces;
    }
  }
`;

export default React.memo(AlertModalContent);
