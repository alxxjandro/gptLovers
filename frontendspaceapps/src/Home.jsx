import { useState } from "react";
import GlobeVisual from "./GlobeVisual";
import HealthAssessmentPopup from "./HealthAssessmentPopup";
import tempoImage from "./assets/tempo.jpg";
import spaceAppsLogo from "./assets/spaceappslogo.svg";
import spaceAppsLogo2 from "./assets/spaceappslogowhite.svg";
import "./App.css";

function Home() {
  const [isDarkTheme, setIsDarkTheme] = useState(true);
  const [showHealthAssessment, setShowHealthAssessment] = useState(false);

  const toggleTheme = () => {
    setIsDarkTheme(!isDarkTheme);
  };

  const openHealthAssessment = () => {
    setShowHealthAssessment(true);
  };

  const closeHealthAssessment = () => {
    setShowHealthAssessment(false);
  };

  return (
    <div className={`app ${isDarkTheme ? "dark-theme" : "light-theme"}`}>
      <button className="theme-toggle" onClick={toggleTheme}>
        <span className="theme-icon">{isDarkTheme ? "☀️" : "🌙"}</span>
      </button>

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
          <GlobeVisual darkTheme={isDarkTheme} />
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
            Discover the <span className="highlight-text">air quality</span> of
            your city with our
            <span className="highlight-text"> real-time monitoring</span> system
          </p>

          <div className="cta-container">
            <button className="cta-button" onClick={openHealthAssessment}>
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
        </div>
      </div>

      <div className="why-section">
        <div className="why-background">
          <div className="floating-orb orb-1"></div>
          <div className="floating-orb orb-2"></div>
          <div className="floating-orb orb-3"></div>
          <div className="floating-orb orb-4"></div>
          <div className="floating-orb orb-5"></div>
          <div className="floating-orb orb-6"></div>

          <div className="wave-pattern wave-1"></div>
          <div className="wave-pattern wave-2"></div>
          <div className="wave-pattern wave-3"></div>

          <div className="geometric-shape triangle"></div>
          <div className="geometric-shape circle"></div>
          <div className="geometric-shape square"></div>

          <div className="data-stream stream-1"></div>
          <div className="data-stream stream-2"></div>
          <div className="data-stream stream-3"></div>
        </div>

        <div className="why-container">
          <div className="why-content">
            <div className="why-main-text">
              <div className="why-header">
                <h2 className="why-title">
                  <span className="title-line">Why</span>
                  <span className="title-line highlight">ReBreath</span>
                </h2>
              </div>
              <p className="why-description">
                ReBreath transforms atmospheric data into{" "}
                <span className="highlight-text">
                  personalized health insights
                </span>
                , adapting recommendations to your individual risk level and
                environment.
              </p>
            </div>

            <div className="why-features">
              <div className="feature-item">
                <div className="feature-icon">🧠</div>
                <div className="feature-text">
                  <span className="feature-title">AI-Powered Analysis</span>
                  <span className="feature-desc">
                    Advanced algorithms for precise predictions
                  </span>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">🎯</div>
                <div className="feature-text">
                  <span className="feature-title">Personalized Insights</span>
                  <span className="feature-desc">
                    Tailored recommendations for your health
                  </span>
                </div>
              </div>

              <div className="feature-item">
                <div className="feature-icon">⚡</div>
                <div className="feature-text">
                  <span className="feature-title">Real-time Updates</span>
                  <span className="feature-desc">
                    Instant alerts and monitoring
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="whats-tempo">
          <div>
            <h2 className="tempo-title">
              <span className="title-line">What's</span>
              <span className="title-line highlight">TEMPO?</span>
            </h2>
            <p className="tempo-description">
              TEMPO is a UV-visible spectrometer and{" "}
              <span className="highlight-text">
                the first space-based instrument to measure atmospheric trace{" "}
                gases{" "}
              </span>
              capturing high-resolution data on ozone, nitrogen dioxide and
              other gases in the atmosphere
            </p>
          </div>
          <div className="tempoImg">
            <img src={tempoImage} alt="tempo map" />
          </div>
        </div>
      </div>

      <HealthAssessmentPopup
        isOpen={showHealthAssessment}
        onClose={closeHealthAssessment}
      />

      <footer className="footer-section">
        <div className="footer-container">
          <div className="footer-left">
            <img
              className="footer-logo"
              src={!isDarkTheme ? spaceAppsLogo : spaceAppsLogo2}
              alt="NASA Space Apps Logo"
            />
          </div>

          <div className="footer-center">
            <p className="footer-quote">
              <span className="highlight-text">ReBreath</span> — powered by
              data, driven by impact.
            </p>
            <p className="footer-small">
              Built for <strong>NASA Space Apps Challenge 2025</strong>
            </p>
          </div>

          <div className="footer-right">
            <p className="footer-credits">
              Designed with ❤️ by the ReBreath Team
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Home;
