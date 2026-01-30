import * as React from "react";

type IconHappyFaceProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
};

const IconHappyFace: React.FC<IconHappyFaceProps> = ({
  size = 24,
  color = "currentColor",
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      {/* Face */}
      <circle cx="12" cy="12" r="10" />

      {/* Eyes */}
      <circle cx="9" cy="10" r="1" />
      <circle cx="15" cy="10" r="1" />

      {/* Smile */}
      <path d="M8 15c1.333 1.333 2.667 2 4 2s2.667-.667 4-2" />
    </svg>
  );
};

export default IconHappyFace;
