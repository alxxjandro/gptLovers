import { useState } from "react";
import GlobeVisual from "./GlobeVisual";
import "./App.css";

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  return (
    <div className={`app ${isDarkTheme ? 'dark-theme' : 'light-theme'}`}>
      {/* Theme Toggle Button */}
      <button className="theme-toggle" onClick={toggleTheme}>
        <span className="theme-icon">
          {isDarkTheme ? '☀️' : '🌙'}
        </span>
      </button>

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
      
      {/* Constellation Lines */}
      <div className="constellation-lines">
        <div className="line line-1"></div>
        <div className="line line-2"></div>
        <div className="line line-3"></div>
        <div className="line line-4"></div>
        <div className="line line-5"></div>
        <div className="line line-6"></div>
      </div>
      
      <div className="animated-grid">
        <div className="grid-line grid-line-1"></div>
        <div className="grid-line grid-line-2"></div>
        <div className="grid-line grid-line-3"></div>
        <div className="grid-line grid-line-4"></div>
      </div>

      <div className="hero-section">
        <div className="globe-container">
          <div className="globe-glow"></div>
          <GlobeVisual />
          <div className="floating-cards">
            <div className="floating-card card-1">
              <span className="card-icon">🌍</span>
              <span className="card-text">Global Coverage</span>
            </div>
            <div className="floating-card card-2">
              <span className="card-icon">📊</span>
              <span className="card-text">Real-time Data</span>
            </div>
            <div className="floating-card card-3">
              <span className="card-icon">🔍</span>
              <span className="card-text">Detailed Analysis</span>
            </div>
          </div>
        </div>
        
        <div className="content-container">
          <div className="title-container">
            <h1 className="project-title">
              <span className="title-word title-word-1">Re</span>
              <span className="title-word title-word-2">Breath</span>
            </h1>
            <div className="title-underline"></div>
          </div>
          
          <p className="description">
            Discover the <span className="highlight-text">air quality</span> of your city with our 
            <span className="highlight-text"> real-time monitoring</span> system
          </p>
          
          <div className="cta-container">
            <button className="cta-button">
              <span className="button-text">Explore Now</span>
              <div className="button-shine"></div>
              <div className="button-ripple"></div>
            </button>
            <div className="cta-decoration">
              <div className="decoration-dot"></div>
              <div className="decoration-line"></div>
              <div className="decoration-dot"></div>
            </div>
          </div>
          
          {/* <div className="stats-container">
            <div className="stat-item">
              <span className="stat-number">100+</span>
              <span className="stat-label">Cities</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">24/7</span>
              <span className="stat-label">Monitoring</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">99%</span>
              <span className="stat-label">Accuracy</span>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default App;
