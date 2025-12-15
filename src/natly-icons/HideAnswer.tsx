import * as React from "react";

type IconHideAnswerProps = React.SVGProps<SVGSVGElement> & {
  /** Size in px (width = height) */
  size?: number;
};

const IconHideAnswer: React.FC<IconHideAnswerProps> = ({ size = 120, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Closed eye outline */}
      <path
        d="
          M20 60
          C35 35, 85 35, 100 60
          C85 85, 35 85, 20 60
        "
        stroke="white"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Eyelid line (closed eye) */}
      <line
        x1="30"
        y1="60"
        x2="90"
        y2="60"
        stroke="white"
        strokeWidth="12"
        strokeLinecap="round"
      />

      {/* Eyelashes */}
      <line x1="40" y1="30" x2="40" y2="20" stroke="white" strokeWidth="10" strokeLinecap="round" />
      <line x1="60" y1="28" x2="60" y2="18" stroke="white" strokeWidth="10" strokeLinecap="round" />
      <line x1="80" y1="30" x2="80" y2="20" stroke="white" strokeWidth="10" strokeLinecap="round" />
    </svg>
  );
};

export default IconHideAnswer;
