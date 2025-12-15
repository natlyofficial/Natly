import * as React from "react";

type IconLeftArrowProps = React.SVGProps<SVGSVGElement> & {
  /** Tamaño en px (ancho = alto) */
  size?: number;
};

const IconLeftArrow: React.FC<IconLeftArrowProps> = ({ size = 120, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Flecha izquierda estilo Natly */}
      <path
        d="M80 24 L40 60 L80 96"
        stroke="#0a6a73"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconLeftArrow;
