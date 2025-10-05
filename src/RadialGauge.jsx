import React from 'react';

// --- CONSTANTES DE CONFIGURACIÓN ---
const VIEW_BOX_SIZE = 300; // Tamaño fijo del SVG en píxeles
const TRACK_WIDTH = 30;    // Ancho de la pista
const TRACK_SIZE_DEGREES = 270; // El arco de la pista en grados

// --- EL COMPONENTE ---
export default function RadialGauge({ value = 0, isDarkTheme = true }) {
  // Asegurarnos que el valor esté siempre entre 0 y 100
  const validValue = Math.max(0, Math.min(100, value));

  // --- CÁLCULOS PARA EL DIBUJO DEL SVG ---
  const center = VIEW_BOX_SIZE / 2;
  const radius = center - TRACK_WIDTH / 2;

  // Cálculos para el truco de dasharray/dashoffset
  const circumference = 2 * Math.PI * radius;
  const trackFillPercentage = TRACK_SIZE_DEGREES / 360;
  const trackDashoffset = circumference * (1 - trackFillPercentage);

  // El offset del valor se calcula en base al prop 'value'
  const valuePercentage = (validValue / 100) * trackFillPercentage;
  const valueDashoffset = circumference * (1 - valuePercentage);

  // Transformación para rotar la pista a la posición correcta
  const trackTransform = `rotate(${-(TRACK_SIZE_DEGREES / 2) - 90}, ${center}, ${center})`;

  // --- SELECCIÓN DEL GRADIENTE ---
  const getGradientId = (value) => {
    if (value <= 25) return 'redGradient'; // Rojo
    if (value <= 50) return 'orangeGradient'; // Naranja
    if (value <= 75) return 'yellowGradient'; // Amarillo
    return 'greenGradient'; // Verde
  };

  const gradientId = getGradientId(validValue);

  // --- SELECCIÓN DEL COLOR DEL TEXTO ---
  const textColor = isDarkTheme ? "#ffffff" : "#000000"; // Blanco para tema oscuro, negro para tema claro

  return (
    <div>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={`0 0 ${VIEW_BOX_SIZE} ${VIEW_BOX_SIZE}`}
        width={VIEW_BOX_SIZE}
        height={VIEW_BOX_SIZE}
      >
        {/* Definición de degradados */}
        <defs>
          {/* Degradado rojo */}
          <linearGradient id="redGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ce1515ff" /> {/* Rojo claro */}
            <stop offset="100%" stopColor="#9e0202ff" /> {/* Rojo oscuro */}
          </linearGradient>

          {/* Degradado naranja */}
          <linearGradient id="orangeGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffb84d" /> {/* Naranja claro */}
            <stop offset="100%" stopColor="#fc940cff" /> {/* Naranja oscuro */}
          </linearGradient>

          {/* Degradado amarillo */}
          <linearGradient id="yellowGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#ffcc00" /> {/* Amarillo claro */}
            <stop offset="100%" stopColor="#ffbb00ff" /> {/* Amarillo oscuro */}
          </linearGradient>

          {/* Degradado verde */}
          <linearGradient id="greenGradient" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#009933" /> {/* Verde claro */}
            <stop offset="100%" stopColor="#006b24ff" /> {/* Verde oscuro */}
          </linearGradient>
        </defs>

        {/* Pista de fondo (gris oscuro) */}
        <circle
          fill="none"
          cx={center}
          cy={center}
          r={radius}
          stroke="#333"
          strokeWidth={TRACK_WIDTH}
          strokeDasharray={circumference}
          strokeDashoffset={trackDashoffset}
          strokeLinecap="round"
          transform={trackTransform}
        />

        {/* Pista de valor (degradado dinámico) */}
        <circle
          fill="none"
          cx={center}
          cy={center}
          r={radius}
          stroke={`url(#${gradientId})`} // Aplica el degradado dinámico
          strokeWidth={TRACK_WIDTH}
          strokeDasharray={circumference}
          strokeDashoffset={valueDashoffset}
          strokeLinecap="round"
          transform={trackTransform}
          style={{ transition: 'stroke-dashoffset 0.3s ease' }}
        />

        {/* Texto con el valor en el centro */}
        <text
          x="50%"
          y="45%" /* Ajusta la posición vertical del número */
          fill={textColor} // Cambia dinámicamente según el tema
          fontSize="60"
          fontWeight="bold"
        >
          {validValue}
        </text>

        {/* Texto adicional debajo del número */}
        <text
          x="50%"
          y="60%" /* Ajusta la posición vertical del texto */
          fill={textColor} // Cambia dinámicamente según el tema
          fontSize="16"
          fontWeight="normal"
        >
          Overall Score
        </text>
      </svg>
    </div>
  );
}