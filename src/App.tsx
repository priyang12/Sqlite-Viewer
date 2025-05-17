import { BrowserRouter, Outlet, Route, Routes } from "react-router-dom";
import { useEffect } from "react";
import useDark from "./Hooks/useDark";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import UserDataBase from "./pages/UserDataBase";
import { DBProvider } from "./Context/DBContext";
import ChartDB from "./pages/UserDataBase/ChartDB";

function DBLayoutWrapper() {
  return (
    <DBProvider>
      <Outlet />
    </DBProvider>
  );
}

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

          <Route element={<DBLayoutWrapper />}>
            <Route path="/db/:name" element={<UserDataBase.DataBaseLayout />}>
              <Route index element={<UserDataBase.Overview />} />
              <Route path=":table" element={<UserDataBase.DatabaseTable />} />
            </Route>
            {/* temp fix later change the routes to db/tables and db/chart */}
            <Route path="/chart/:name" element={<ChartDB />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
