import "./RadialGauge.css";

export default function RadialGauge({ value = 0, isDarkTheme = true }) {
  const clamped = Math.max(0, Math.min(100, value));
  const textColor = isDarkTheme ? "#fff" : "#000";

  // invertimos la escala: 0 bueno → 100 malo
  const reversed = 100 - clamped;

  const color =
    reversed <= 25
      ? "greenGradient"
      : reversed <= 50
      ? "yellowGradient"
      : reversed <= 75
      ? "orangeGradient"
      : "redGradient";

  const label =
    reversed <= 25
      ? "Good"
      : reversed <= 50
      ? "Moderate"
      : reversed <= 75
      ? "Unhealthy"
      : "Hazardous";

  const circumference = 2 * Math.PI * 45;
  const offset = circumference - (reversed / 100) * circumference;

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
