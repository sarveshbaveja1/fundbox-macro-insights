"use client";

interface RecessionGaugeProps {
  probability: number;
  size?: "sm" | "md";
}

export default function RecessionGauge({
  probability,
  size = "md",
}: RecessionGaugeProps) {
  const radius = size === "sm" ? 40 : 56;
  const strokeWidth = size === "sm" ? 8 : 10;
  const cx = radius + strokeWidth;
  const cy = radius + strokeWidth;
  const svgSize = (radius + strokeWidth) * 2;

  // Semi-circle: from 180° to 0° (left to right along top)
  const circumference = Math.PI * radius;
  const offset = circumference - (probability / 100) * circumference;

  const color =
    probability >= 40
      ? "#EF4444"
      : probability >= 25
      ? "#F59E0B"
      : "#22C55E";

  return (
    <div className="flex flex-col items-center gap-1">
      <svg
        width={svgSize}
        height={cx}
        viewBox={`0 0 ${svgSize} ${cx}`}
        className="overflow-visible"
      >
        {/* Track */}
        <path
          d={`M ${strokeWidth} ${cy} A ${radius} ${radius} 0 0 1 ${svgSize - strokeWidth} ${cy}`}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
        />
        {/* Fill */}
        <path
          d={`M ${strokeWidth} ${cy} A ${radius} ${radius} 0 0 1 ${svgSize - strokeWidth} ${cy}`}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.8s ease" }}
        />
        {/* Value label */}
        <text
          x={cx}
          y={cy - 6}
          textAnchor="middle"
          className="font-mono font-bold"
          style={{
            fontSize: size === "sm" ? 18 : 24,
            fill: color,
            fontFamily: "monospace",
          }}
        >
          {probability}%
        </text>
      </svg>
      <span className="text-xs text-brand-muted text-center">
        Recession probability
      </span>
    </div>
  );
}
