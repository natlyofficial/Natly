import * as React from "react";

type IconPlayProps = React.SVGProps<SVGSVGElement> & {
  /** Tamaño en px (ancho = alto) */
  size?: number;
};

const IconPlay: React.FC<IconPlayProps> = ({ size = 120, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Fondo */}
      <rect width="120" height="120" fill="white" />

      {/* Ventana con borde redondeado */}
      <rect
        x="11"
        y="12"
        width="104"
        height="96"
        rx="18"
        ry="18"
        stroke="#0D3B3A" // azul Natly oscuro
        strokeWidth="6"
        fill="white"
      />

      {/* Línea divisoria */}
      <line
        x1="8"
        y1="38"
        x2="112"
        y2="38"
        stroke="#0D3B3A"
        strokeWidth="6"
      />

      {/* Dots superiores */}
      <circle cx="30" cy="26" r="4" fill="#0D3B3A" />
      <circle cx="44" cy="26" r="4" fill="#0D3B3A" />
      <circle cx="58" cy="26" r="4" fill="#0D3B3A" />

      {/* Triángulo Play */}
      <polygon
        points="56,54 82,70 56,86"
        fill="#F4B000"
        stroke="#0D3B3A"
        strokeWidth="4"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconPlay;
