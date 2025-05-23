import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Database, SqlValue } from "sql.js";
import SearchTable from "../SearchTable";
import Skeleton from "../Skeleton";

const tableQuery = "SELECT name FROM sqlite_master WHERE type='table'";

function TableSideBar({ db }: { db: Database }) {
  const { name } = useParams();
  const tables = useMemo(() => {
    const queryResult = db.exec(tableQuery);
    const rows = queryResult[0].values.map((r) => r[0]);
    return rows;
  }, [db]);

  const [searchTables, setSearchTables] = useState(tables);

  return (
    <section className="flex flex-col gap-5 rounded bg-base-300 pb-5">
      <Link to={`/db/chart/${name}`} className="link">
        DB Chart
      </Link>

      <h2 className="mx-6 mt-6 text-xl font-bold">Tables </h2>
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
