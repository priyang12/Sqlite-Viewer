import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import useDark from "./Hooks/useDark";
import routes from "./routes";
import ErrorFallbackComponent from "./Components/ErrorFallbackComponent/ErrorFallbackComponent";
import { ErrorBoundary } from "react-error-boundary";

const ErrorBoundaryLayout = () => (
  <div className="h-screen">
    <ErrorBoundary FallbackComponent={ErrorFallbackComponent}>
      <Outlet />
    </ErrorBoundary>
  </div>
);

function App() {
  const { isDarkMode } = useDark();

  useEffect(() => {
    document
      .querySelector("html")
      ?.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const router = createBrowserRouter([
    {
      element: <ErrorBoundaryLayout />,
      children: routes,
    },
  ]);
  return <RouterProvider router={router} />;
}

export default App;
