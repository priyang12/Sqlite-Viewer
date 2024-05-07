import { useEffect, useState } from "react";
import { useDefaultGetDB } from "./useDefaultGetDB";
import { getTableQuery } from "../Utils/tableUtils";

/**
 * Custom hook to generate a SQL substring query for a specified table name.
 *
 * @param {string} tableName - The name of the table.
 * @returns {Object} An object containing the generated SQL substring query and loading status.
 * @example
 * // Example usage:
 * const { querySubstr, loading } = useGetSubStrQuery("tableName");
 * // 'querySubstr' contains the generated SQL substring query
 * // 'loading' indicates whether the query is currently being executed
 */
export const useGetSubStrQuery = (tableName: string | undefined) => {
  const { db } = useDefaultGetDB();
  const [loading, setLoading] = useState(false);
  const [querySubstr, setQuerySubstr] = useState<string>();

  useEffect(() => {
    if (db && tableName) {
      try {
        setLoading(true);
        const result = db.exec(getTableQuery(tableName));
        setQuerySubstr(`${result[0].values[0][0]} FROM ${tableName};`);
      } catch (error) {
        console.error(error);
      } finally {
        setTimeout(() => {
          setLoading(false);
        }, 1000);
      }
    }
    () => setQuerySubstr(undefined);
  }, [db, tableName]);

  return {
    loading,
    querySubstr,
  };
};
