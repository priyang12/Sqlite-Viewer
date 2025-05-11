import { SqlValue } from "sql.js";
import Skeleton from "../Skeleton";

const SearchTable = ({
  originalTable,
  setSearchTables,
}: {
  originalTable: SqlValue[] | undefined;
  setSearchTables: React.Dispatch<React.SetStateAction<SqlValue[]>>;
}) => {
  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase(); // Get the search term
    if (originalTable) {
      const filteredTables = originalTable.filter((table) =>
        table?.toString().toLowerCase().includes(searchTerm),
      );
      setSearchTables(filteredTables);
    }
  };

  return (
    <>
      {!originalTable ? (
        <Skeleton className="input mx-5" width={"150px"} />
      ) : (
        <label className="input input-bordered mx-5 flex items-center gap-2 bg-base-300">
          <input
            type="text"
            className="grow"
            placeholder="Search Table"
            onChange={onChange}
          />
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16"
            fill="currentColor"
            className="h-4 w-4 opacity-70"
          >
            <path
              fillRule="evenodd"
              d="M9.965 11.026a5 5 0 1 1 1.06-1.06l2.755 2.754a.75.75 0 1 1-1.06 1.06l-2.755-2.754ZM10.5 7a3.5 3.5 0 1 1-7 0 3.5 3.5 0 0 1 7 0Z"
              clipRule="evenodd"
            />
          </svg>
        </label>
      )}
    </>
  );
};

export default SearchTable;
