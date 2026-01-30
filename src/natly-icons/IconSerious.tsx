import * as React from "react";

type IconSeriousQuestionProps = React.SVGProps<SVGSVGElement> & {
  size?: number;
  color?: string;
};

const IconSeriousQuestion: React.FC<IconSeriousQuestionProps> = ({
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
      {/* Face */}
      <circle cx="12" cy="12" r="10" />

      {/* Eyes */}
      <circle cx="9" cy="10" r="1" />
      <circle cx="15" cy="10" r="1" />

      {/* Smile */}
      <line x1="9" y1="17" x2="15" y2="17" />
    </svg>
  );
};

export default IconSeriousQuestion;
