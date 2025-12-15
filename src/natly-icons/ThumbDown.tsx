import * as React from "react";

type IconThumbDownProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

const IconThumbDown: React.FC<IconThumbDownProps> = ({ size = 120, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Thumb Down */}
      <path
        d="
          M40 20
          H82
          C90 20, 96 26, 96 34
          V50
          C96 58, 90 64, 82 64
          H68
          V80
          C68 88, 62 94, 54 94
          C50 94, 48 92, 48 88
          V64
          L40 56
          Z
        "
        stroke="white"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Wrist */}
      <rect
        x="20"
        y="20"
        width="20"
        height="36"
        rx="6"
        fill="white"
      />
    </svg>
  );
};

export default IconThumbDown;
