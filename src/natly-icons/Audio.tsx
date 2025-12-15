import * as React from "react";

type IconAudioProps = React.SVGProps<SVGSVGElement> & {
  /** Size in px (width = height) */
  size?: number;
};

const IconAudio: React.FC<IconAudioProps> = ({ size = 120, ...props }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 120 120"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Speaker base */}
      <path
        d="
          M36 50
          H20
          V70
          H36
          L56 90
          V30
          L36 50
        "
        stroke="white"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Sound wave 1 */}
      <path
        d="M70 50 C78 58, 78 62, 70 70"
        stroke="white"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Sound wave 2 */}
      <path
        d="M82 42 C94 56, 94 64, 82 78"
        stroke="white"
        strokeWidth="12"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
};

export default IconAudio;
