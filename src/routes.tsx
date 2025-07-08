import { Navigate, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import NotFound from "./pages/NotFound";
import SupportPage from "./pages/Support";
import { DBProvider } from "./Context/DBContext";
import { lazy, Suspense } from "react";
import LoadingPage from "./Components/LoadingPage";

// db routes
const DBHome = lazy(() => import("./pages/DBHome"));
const DataBaseLayout = lazy(() => import("./pages/Tables/DataBaseLayout"));
const DatabaseTable = lazy(() => import("./pages/Tables/DatabaseTable"));
const Overview = lazy(() => import("./pages/Tables/Overview"));
const ChartDB = lazy(() => import("./pages/Charts"));
const QueryBuilder = lazy(() => import("./pages/QueryBuilder"));

const withSuspense = (element: React.ReactNode) => (
  <Suspense fallback={<LoadingPage />}>{element}</Suspense>
);

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
        element: withSuspense(<DBHome />),
      },
      {
        path: "tables",
        element: withSuspense(<DataBaseLayout />),
        children: [
          {
            index: true,
            element: withSuspense(<Overview />),
          },
          {
            path: ":table",
            element: withSuspense(<DatabaseTable />),
          },
        ],
      },
      {
        path: "charts",
        element: withSuspense(<ChartDB />),
      },
      {
        path: "queryBuilder",
        element: withSuspense(<QueryBuilder />),
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
