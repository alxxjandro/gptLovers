import { Routes, Route } from "react-router-dom";
import Home from "./Home";
import Results from "./Results";
import AirQualityApp from "./AirQualityApp";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/results" element={<Results />} />
      <Route path="/air-quality" element={<AirQualityApp />} />
    </Routes>
  );
}

export default App;
