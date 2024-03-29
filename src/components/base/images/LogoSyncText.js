import React from 'react';

export default React.memo(({ width, height, color = '#151515' }) => {
  const widthValue = 63.636;
  const heightValue = 15.204;
  const convertHeight = !!width ? (heightValue * width) / widthValue : null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || widthValue}
      height={convertHeight || heightValue}
      viewBox="0 0 63.636 15.204"
    >
      <g id="logo_sync_text" transform="translate(0)">
        <path
          id="path_4974"
          data-name="path 4974"
          d="M288.65,251.884v-2.592h6.467a3.634,3.634,0,0,0,1.87-.345,1.28,1.28,0,0,0,.668-1.147,1.2,1.2,0,0,0-.668-1.011,9.986,9.986,0,0,0-1.665-.812q-1-.389-2.171-.81a12.972,12.972,0,0,1-2.169-1,6.191,6.191,0,0,1-1.665-1.378,2.957,2.957,0,0,1-.668-1.959,3.145,3.145,0,0,1,.45-1.653,4.261,4.261,0,0,1,1.242-1.3,6.247,6.247,0,0,1,1.91-.853,9.239,9.239,0,0,1,2.43-.3H301.2V239.3l-6.544-.008a3.236,3.236,0,0,0-1.766.389,1.288,1.288,0,0,0-.695,1.126,1.262,1.262,0,0,0,.668,1.053,9.818,9.818,0,0,0,1.665.854q1,.41,2.169.832a13.273,13.273,0,0,1,2.171,1,6.455,6.455,0,0,1,1.665,1.359,2.814,2.814,0,0,1,.668,1.9,3.405,3.405,0,0,1-1.665,2.99,8.1,8.1,0,0,1-4.5,1.1Z"
          transform="translate(-288.65 -236.722)"
          fill={color}
        />
        <path
          id="path_4975"
          data-name="path 4975"
          d="M304.085,236.722l2.925,6.169,2.926-6.169h4l-5.154,9.556v5.648h-3.548v-5.648l-5.154-9.556Z"
          transform="translate(-283.969 -236.722)"
          fill={color}
        />
        <path
          id="path_4976"
          data-name="path 4976"
          d="M337.4,249.32H331.2a2.79,2.79,0,0,1-1.954-.609,1.912,1.912,0,0,1-.661-1.455v-5.865a1.915,1.915,0,0,1,.661-1.456,2.8,2.8,0,0,1,1.954-.607H337.4v-2.606H330.93a8.09,8.09,0,0,0-2.6.379,5.1,5.1,0,0,0-1.844,1.054,4.439,4.439,0,0,0-1.1,1.553,4.824,4.824,0,0,0-.372,1.9v5.431a4.849,4.849,0,0,0,.372,1.889,4.4,4.4,0,0,0,1.1,1.565,5.079,5.079,0,0,0,1.844,1.053,8.049,8.049,0,0,0,2.6.381H337.4Z"
          transform="translate(-273.76 -236.722)"
          fill={color}
        />
        <path
          id="path_4977"
          data-name="path 4977"
          d="M315.856,236.722l6.768,9.21v-9.21h3.548v15.2H322.9l-6.768-9.21v9.21h-3.548v-15.2Z"
          transform="translate(-278.85 -236.722)"
          fill={color}
        />
      </g>
    </svg>
  );
});
