import { useState, useEffect } from "react";
import { Database, QueryExecResult } from "sql.js";

export type queryType = QueryExecResult[];
export type resultType = queryType[];

/**
 * Custom hook to fetch data from a SQLite database using specified queries.
 *
 * @param {string[]} queries - The SQL queries to execute.
 * @returns {Object} An object containing the fetched data rows, column names, and loading status.
 * @example
 * // Example usage:
 * const { data, loading, error } = useSqlQueries([
 *   "SELECT * FROM table1",
 *   "SELECT * FROM table2"
 * ]);
 * // 'data' contains the fetched data for each query
 * // 'loading' indicates whether the data is currently being fetched
 * // 'error' contains any error encountered during the execution
 */
const useSqlQueries = (queries: string[], db: Database) => {
  const [results, setResults] = useState<resultType>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<unknown>(null);

  useEffect(() => {
    const executeQueries = async () => {
      try {
        const promises = queries.map(
          (query) =>
            new Promise((resolve, reject) => {
              try {
                // remove async Promise since exec works in sync.
                const result = db.exec(query);
                resolve(result);
              } catch (e) {
                reject(e);
              }
            }),
        );
        const results = (await Promise.all(promises)) as QueryExecResult[][];
        setResults(results);
      } catch (e) {
        console.error(e);
        setError(e);
      } finally {
        setLoading(false);
      }
    };
    executeQueries();

    return () => {
      setResults([]);
      setError(null);
    };
  }, [db, queries]);

  return { results, loading, error };
};

export default useSqlQueries;
