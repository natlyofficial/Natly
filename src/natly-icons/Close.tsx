import * as React from "react";

type IconCloseProps = React.SVGProps<SVGSVGElement> & {
  /** Size in px (width = height) */
  size?: number;
};

const IconClose: React.FC<IconCloseProps> = ({ size = 120, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* X shape */}
      <line
        x1="30"
        y1="30"
        x2="90"
        y2="90"
        stroke="#0D3B3A"
        strokeWidth="15"
        strokeLinecap="round"
      />
      <line
        x1="90"
        y1="30"
        x2="30"
        y2="90"
        stroke="#0D3B3A"
        strokeWidth="15"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default IconClose;
