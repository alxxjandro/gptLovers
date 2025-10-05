import "./RadialGauge.css";

export default function RadialGauge({ value = 0, isDarkTheme = true }) {
  const clamped = Math.max(0, Math.min(100, value));
  const textColor = isDarkTheme ? "#fff" : "#000";

  const color =
    clamped <= 25
      ? "redGradient"
      : clamped <= 50
      ? "orangeGradient"
      : clamped <= 75
      ? "yellowGradient"
      : "greenGradient";

  const label =
    clamped <= 25
      ? "Hazardous"
      : clamped <= 50
      ? "Unhealthy"
      : clamped <= 75
      ? "Moderate"
      : "Good";

  // Circunferencia del círculo (r = 45 para SVG de 120x120)
  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (clamped / 100) * circumference;

  return (
    <div className={`gauge-card ${isDarkTheme ? "dark" : "light"}`}>
      <svg
        className="gauge"
        width="100%"
        height="100%"
        viewBox="0 0 120 120"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#4CAF50" />
            <stop offset="100%" stopColor="#2E7D32" />
          </linearGradient>
          <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FDD835" />
            <stop offset="100%" stopColor="#FBC02D" />
          </linearGradient>
          <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#FFA726" />
            <stop offset="100%" stopColor="#EF6C00" />
          </linearGradient>
          <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#E53935" />
            <stop offset="100%" stopColor="#B71C1C" />
          </linearGradient>
        </defs>

        {/* Background track */}
        <circle
          className="gauge-track"
          cx="60"
          cy="60"
          r="45"
          strokeWidth="10"
          fill="none"
        />

        {/* Value arc */}
        <circle
          className="gauge-value"
          cx="60"
          cy="60"
          r="45"
          strokeWidth="10"
          stroke={`url(#${color})`}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform="rotate(-90 60 60)"
          fill="none"
        />

        {/* Center text */}
        <text
          x="50%"
          y="52%"
          className="gauge-text"
          textAnchor="middle"
          fill={textColor}
        >
          {clamped}
        </text>
        <text
          x="50%"
          y="70%"
          className="gauge-subtext"
          textAnchor="middle"
          fill={textColor}
        >
          {label}
        </text>
      </svg>
    </div>
  );
}
