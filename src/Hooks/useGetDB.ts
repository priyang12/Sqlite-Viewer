import { useState, useEffect } from "react";
import initSqlJs from "sql.js";
import sqlWasm from "sql.js/dist/sql-wasm.wasm?url";

/**
 * useGetDB is a custom hook to load a SQLite database file.
 * @param {File | null} file - The SQLite database file to load.
 * @returns {object} - Returns an object containing the loaded database.
 * @example
 * // Example usage:
 * const file = ... // Provide the SQLite database file
 * const { db } = useGetDB(file);
 */
export const useGetDB = (file: File | undefined) => {
  const [db, setDb] = useState<initSqlJs.Database>();

  useEffect(() => {
    if (!file) return;
    const loadDatabase = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const SQL = await initSqlJs({
          locateFile: () => sqlWasm,
        });
        const db = new SQL.Database(new Uint8Array(arrayBuffer));
        setDb(db);
      } catch (error) {
        console.error(error);
      }
    };
    loadDatabase();
    return () => {
      setDb(undefined);
    };
  }, [file]);
  return { db };
};
