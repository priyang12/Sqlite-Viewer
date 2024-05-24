import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import "./index.css";
import { DBProvider } from "./Context/DBContext.tsx";
import { StoreProvider } from "./Context/StoreContext.tsx";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <DBProvider>
      <StoreProvider>
        <App />
      </StoreProvider>
    </DBProvider>
  </React.StrictMode>,
);
