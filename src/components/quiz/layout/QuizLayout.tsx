import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

export default function QuizLayout({ children }: Props) {
  return (
    <div className="mx-auto max-w-6xl px-4 py-10">
      <div
        className="
          relative mx-auto w-full max-w-[1200px]
          rounded-xl
          border-4 border-natly-blue-soft
          bg-white
          flex flex-col
          pb-6 sm:pb-8
        "
      >
        {children}
      </div>
    </div>
  );
}
