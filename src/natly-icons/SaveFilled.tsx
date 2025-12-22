import * as React from "react";

type IconSaveProps = React.SVGProps<SVGSVGElement> & {
  /** Size in px (width = height) */
  size?: number;
  color?: string;
};

const IconSave: React.FC<IconSaveProps> = ({
  size = 120,
  color = "#FFFFFF", // DEFAULT WHITE
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
        fill={color}
        stroke={color}
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconSave;
