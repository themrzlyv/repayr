import * as React from "react";
const SvgComponent = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <g clipPath="url(#a)">
      <path fill="transparent" d="M0 0h24v24H0z" />
      <circle
        cx={10.5}
        cy={10.5}
        r={6.5}
        stroke="#000"
        strokeLinejoin="round"
      />
      <path
        fill="#000"
        d="M19.646 20.354a.5.5 0 0 0 .708-.708l-.708.708Zm.708-.708-5-5-.708.708 5 5 .708-.708Z"
      />
    </g>
    <defs>
      <clipPath id="a">
        <path fill="#fff" d="M0 0h24v24H0z" />
      </clipPath>
    </defs>
  </svg>
);
export default SvgComponent;
