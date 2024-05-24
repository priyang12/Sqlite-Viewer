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
 * const { row, columns, loading } = useGetData("SELECT * FROM table");
 * // 'row' contains the fetched data rows
 * // 'columns' contains the column names of the fetched data
 * // 'loading' indicates whether the data is currently being fetched
 */
export const useGetData = (query: string) => {
  const { db } = useDefaultGetDB();
  const [loading, setLoading] = useState(false);
  const [columns, setColumns] = useState<string[]>();
  const [row, setRow] = useState<SqlValue[]>();

  useEffect(() => {
    if (db) {
      try {
        setLoading(true);
        const result = db.exec(query);
        const columns = result[0].columns;
        const rows = result[0].values.map((row) => row[0]);
        setColumns(columns);
        setRow(rows);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    () => {
      setColumns(undefined);
      setRow(undefined);
      setLoading(false);
    };
  }, [db]);

  return {
    row,
    columns,
    loading,
  };
};
