import { useState, useEffect } from "react";
import initSqlJs from "sql.js";
import sqlWasm from "sql.js/dist/sql-wasm.wasm?url";
import databaseFile from "../../database/seed.db?url";

/**
 * useDefaultGetDB is a custom hook to load the default SQLite database file.
 * @returns {object} - Returns an object containing the loaded database.
 * @example
 * // Example usage:
 * const { db } = useDefaultGetDB();
 */
export const useDefaultGetDB = () => {
  const [db, setDb] = useState<initSqlJs.Database>();
  useEffect(() => {
    const loadDatabase = async () => {
      try {
        const arrayBuffer = await fetch(databaseFile).then((res) =>
          res.arrayBuffer()
        );

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
  }, []);
  return { db };
};
