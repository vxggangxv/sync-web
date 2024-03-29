import React from 'react';

const FilterIcon = ({ width = 0, color = '#fff' }) => {
  const widthValue = 14.266;
  const heightValue = 13.569;
  const convertHeight = !!width ? (heightValue * width) / widthValue : null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || widthValue}
      height={convertHeight || heightValue}
      viewBox="0 0 14.266 13.569"
    >
      <g id="icon_filter" transform="translate(0 -0.679)">
        <path
          id="path_20828"
          data-name="path 20828"
          d="M7.133.679C3.193.679,0,1.478,0,2.462V4.6c0,.435.623.833,1.657,1.142l4.228,5.115v3.389h.859l1.637-.988v-2.4l4.227-5.115c1.035-.309,1.658-.707,1.658-1.142V2.462C14.266,1.478,11.073.679,7.133.679Zm0,.713c3.506,0,5.806.641,6.346,1.07-.54.429-2.839,1.069-6.346,1.069S1.328,2.891.787,2.462C1.328,2.033,3.627,1.392,7.133,1.392Z"
          fill={color}
        />
      </g>
    </svg>
  );
};

export default React.memo(FilterIcon);
