import React from 'react';

const TrashIcon = ({ width = 0, color = '#b5b7c1' }) => {
  const widthValue = 13.441;
  const heightValue = 15.813;
  const convertHeight = !!width ? (heightValue * width) / widthValue : null;

  return (
    <svg
      id="icon_trash"
      data-name="그룹 7820"
      xmlns="http://www.w3.org/2000/svg"
      width={width || widthValue}
      height={convertHeight || heightValue}
      viewBox="0 0 13.441 15.813"
    >
      <path
        id="패스_21417"
        data-name="패스 21417"
        d="M1965.688,2051.544v-.435a.356.356,0,0,1,.356-.356h1.66a.356.356,0,0,1,.356.356v.435h.79v-.435a1.148,1.148,0,0,0-1.146-1.147h-1.66a1.148,1.148,0,0,0-1.146,1.147v.435Z"
        transform="translate(-1960.153 -2049.963)"
        fill={color}
      />
      <path
        id="패스_21418"
        data-name="패스 21418"
        d="M1646.015,2482.8l-1.052,9.12a.862.862,0,0,1-.856.763h-6.371a.862.862,0,0,1-.856-.763l-1.052-9.12h-.708c-.03,0-.059,0-.088,0l1.063,9.215a1.652,1.652,0,0,0,1.641,1.463h6.371a1.652,1.652,0,0,0,1.641-1.463l1.063-9.215c-.029,0-.058,0-.088,0Z"
        transform="translate(-1634.2 -2477.658)"
        fill={color}
      />
      <path
        id="패스_21419"
        data-name="패스 21419"
        d="M1576.513,2183.254h-9.534a1.956,1.956,0,0,0-1.954,1.953v.686a.92.92,0,0,0,.831.914c.029,0,.058,0,.088,0h11.6c.03,0,.059,0,.088,0a.92.92,0,0,0,.83-.914v-.686A1.956,1.956,0,0,0,1576.513,2183.254Zm.816,2.767h-11.385a.128.128,0,0,1-.128-.128v-.686a1.163,1.163,0,0,1,1.163-1.163h9.534a1.163,1.163,0,0,1,1.163,1.163v.686a.128.128,0,0,1-.128.128Z"
        transform="translate(-1565.025 -2181.673)"
        fill={color}
      />
      <path
        id="패스_21420"
        data-name="패스 21420"
        d="M2098.583,2590.241a.4.4,0,0,0,.4-.4v-6.326a.4.4,0,0,0-.791,0v6.326A.4.4,0,0,0,2098.583,2590.241Z"
        transform="translate(-2091.862 -2576.8)"
        fill={color}
      />
      <path
        id="패스_21421"
        data-name="패스 21421"
        d="M2298.816,2592.232a.4.4,0,0,0,.441-.343l.782-6.277a.4.4,0,1,0-.784-.1l-.782,6.277A.4.4,0,0,0,2298.816,2592.232Z"
        transform="translate(-2289.768 -2578.818)"
        fill={color}
      />
      <path
        id="패스_21422"
        data-name="패스 21422"
        d="M1832.738,2591.889a.4.4,0,0,0,.785-.1l-.782-6.277a.4.4,0,1,0-.785.1Z"
        transform="translate(-1828.786 -2578.818)"
        fill={color}
      />
    </svg>
  );
};

export default React.memo(TrashIcon);
