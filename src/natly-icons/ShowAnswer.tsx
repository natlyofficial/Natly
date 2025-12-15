import * as React from "react";

type IconShowAnswerProps = React.SVGProps<SVGSVGElement> & {
  /** Size in px (width = height) */
  size?: number;
};

const IconShowAnswer: React.FC<IconShowAnswerProps> = ({ size = 120, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Outer eye */}
      <path
        d="M20 60 C35 35, 85 35, 100 60 C85 85, 35 85, 20 60 Z"
        stroke="white"
        strokeWidth="12"   // +2 px
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Iris */}
      <circle
        cx="60"
        cy="60"
        r="18"
        stroke="white"
        strokeWidth="12"  // +2 px
        fill="none"
      />

      {/* Pupil */}
      <circle cx="60" cy="60" r="8" fill="white" />

      {/* Eyelashes */}
      <line x1="40" y1="30" x2="40" y2="20" stroke="white" strokeWidth="10" strokeLinecap="round" />   {/* +2 px */}
      <line x1="60" y1="28" x2="60" y2="18" stroke="white" strokeWidth="10" strokeLinecap="round" />   {/* +2 px */}
      <line x1="80" y1="30" x2="80" y2="20" stroke="white" strokeWidth="10" strokeLinecap="round" />   {/* +2 px */}
    </svg>
  );
};

export default IconShowAnswer;
