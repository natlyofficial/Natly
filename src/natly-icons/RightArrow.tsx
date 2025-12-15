import * as React from "react";

type IconRightArrowProps = React.SVGProps<SVGSVGElement> & {
  /** Tamaño en px (ancho = alto) */
  size?: number;
};

const IconRightArrow: React.FC<IconRightArrowProps> = ({ size = 120, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Flecha derecha estilo Natly */}
      <path
        d="M40 24 L80 60 L40 96"
        stroke="#0a6a73"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconRightArrow;
