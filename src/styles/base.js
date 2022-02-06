import { css, createGlobalStyle } from 'styled-components';
import reset from 'styled-reset';
import {
  fontFamilyValue,
  fontFamily,
  disableDrag,
  device,
  color,
  flexAlignItemsCenter,
  scrollWidth,
} from 'styles/utils';
import { ENV_MODE_PROD } from 'lib/setting';

// * { ${ENV_MODE_PROD && disableDrag} }
const globalStyle = css`
  ${reset};
  * {
    box-sizing: border-box !important;
  }
  *[tabIndex],
  input,
  textarea,
  select,
  a,
  button {
    outline: none;
    box-shadow: none;
  }
  input,
  textarea {
    font-family: ${fontFamilyValue} !important;
  }
  b {
    font-weight: 700;
  }
  a {
    text-decoration: none;
    color: inherit;
  }
  body {
    ${fontFamily}
    /* font-size: 14px; */
    color: #333;
  }
  /* set width, height 100% */
  body,
  #root {
    /* position: absolute;
    min-width: 100%;
    min-height: 100%; */
  }
  .hidden {
    display: none !important;
  }
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    overflow: hidden;
    padding: 0;
    margin: -1px;
    border: 0;
    clip: rect(1px, 1px, 1px, 1px);
  }
  .cf:after {
    content: '';
    display: table;
    clear: both;
  }
  .padding-none {
    padding: 0 !important;
  }
  .margin-none {
    margin: 0 !important;
  }
  .cursor-pointer {
    cursor: pointer !important;
  }
  .cursor-default {
    cursor: default !important;
  }
  .input-reset,
  .btn-reset {
    padding: 0;
    border: none;
    background: none;
    font: inherit;
    color: inherit;
    cursor: pointer;
  }
  .hr-reset {
    margin: 0;
    border: 0;
  }
  .font-italic {
    font-style: italic;
  }
  button:disabled {
    color: rgba(0, 0, 0, 0.26);
    cursor: default;
  }
  .flex-center {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .inline-flex-center {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }
  .infinite-scroll-loading {
    display: flex;
    align-items: center;
    justify-content: center;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 100%;
  }
  /* custom scrollbar */
  ::-webkit-scrollbar {
    width: ${scrollWidth};
    /* background-color: white; */
    /* border-radius: 10px; */
    /* transition: width 0.3s; */
  }
  ::-webkit-scrollbar-track {
    /* background-color: rgba(244, 245, 250, 0.7); */
    /* background-color: #f4f5fa; */
    /* background-clip: padding-box; */
    /* border: 5px solid transparent; */
    border-radius: 10px;
    &:hover {
      background-color: #f4f5fa;
    }
  }
  ::-webkit-scrollbar-thumb {
    /* background-color: rgba(0, 0, 0, 0.2); */
    background-color: #33b5e433;
    background-clip: padding-box;
    border: 5px solid transparent;
    border-radius: 10px;
    &:hover {
      /* background-color: rgba(0, 0, 0, 0.6); */
      /* background-color: rgba(51, 181, 228, 1); */
      /* background-color: rgba(51, 181, 228, 1); */
    }
  }
  .main-layout {
    position: relative;
    width: ${`${device.lg}px`};
    padding: 0 ${`${device.lgPadding}px`};
    /* width: 1200px; */
    margin: 0 auto;
  }
  .sub-layout {
    position: relative;
    width: 1020px;
    margin: 0 auto;
  }
  .radius-circle {
    border-radius: 50%;
  }
  .box-shadow-default {
    box-shadow: 0px 0px 6px rgba(0, 0, 0, 0.16);
  }
  // inset btn shadow
  .btn-inset-shadow-default {
    box-shadow: inset 3px 3px 6px rgba(0, 0, 0, 0.16);
  }
  .text-overflow-ellipis {
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
  // Mui Global styles
  // MuiGrid-item
  .MuiGrid-item {
    word-break: break-word;
  }
  // .MuiTypography-root[class*='MuiTypography-body'] {}
  .MuiPopover-root .MuiList-root .MuiMenuItem-root,
  .MuiTableCell-root.MuiTableCell-head,
  .MuiTableCell-root.MuiTableCell-body {
    font-family: ${fontFamilyValue};
    font-size: 14px;
  }
  .MuiTableCell-root.MuiTableCell-head,
  .MuiTableCell-root.MuiTableCell-body {
    color: ${color.black_font};
    border-bottom-color: ${color.gray_border2};
  }
`;

export default createGlobalStyle`
  ${globalStyle}
`;
