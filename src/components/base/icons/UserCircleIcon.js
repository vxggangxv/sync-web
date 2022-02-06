import React from 'react';

export default React.memo(({ width = 0, color = '#546f7a' }) => {
  const widthValue = 28;
  const heightValue = 28;
  const convertHeight = !!width ? (heightValue * width) / widthValue : null;

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width || widthValue}
      height={convertHeight || heightValue}
      viewBox="0 0 28 28"
    >
      <g id="그룹_1172" data-name="그룹 1172" transform="translate(-395 -418)">
        <circle
          id="타원_302"
          data-name="타원 302"
          cx="14"
          cy="14"
          r="14"
          transform="translate(395 418)"
          fill="#fff"
        />
        <path
          id="패스_1561"
          data-name="패스 1561"
          d="M-51.808,235.227a1.109,1.109,0,0,0-.117.445c-.117.63-.721,1.032-1.274,1.355-1.814,1.059-3.629,2.1-5.4,3.222a13.782,13.782,0,0,0,10.415,4.743A13.79,13.79,0,0,0-37.4,239.8L-42,237.42a11.2,11.2,0,0,0-1.1-.52,2.892,2.892,0,0,1-.857-.416c-.38-.321-.288-.838-.389-1.278a.827.827,0,0,0-.133-.342c-.18-.226-.546-.215-.745-.424a.718.718,0,0,1-.16-.487.642.642,0,0,1,.06-.324c.063-.116.207-.173.307-.256s.216-.164.329-.241a1.425,1.425,0,0,0,.577-.621,5.11,5.11,0,0,0,.322-1.309,4.73,4.73,0,0,1,.145-1.437c.19-.418.583-.6.671-1.091a2.519,2.519,0,0,0-.168-1.334,2.624,2.624,0,0,0-.309-.446c-.112-.163-.039-.358-.016-.547a5.081,5.081,0,0,0-.171-1.7,3.89,3.89,0,0,0-.159-.585,1.98,1.98,0,0,0-.8-.957c-.182-.112-.39-.163-.572-.27a5.3,5.3,0,0,0-.621-.305,10.016,10.016,0,0,0-1.47-.508,4.432,4.432,0,0,0-2.985.15,1.592,1.592,0,0,0-1,1.172,1.677,1.677,0,0,0-1.845.737,2.856,2.856,0,0,0-.322,1.611,14.925,14.925,0,0,0,.28,1.478.589.589,0,0,1-.04.412c-.066.1-.187.151-.248.253a.548.548,0,0,0-.057.254,3.05,3.05,0,0,0,.278,1.842.782.782,0,0,0,.174.2,1.944,1.944,0,0,0,.178.112,1.489,1.489,0,0,1,.588.813c.1.3.083.614.161.914.063.245.143.512.23.752a1.23,1.23,0,0,0,.357.466c.154.149.247.319.469.382a1.22,1.22,0,0,0,.055.127,1.025,1.025,0,0,1,.056.361,1.217,1.217,0,0,1-.123.754C-51.237,235.04-51.629,234.968-51.808,235.227Z"
          transform="translate(457.054 200.725)"
          fill={color}
        />
      </g>
    </svg>
  );
});