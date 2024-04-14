import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { DBProvider } from "./Context/DBContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DBProvider>
      <App />
    </DBProvider>
  </React.StrictMode>
);
