import React from 'react';

const CloudUploadIcon = ({ width = 0, color = '#fff' }) => {
  const widthValue = 32;
  const heightValue = 23;
  const convertHeight = !!width ? (heightValue * width) / widthValue : null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || widthValue}
      height={convertHeight || heightValue}
      viewBox="0 0 32 23"
    >
      <g id="icon_cloud_upload" transform="translate(0 -4.5)">
        <g id="그룹_7950" data-name="그룹 7950">
          <path
            id="패스_29472"
            data-name="패스 29472"
            d="M27.586,12.712a6.509,6.509,0,0,0-7.932-3.946A9,9,0,0,0,3,13.3,6,6,0,0,0,6,24.5h6v-2H6a4,4,0,0,1-.91-7.9A6.921,6.921,0,0,1,5,13.5a7,7,0,0,1,13.7-2.025A4.5,4.5,0,0,1,25.973,14.5H26a4,4,0,0,1,0,8H20v2h6a6,6,0,0,0,1.586-11.788Z"
            fill={color}
          />
          <path id="패스_29473" data-name="패스 29473" d="M16,13.5l-5,6h3v8h4v-8h3Z" fill={color} />
        </g>
      </g>
    </svg>
  );
};

export default React.memo(CloudUploadIcon);
