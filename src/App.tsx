import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import { useEffect } from "react";
import useDark from "./Hooks/useDark";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import UserDataBase from "./pages/UserDataBase";
import { DBProvider } from "./Context/DBContext";
import ChartDB from "./pages/UserDataBase/ChartDB";
import QueryBuilder from "./pages/UserDataBase/QueryBuilder";

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
      ?.setAttribute("data-theme", isDarkMode ? "dark" : "light");
  }, [isDarkMode]);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/db" element={<DBLayoutWrapper />}>
          <Route path="tables/:name" element={<UserDataBase.DataBaseLayout />}>
            <Route index element={<UserDataBase.Overview />} />
            <Route path=":table" element={<UserDataBase.DatabaseTable />} />
          </Route>
          <Route path="chart/:name" element={<ChartDB />} />
          <Route path="queryBuilder/:name" element={<QueryBuilder />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
