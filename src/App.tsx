import { BrowserRouter, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import useDark from "./Hooks/useDark";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import UserDataBase from "./pages/UserDataBase";

function App() {
  const { isDarkMode } = useDark();

  useEffect(() => {
    document
      .querySelector("html")
      ?.setAttribute("data-theme", isDarkMode ? "dark" : "light"!);
  }, [isDarkMode]);

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/db/:name" element={<UserDataBase.DataBaseLayout />}>
            <Route index element={<UserDataBase.Overview />} />
            <Route path=":table" element={<UserDataBase.DatabaseTable />} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
