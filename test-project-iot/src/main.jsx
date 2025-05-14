import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";

import "./index.css";
import { DarkModeProvider } from "./hooks/useContextDarkMode.jsx";

createRoot(document.getElementById("root")).render(
  <Router>
    <DarkModeProvider>
      <App />
    </DarkModeProvider>
  </Router>
);
