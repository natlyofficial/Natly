import * as React from "react";

type IconSearchProps = React.SVGProps<SVGSVGElement> & {
  /** Size in px (width = height) */
  size?: number;
};

const IconSearch: React.FC<IconSearchProps> = ({ size = 120, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Circle (glass) */}
      <circle
        cx="50"
        cy="50"
        r="28"
        stroke="#0a6a73"
        strokeWidth="12"
      />

      {/* Handle */}
      <line
        x1="68"
        y1="68"
        x2="94"
        y2="94"
        stroke="#0a6a73"
        strokeWidth="12"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default IconSearch;
