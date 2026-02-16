import * as React from "react";

type IconLeftArrowProps = React.SVGProps<SVGSVGElement> & {
  /** Size in px (width = height) */
  size?: number;
  /** Stroke color */
  color?: string;
};

const IconLeftArrow: React.FC<IconLeftArrowProps> = ({
  size = 120,
  color = "#0a6a73", // color por defecto Natly
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
      {/* Natly-style left arrow */}
      <path
        d="M80 24 L40 60 L80 96"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconLeftArrow;
