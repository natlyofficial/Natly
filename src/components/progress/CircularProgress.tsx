/**
 * CircularProgress Component
 * 
 * Displays a circular progress indicator with dynamic colors
 * based on performance percentage
 */

import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

type CircularProgressProps = {
  percentage: number;
  size?: number;
  strokeWidth?: number;
};

export default function CircularProgress({
  percentage,
  size = 160,
  strokeWidth = 12,
}: CircularProgressProps) {
  const { t } = useTranslation("quiz");
  const [progress, setProgress] = useState(0);

  // Animate on mount
  useEffect(() => {
    const timer = setTimeout(() => setProgress(percentage), 100);
    return () => clearTimeout(timer);
  }, [percentage]);

  /* ================================
     Calculate circle properties
  ================================ */

  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (progress / 100) * circumference;

  /* ================================
     Dynamic color based on percentage
  ================================ */

  const getColor = (pct: number) => {
    if (pct >= 90) return "#10b981"; // green-500 - Excellent
    if (pct >= 80) return "#22c55e"; // green-400 - Very good
    if (pct >= 70) return "#84cc16"; // lime-500 - Good
    if (pct >= 60) return "#eab308"; // yellow-500 - Acceptable
    if (pct >= 50) return "#f59e0b"; // amber-500 - Fair
    if (pct >= 40) return "#f97316"; // orange-500 - Low
    return "#ef4444"; // red-500 - Very low
  };

  const strokeColor = getColor(progress);

  /* ================================
     Get performance label key
  ================================ */

  const getLabelKey = (pct: number) => {
    if (pct >= 90) return "results.performance.excellent";
    if (pct >= 80) return "results.performance.very_good";
    if (pct >= 70) return "results.performance.good";
    if (pct >= 60) return "results.performance.acceptable";
    if (pct >= 50) return "results.performance.fair";
    if (pct >= 40) return "results.performance.low";
    return "results.performance.very_low";
  };

  /* ================================
     Render
  ================================ */

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#e5e7eb"
          strokeWidth={strokeWidth}
          fill="none"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="transition-all duration-1000 ease-out"
          style={{
            filter: `drop-shadow(0 0 8px ${strokeColor}40)`,
          }}
        />
      </svg>

      {/* Center content */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div
          className="text-5xl font-black transition-colors duration-500"
          style={{ color: strokeColor }}
        >
          {Math.round(progress)}%
        </div>
        <div className="text-xs font-semibold text-gray-500 uppercase tracking-wide mt-1">
          {t("results.accuracy")}
        </div>
        <div
          className="text-xs font-bold mt-1 transition-colors duration-500"
          style={{ color: strokeColor }}
        >
          {t(getLabelKey(progress))}
        </div>
      </div>
    </div>
  );
}