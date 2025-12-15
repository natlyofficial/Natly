import * as React from "react";

type IconGrowthProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

const IconGrowth: React.FC<IconGrowthProps> = ({ size = 120, ...props }) => {
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

      {/* Contorno redondeado */}
      <rect
        x="10"
        y="10"
        width="100"
        height="100"
        rx="18"
        stroke="#0D3B3A"
        strokeWidth="6"
        fill="white"
      />

      {/* Barras */}
      <rect x="25" y="70" width="18" height="30" fill="#F4B000" stroke="#0D3B3A" strokeWidth="4" rx="4" />
      <rect x="52" y="58" width="18" height="42" fill="#F4B000" stroke="#0D3B3A" strokeWidth="4" rx="4" />
      <rect x="78" y="46" width="18" height="54" fill="#F4B000" stroke="#0D3B3A" strokeWidth="4" rx="4" />

      {/* Flecha ascendente */}
      <polyline
        points="29,60 51,35 68,50 95,25"
        fill="none"
        stroke="#0D3B3A"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <polyline
        points="84,24 95,22 96,35"
        fill="none"
        stroke="#0D3B3A"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconGrowth;
