import * as React from "react";

type IconHintProps = React.SVGProps<SVGSVGElement> & {
  /** Size in px (width = height) */
  size?: number;
  color?: string;
};

const IconHint: React.FC<IconHintProps> = ({
  size = 120,
  color = "#FFFFFF", // default white
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Bulb outline */}
      <path
        d="
          M60 20
          C42 20, 28 34, 28 52
          C28 68, 38 78, 44 84
          C48 88, 48 94, 48 98
          H72
          C72 94, 72 88, 76 84
          C82 78, 92 68, 92 52
          C92 34, 78 20, 60 20
          Z
        "
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Filament */}
      <path
        d="M50 62 C55 70, 65 70, 70 62"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Base of the bulb */}
      <rect
        x="48"
        y="98"
        width="24"
        height="12"
        rx="4"
        fill={color}
      />

      {/* Rays */}
      <line x1="60" y1="8"  x2="60" y2="2"  stroke={color} strokeWidth="10" strokeLinecap="round" />
      <line x1="24" y1="28" x2="18" y2="22" stroke={color} strokeWidth="10" strokeLinecap="round" />
      <line x1="96" y1="28" x2="102" y2="22" stroke={color} strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
};

export default IconHint;
