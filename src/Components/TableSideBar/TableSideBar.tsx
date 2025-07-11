import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import SearchTable from "../SearchTable";
import Skeleton from "../Skeleton";
import { useGetDBContext } from "../../Context/DBContext";

function TableSideBar() {
  const { workerRef } = useGetDBContext();
  const [isLoading, setIsLoading] = useState(false);
  const [tables, setTables] = useState<string[]>([]);

  useEffect(() => {
    (async () => {
      if (workerRef?.current) {
        setIsLoading(true);
        try {
          const result = await workerRef.current.getAllTables();
          if (result) {
            setTables(result);
            setSearchTables(result);
          }
        } catch (err) {
          console.error("Failed to load tables", err);
          throw Error("Error While Fetching Table Data");
        } finally {
          setIsLoading(false);
        }
      }
    })();
  }, [workerRef?.current]);

  const [searchTables, setSearchTables] = useState(tables);

  return (
    <section className="flex h-[100vh] flex-col gap-5 rounded bg-base-300 pb-5">
      <div className="mx-6 mt-6 flex justify-between">
        <h2 className="text-xl font-bold">Tables</h2>
        <Link className="link link-info" to=".." relative="route">
          ← Go Back
        </Link>
      </div>

      <SearchTable originalTable={tables} setSearchTables={setSearchTables} />
      {isLoading ? (
        <div
          className="flex w-full flex-col items-center gap-5"
          data-testid="loading-spinner"
        >
          <Skeleton className="mx-5" width={"200px"} height={20} count={7} />
        </div>
      ) : (
        <ul className="mx-5 h-[80vh] overflow-auto rounded-lg bg-base-200 py-5 text-base-content shadow-lg">
          {searchTables ? (
            searchTables.length > 0 ? (
              searchTables.map((item, index) => (
                <li
                  key={index}
                  className="hover:bg-primary-darker px-4 py-2 transition-colors duration-300"
                >
                  <Link
                    to={`${item?.toString()}`}
                    className="text-primary-dark transition-colors duration-300 hover:text-white"
                  >
                    {item?.toString()}
                  </Link>
                </li>
              ))
            ) : (
              <div>
                <h4 className="text-center font-bold">
                  No Tables in Database.
                </h4>
              </div>
            )
          ) : null}
        </ul>
      )}
    </section>
  );
}

export default TableSideBar;
