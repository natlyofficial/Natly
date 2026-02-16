import * as React from "react";

type IconCheckProps = React.SVGProps<SVGSVGElement> & {
  /** Size in px (width = height) */
  size?: number;

  /** Icon color (CSS color or Tailwind via className) */
  color?: string;
};

const IconCheck: React.FC<IconCheckProps> = ({
  size = 20,
  color,
  style,
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      fill={color || "currentColor"}
      xmlns="http://www.w3.org/2000/svg"
      style={{
        color: color,
        ...style,
      }}
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
      />
    </svg>
  );
};

export default IconCheck;
