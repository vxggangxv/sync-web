import React from 'react';

const ShareIcon = ({ width = 0, color = '#fff' }) => {
  const widthValue = 21.986;
  const heightValue = 20.009;
  const convertHeight = !!width ? (heightValue * width) / widthValue : null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || widthValue}
      height={convertHeight || heightValue}
      viewBox="0 0 21.986 20.009"
    >
      <g id="icon_share" transform="translate(-1552.852 -1612.491)">
        <path
          id="합치기_215"
          data-name="합치기 215"
          d="M5657.248-1916a12.242,12.242,0,0,1-.011-4.847,13.123,13.123,0,0,1,2.015-4.8,13.8,13.8,0,0,1,3.972-3.858,14.506,14.506,0,0,1,5.082-2.018v-3.226a.245.245,0,0,1,.4-.195l9.186,7.572a.253.253,0,0,1,0,.39l-9.186,7.572a.245.245,0,0,1-.4-.2v-4.065a7.568,7.568,0,0,0-2.794-.207,8.462,8.462,0,0,0-3.39,1.158,9.659,9.659,0,0,0-2.9,2.709,10.876,10.876,0,0,0-1.739,4.009Z"
          transform="translate(-4103.645 3548.001)"
          fill={color}
          stroke="rgba(0,0,0,0)"
          strokeMiterlimit="10"
          strokeWidth="1"
        />
      </g>
    </svg>
  );
};

export default React.memo(ShareIcon);
