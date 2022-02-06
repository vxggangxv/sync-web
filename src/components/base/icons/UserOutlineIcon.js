import React from 'react';

const UserOutlineIcon = ({ width = 0, color = '#00a4e3' }) => {
  const widthValue = 14.468;
  const heightValue = 15.32;
  const convertHeight = !!width ? (heightValue * width) / widthValue : null;

  return (
    <svg
      id="icon_user_outline"
      xmlns="http://www.w3.org/2000/svg"
      width={width || widthValue}
      height={convertHeight || heightValue}
      viewBox="0 0 14.468 15.32"
    >
      <path
        id="패스_1623"
        data-name="패스 1623"
        d="M130.718,313.119a3.678,3.678,0,1,1,3.678-3.678A3.682,3.682,0,0,1,130.718,313.119Zm0-6.542a2.864,2.864,0,1,0,2.864,2.864A2.867,2.867,0,0,0,130.718,306.577Z"
        transform="translate(-123.484 -305.763)"
        fill={color}
      />
      <path
        id="패스_1624"
        data-name="패스 1624"
        d="M132.364,333.1a.407.407,0,0,1-.407-.407,5.858,5.858,0,0,0-5.851-5.851h-1.138a5.857,5.857,0,0,0-5.851,5.851.407.407,0,0,1-.814,0,6.673,6.673,0,0,1,6.665-6.665h1.138a6.673,6.673,0,0,1,6.665,6.665A.407.407,0,0,1,132.364,333.1Z"
        transform="translate(-118.303 -317.782)"
        fill={color}
      />
    </svg>
  );
};

export default React.memo(UserOutlineIcon);
