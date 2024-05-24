import { useEffect, useState } from "react";
import { useDefaultGetDB } from "./useDefaultGetDB";
import { SqlValue } from "sql.js";

/**
 * Custom hook to fetch data from a SQLite database using a specified query.
 *
 * @param {string} query - The SQL query to execute.
 * @returns {Object} An object containing the fetched data rows, column names, and loading status.
 * @example
 * // Example usage:
 * const { row, columns, loading } = useGetTableData("SELECT * FROM table");
 * // 'row' contains the fetched data rows
 * // 'columns' contains the column names of the fetched data
 * // 'loading' indicates whether the data is currently being fetched
 */
export const useGetTableData = (query: string | undefined) => {
  const { db } = useDefaultGetDB();
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState<string[]>();
  const [row, setRow] = useState<SqlValue[][]>();

  useEffect(() => {
    if (db && query) {
      try {
        setLoading(true);
        const result = db.exec(query);
        if (result.length > 0) {
          const columns = result[0].columns;
          const rows = result[0].values;
          setColumns(columns);
          setRow(rows);
        } else {
          setColumns(undefined);
          setRow(undefined);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    }
    () => {
      // clean up function is not getting triggered.
      console.log("clean up");
      setColumns(undefined);
      setRow(undefined);
    };
  }, [db, query]);

  return {
    row,
    columns,
    loading,
  };
};
