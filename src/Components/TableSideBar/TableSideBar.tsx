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
      <div className="flex m-10 min-h-[40vh]">
        <span
          className="loading loading-spinner loading-lg"
          data-testid="loading-spinner"
        ></span>
      </div>
    );
  }

  return (
    <div>
      <section className="flex flex-col bg-base-300  p-5 rounded gap-5 w-full h-full">
        <h2 className="mx-6 mt-6 text-xl font-bold">Tables </h2>
        <SearchTable setTables={setTables} DBtables={DBtables} />
        <ul className="mx-5 py-5 bg-base-200 text-base-content rounded-lg shadow-lg">
          {tables ? (
            tables.length > 0 ? (
              tables.map((item, index) => (
                <li
                  key={index}
                  className="py-2 px-4 hover:bg-primary-darker transition-colors duration-300"
                >
                  <Link
                    to={`${item?.toString()}`}
                    className="text-primary-dark hover:text-white transition-colors duration-300"
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
