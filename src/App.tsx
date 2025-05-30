import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { useEffect } from "react";
import useDark from "./Hooks/useDark";
import routes from "./routes";

function App() {
  const { isDarkMode } = useDark();

  useEffect(() => {
    document
      .querySelector("html")
      ?.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  const router = createBrowserRouter(routes);
  return <RouterProvider router={router} />;
}

export default App;
