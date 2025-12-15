import * as React from "react";

type IconFilterProps = React.SVGProps<SVGSVGElement> & {
  /** Size in px (width = height) */
  size?: number;
  color?: string;
};

const IconFilter: React.FC<IconFilterProps> = ({ size = 120, color, ...props }) => {
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
        stroke={color || "currentColor"}
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Middle bar */}
      <line
        x1="40"
        y1="60"
        x2="100"
        y2="60"
        stroke={color || "currentColor"}
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Bottom bar */}
      <line
        x1="60"
        y1="84"
        x2="100"
        y2="84"
        stroke={color || "currentColor"}
        strokeWidth="12"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default IconFilter;
