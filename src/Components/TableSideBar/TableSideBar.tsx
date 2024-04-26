import { useEffect, useState } from "react";
import { useGetData } from "../../Hooks/useGetData";
import SearchTable from "../SearchTable";
import { Link } from "react-router-dom";

const tableQuery = "SELECT name FROM sqlite_master WHERE type='table'";

function TableSideBar() {
  const { row: DBtables, loading } = useGetData(tableQuery);
  const [tables, setTables] = useState(DBtables);

  useEffect(() => {
    if (DBtables) setTables(DBtables);
  }, [DBtables]);

  if (loading) {
    return (
      <div className="m-10 flex min-h-[40vh]">
        <span
          className="loading loading-spinner loading-lg"
          data-testid="loading-spinner"
        ></span>
      </div>
    );
  }

  return (
    <div>
      <section className="flex h-full w-full  flex-col gap-5 rounded bg-base-300 p-5">
        <h2 className="mx-6 mt-6 text-xl font-bold">Tables </h2>
        <SearchTable setTables={setTables} DBtables={DBtables} />
        <ul className="mx-5 rounded-lg bg-base-200 py-5 text-base-content shadow-lg">
          {tables ? (
            tables.length > 0 ? (
              tables.map((item, index) => (
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
      </section>
    </div>
  );
}

export default TableSideBar;
