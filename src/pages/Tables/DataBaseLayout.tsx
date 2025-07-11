import { useParams, Outlet } from "react-router-dom";
import TableSideBar from "../../Components/TableSideBar";
import { useGetDBContext } from "../../Context/DBContext";
import Skeleton from "../../Components/Skeleton";
import Loading from "../../Components/Loading";
import ErrorFallbackComponent, {
  WrappedErrorBoundary,
} from "../../Components/ErrorFallbackComponent/ErrorFallbackComponent";
import { ErrorBoundary } from "react-error-boundary";

// fix loading layouts.
const DataBaseLayout = () => {
  const { name } = useParams();
  const { dbLoaded } = useGetDBContext();

  return (
    <div className="bg-base-100">
      <header className="my-5 flex justify-center">
        <h1 className="text-5xl font-thin">DataBase : {name}</h1>
      </header>
      <main className="mx-16 mb-10 min-h-[100vh] overflow-hidden bg-base-200 md:flex">
        {!dbLoaded ? (
          <div
            className="flex w-full flex-col items-center gap-5"
            data-testid="loading-spinner"
          >
            <Skeleton className="mx-5" width={"200px"} height={20} count={7} />
          </div>
        ) : (
          <ErrorBoundary
            fallbackRender={(props) => (
              <div className="flex flex-col gap-5 rounded bg-base-300 pb-5">
                <ErrorFallbackComponent {...props} />
              </div>
            )}
          >
            <TableSideBar />
          </ErrorBoundary>
        )}

        <section className="sm:w-3/4">
          <WrappedErrorBoundary>
            {!dbLoaded ? <Loading /> : <Outlet />}
          </WrappedErrorBoundary>
        </section>
      </main>
    </div>
  );
};

export default DataBaseLayout;
