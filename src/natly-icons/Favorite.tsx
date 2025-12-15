import * as React from "react";

type IconFavoriteProps = React.SVGProps<SVGSVGElement> & {
  /** Size in px (width = height) */
  size?: number;
  color?: string;
};

const IconFavorite: React.FC<IconFavoriteProps> = ({
  size = 120,
  color = "#FFFFFF", // ⭐ DEFAULT WHITE
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
          M60 16
          L70.8 42.4
          L99 45.5
          L77 64.4
          L82.6 92.5
          L60 78.2
          L37.4 92.5
          L43 64.4
          L21 45.5
          L49.2 42.4
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

export default IconFavorite;
