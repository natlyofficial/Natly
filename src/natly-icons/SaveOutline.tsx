import * as React from "react";

type IconSaveOutlineProps = React.SVGProps<SVGSVGElement> & {
  /** Size in px (width = height) */
  size?: number;
  color?: string;
};

const IconSaveOutline: React.FC<IconSaveOutlineProps> = ({
  size = 120,
  color = "#0D5C63", // Natly teal / default stroke
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
      <path
        d="
          M36 20
          H84
          C88.4 20 92 23.6 92 28
          V100
          L60 78
          L28 100
          V28
          C28 23.6 31.6 20 36 20
          Z
        "
        fill="none"
        stroke={color}
        strokeWidth="10"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconSaveOutline;
