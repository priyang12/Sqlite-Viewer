import { createBrowserRouter, Outlet, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import useDark from "./Hooks/useDark";
import routes from "./routes";
import { WrappedErrorBoundary } from "./Components/ErrorFallbackComponent";

const ErrorBoundaryLayout = () => (
  <div className="h-screen">
    <WrappedErrorBoundary>
      <Outlet />
    </WrappedErrorBoundary>
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
