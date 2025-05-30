import * as React from "react";
const SvgComponent = (props: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill="none"
    viewBox="0 0 24 24"
    {...props}
  >
    <path
      stroke="#000"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="m15 9 6-6m0 0h-4.5M21 3v4.5M9 15l-6 6m0 0h4.5M3 21v-4.5M15 15 9 9"
    />
  </svg>
);
export default SvgComponent;
