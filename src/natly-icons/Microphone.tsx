import * as React from "react";

type IconMicrophoneProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
};

const IconMicrophone: React.FC<IconMicrophoneProps> = ({
  size = 24,
  color = "currentColor",
  ...props
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 1v11" />
      <path d="M8 5a4 4 0 0 1 8 0v6a4 4 0 0 1-8 0V5z" />
      <path d="M19 10v1a7 7 0 0 1-14 0v-1" />
      <path d="M12 18v5" />
    </svg>
  );
};

export default IconMicrophone;
