import * as React from "react";

type IconBarsProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
};

const IconBars: React.FC<IconBarsProps> = ({
  size = 120,
  color = "#F4B000", // default Natly yellow
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 140 140"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      {/* Bars only */}
      <rect
        x="25"
        y="70"
        width="18"
        height="30"
        rx="4"
        fill={color}
      />

      <rect
        x="52"
        y="58"
        width="18"
        height="42"
        rx="4"
        fill={color}
      />

      <rect
        x="78"
        y="46"
        width="18"
        height="54"
        rx="4"
        fill={color}
      />
    </svg>
  );
};

export default IconBars;
