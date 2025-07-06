import { Navigate, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import UserDataBase from "./pages/Tables";
import Charts from "./pages/Charts";
import Builder from "./pages/QueryBuilder";
import SupportPage from "./pages/Support";
import { DBProvider } from "./Context/DBContext";
import DBHome from "./pages/DBHome";

function DBLayoutWrapper() {
  return (
    <DBProvider>
      <Outlet />
    </DBProvider>
  );
}

const routes = [
  {
    path: "/",
    element: <Home />,
  },

  {
    path: "/support",
    element: <SupportPage />,
  },

  {
    path: "/db",
    element: <Navigate to="/" replace />,
  },

  {
    path: "/db/:name",
    element: <DBLayoutWrapper />,
    children: [
      {
        index: true,
        element: <DBHome />,
      },
      {
        path: "tables",
        element: <UserDataBase.DataBaseLayout />,
        children: [
          {
            index: true,
            element: <UserDataBase.Overview />,
          },
          {
            path: ":table",
            element: <UserDataBase.DatabaseTable />,
          },
        ],
      },
      {
        path: "charts",
        element: <Charts.ChartDB />,
      },
      {
        path: "queryBuilder",
        element: <Builder.QueryBuilder />,
      },
      {
        path: "*",
        element: <Navigate to="/" replace />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
];

export default routes;
