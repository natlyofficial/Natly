import * as React from "react";

type IconHideAnswerProps = React.SVGProps<SVGSVGElement> & {
  /** Size in px (width = height) */
  size?: number;
  color?: string;
};

const IconHideAnswer: React.FC<IconHideAnswerProps> = ({
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
      {/* Eye outline */}
      <path
        d="M20 60 C35 35, 85 35, 100 60 C85 85, 35 85, 20 60 Z"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Iris */}
      <circle
        cx="60"
        cy="60"
        r="18"
        stroke={color}
        strokeWidth="12"
        fill="none"
      />

      {/* Pupil */}
      <circle
        cx="60"
        cy="60"
        r="8"
        fill={color}
      />

      {/* Diagonal slash (hidden) */}
      <line
        x1="28"
        y1="92"
        x2="92"
        y2="28"
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
      />
    </svg>
  );
};

export default IconHideAnswer;
