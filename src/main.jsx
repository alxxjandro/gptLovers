import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import Results from "./results-screen.jsx";


createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Results />
  </StrictMode>
);
