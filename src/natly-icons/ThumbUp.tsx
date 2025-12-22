import * as React from "react";

type IconThumbUpProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
};

const IconThumbUp: React.FC<IconThumbUpProps> = ({
  size = 120,
  color = "#FFFFFF", // default white (Natly standard)
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
      {/* Thumb Up */}
      <path
        d="
          M40 100
          H82
          C90 100, 96 94, 96 86
          V70
          C96 62, 90 56, 82 56
          H68
          V40
          C68 32, 62 26, 54 26
          C50 26, 48 28, 48 32
          V56
          L40 64
          Z
        "
        stroke={color}
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Wrist */}
      <rect
        x="20"
        y="64"
        width="20"
        height="36"
        rx="6"
        fill={color}
      />
    </svg>
  );
};

export default IconThumbUp;
