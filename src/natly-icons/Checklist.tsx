import * as React from "react";

type IconChecklistProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
};

const IconChecklist: React.FC<IconChecklistProps> = ({ size = 120, ...props }) => {
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

      {/* Contorno del clipboard */}
      <rect
        x="18"
        y="20"
        width="85"
        height="90"
        rx="14"
        stroke="#0D3B3A"
        strokeWidth="6"
        fill="white"
      />

      {/* Clip superior */}
      <rect
        x="38"
        y="10"
        width="44"
        height="20"
        rx="10"
        stroke="#0D3B3A"
        strokeWidth="6"
        fill="white"
      />

      {/* Checkmark 1 */}
      <path
        d="M45 55 L55 65 L75 45"
        stroke="#F4B000"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Checkmark 2 */}
      <path
        d="M45 80 L55 90 L75 70"
        stroke="#F4B000"
        strokeWidth="8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconChecklist;
