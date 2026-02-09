'use client';

interface HealthScoreGaugeProps {
  score: number;
  grade: string;
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function HealthScoreGauge({ score, grade, label = 'Health Score', size = 'md' }: HealthScoreGaugeProps) {
  const dimensions = { sm: 100, md: 140, lg: 180 };
  const svgSize = dimensions[size];
  const strokeWidth = size === 'sm' ? 6 : size === 'md' ? 8 : 10;
  const radius = (svgSize - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  function getColor(s: number): string {
    if (s >= 80) return '#22c55e'; // green
    if (s >= 60) return '#eab308'; // yellow
    if (s >= 40) return '#f97316'; // orange
    return '#ef4444'; // red
  }

  const color = getColor(score);
  const fontSize = size === 'sm' ? 'text-xl' : size === 'md' ? 'text-3xl' : 'text-4xl';
  const gradeSize = size === 'sm' ? 'text-xs' : 'text-sm';

  return (
    <div className="flex flex-col items-center">
      <div className="relative" style={{ width: svgSize, height: svgSize }}>
        <svg width={svgSize} height={svgSize} className="-rotate-90">
          {/* Background circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.1)"
            strokeWidth={strokeWidth}
          />
          {/* Progress circle */}
          <circle
            cx={svgSize / 2}
            cy={svgSize / 2}
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference - progress}
            style={{ transition: 'stroke-dashoffset 1s ease-out' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`${fontSize} font-bold text-white`}>{score}</span>
          <span className={`${gradeSize} font-semibold`} style={{ color }}>{grade}</span>
        </div>
      </div>
      <p className="text-xs text-gray-400 mt-2">{label}</p>
    </div>
  );
}
