import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.tsx";
import IndexedDBProvider from "./Context/IndexedDBContext.tsx";
import { ErrorBoundary } from "react-error-boundary";
import ErrorFallbackComponent from "./Components/ErrorFallbackComponent";
import "@xyflow/react/dist/style.css"; // this fixed the styling issue due to lazy loading
// importing directly in main.ts rather than chart page.
import "./index.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
      <IndexedDBProvider>
        <App />
      </IndexedDBProvider>
    </ErrorBoundary>
  </React.StrictMode>,
);
