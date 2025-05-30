import { useParams, Outlet } from "react-router-dom";
import TableSideBar from "../../../Components/TableSideBar";
import { useGetDBContext } from "../../../Context/DBContext";
import Skeleton from "../../../Components/Skeleton";
import Loading from "../../../Components/Loading";

// pass the db from layout by uplifting the state to avoid firing the effect.
const DataBaseLayout = () => {
  const { name } = useParams();
  console.log(name);

  const { db } = useGetDBContext();

  return (
    <div className="bg-base-100">
      <header className="my-5 flex justify-center">
        <h1 className="text-5xl font-thin">DataBase : {name}</h1>
      </header>
      <main className="mx-16 mb-10 min-h-[100vh] overflow-hidden bg-base-200 md:flex">
        {typeof db === "undefined" ? (
          <div
            className="flex w-full flex-col items-center gap-5"
            data-testid="loading-spinner"
          >
            <Skeleton className="mx-5" width={"200px"} height={20} count={7} />
          </div>
        ) : (
          <TableSideBar db={db} />
        )}

        <section className="sm:w-3/4">
          {typeof db === "undefined" ? (
            <Loading />
          ) : (
            <Outlet
              context={{
                db,
              }}
            />
          )}
        </section>
      </main>
    </div>
  );
};

export default DataBaseLayout;
