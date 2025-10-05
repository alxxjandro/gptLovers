import { useState } from "react";
import "./App.css";
import RadialGauge from "./RadialGauge"; // Importa el componente RadialGauge

function Results() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [gaugeValue, setGaugeValue] = useState(99); 
  const textColor = isDarkTheme ? "#ffffff" : "#000000";// Estado para el valor del gauge
  const [NO, setNO] = useState(50);
  const [PM, setPM] = useState(32);
  const [CO2, setCO2] = useState(102);
  const [O3, setO3] = useState(181);
  const [SO2, setSO2] = useState(98);
  const [COV, setCOV] = useState(31);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div className={`app ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      {/* Animated Background Elements */}
      <div className="floating-particles">
        <div className="particle particle-1"></div>
        <div className="particle particle-2"></div>
        <div className="particle particle-3"></div>
        <div className="particle particle-4"></div>
        <div className="particle particle-5"></div>
        <div className="particle particle-6"></div>
        <div className="particle particle-7"></div>
        <div className="particle particle-8"></div>
        <div className="particle particle-9"></div>
        <div className="particle particle-10"></div>
        <div className="particle particle-11"></div>
        <div className="particle particle-12"></div>
      </div>

      {/* Theme Toggle Button */}
      <button className="theme-toggle" onClick={toggleTheme}>
        <span className="theme-icon">
          {isDarkTheme ? '☀️' : '🌙'}
        </span>
      </button>

      <div className="content-container">
        {/* Gauge Container */}
        <div className="gauge-container">
          <RadialGauge value={gaugeValue} isDarkTheme={isDarkTheme} /> {/* Pasa el estado del tema */}
        </div>

        {/* Map Container */}
        <div className="map-container">
          {/* Aquí puedes agregar el mapa más adelante */}
        </div>        
      </div>

      <div className="parameter-container">
        {/* Gauge Container */}
        <div className="level-container">
          <h2 style={{ color: textColor }}>Niveles de NO: {NO} ppm</h2>
          <h2 style={{ color: textColor }}>Niveles de PM: {PM} ppm</h2>
          <h2 style={{ color: textColor }}>Niveles de CO2: {CO2} ppm</h2>
          <h2 style={{ color: textColor }}>Niveles de O3: {O3} ppm</h2>
          <h2 style={{ color: textColor }}>Niveles de SO2 {SO2} ppm</h2>
          <h2 style={{ color: textColor }}>Niveles de COV {COV} ppm</h2>
        </div>

        {/* Map Container */}
        <div className="gemini-container">
          <p style={{ color: textColor }}> 🌟 1. La mezcla de culturas: el sello Shakira

Una de las razones más poderosas por las que las canciones de Shakira destacan sobre otras canciones de los mundiales es que ella tiene la capacidad de fusionar culturas de una manera natural y vibrante.

En “Waka Waka (This Time for Africa)” (Sudáfrica 2010), Shakira no solo hizo un hit pop, sino que honró la cultura africana al incorporar el coro del tema camerunés “Zangalewa”. Esta fusión dio a la canción una autenticidad y un ritmo que se sentía fresco, distinto a la típica canción pop de un evento deportivo.

En “La La La (Brazil 2014)”, aunque el ritmo fue más cercano a la música electrónica y pop de los 2010, Shakira incorporó percusiones y coros que evocaban la samba y el ambiente festivo de Brasil, dándole una identidad propia y mundialista.

Esto es clave: no era solo música pop pegajosa, sino un puente cultural, algo que pocas canciones de mundiales logran.

🥁 2. El ritmo que contagia

El fútbol es emoción, adrenalina, celebración colectiva. Las canciones de Shakira capturan ese sentimiento a través de ritmos bailables y fáciles de corear.

“Waka Waka” tiene un ritmo de percusión constante que te invita a moverte, casi tribal, lo que conecta con el espíritu de las multitudes en los estadios.

La estructura del estribillo es simple pero poderosa: repetitiva, lo que hace que incluso personas que no hablan inglés o español puedan cantarla.

Hay una energía que sube y sube: empieza con guitarras suaves, pero cuando entra el beat con percusión africana, sientes que te empuja a moverte, a celebrar.

En contraste, muchas canciones oficiales de otros mundiales han intentado ser “épicas” o demasiado modernas, perdiendo esa conexión directa con el ritmo humano más básico: el tambor, el compás que te hace aplaudir y saltar. </p>
        </div>        
      </div>
    </div>
  );
}

export default Results;
