import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Database } from "sql.js";
import SearchTable from "../SearchTable";
import Skeleton from "../Skeleton";
import { queries } from "../../Utils/queriesUtils";

function TableSideBar({ db }: { db: Database }) {
  const tables = useMemo(() => {
    const queryResult = db.exec(queries.table.allTables);
    const rows = queryResult[0].values.map((r) => r[0]);
    return rows;
  }, [db]);

  const [searchTables, setSearchTables] = useState(tables);

  return (
    <section className="flex flex-col gap-5 rounded bg-base-300 pb-5">
      <div className="mx-6 mt-6 flex justify-between">
        <h2 className="text-xl font-bold">Tables</h2>
        <Link className="link link-info" to=".." relative="route">
          ← Go Back
        </Link>
      </div>

      <SearchTable originalTable={tables} setSearchTables={setSearchTables} />
      {typeof tables === "undefined" ? (
        <div
          className="flex w-full flex-col items-center gap-5"
          data-testid="loading-spinner"
        >
          <Skeleton className="mx-5" width={"200px"} height={20} count={7} />
        </div>
      ) : (
        <ul className="mx-5 rounded-lg bg-base-200 py-5 text-base-content shadow-lg">
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
