import { Navigate, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import UserDataBase from "./pages/UserDataBase/Tables";
import Charts from "./pages/UserDataBase/Charts";
import Builder from "./pages/UserDataBase/QueryBuilder";
import SupportPage from "./pages/support";
import { DBProvider } from "./Context/DBContext";

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
    element: <DBLayoutWrapper />,
    children: [
      {
        path: "tables/:name",
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
        path: "charts/:name",
        element: <Charts.ChartDB />,
      },
      {
        path: "queryBuilder/:name",
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
