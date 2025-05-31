import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import IndexedDBProvider from "./Context/IndexedDBContext.tsx";
import "./index.css";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallbackComponent from "./Components/ErrorFallbackComponent";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
      <IndexedDBProvider>
        <App />
      </IndexedDBProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
