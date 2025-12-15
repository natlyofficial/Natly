import * as React from "react";

type IconMenuProps = React.SVGProps<SVGSVGElement> & {
  /** Size in px (width = height) */
  size?: number;
};

const IconMenu: React.FC<IconMenuProps> = ({ size = 120, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Top bar */}
      <line
        x1="20"
        y1="36"
        x2="100"
        y2="36"
        stroke="#0D3B3A"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Middle bar */}
      <line
        x1="20"
        y1="60"
        x2="100"
        y2="60"
        stroke="#0D3B3A"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Bottom bar */}
      <line
        x1="20"
        y1="84"
        x2="100"
        y2="84"
        stroke="#0D3B3A"
        strokeWidth="12"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default IconMenu;
