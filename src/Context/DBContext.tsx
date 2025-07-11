import React, { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { storeFileName } from "../Hooks/useIndexedDB";
import { useSqlWorker } from "../Hooks/useSqlWorker";
import type { Database } from "sql.js";
import type { IDBPDatabase } from "idb";
import { useIndexedDBContext } from "./IndexedDBContext";
import { useParams } from "react-router-dom";
import { loadDatabase } from "../Hooks/useGetDB";
import { Remote } from "comlink";
import { SqlWorkerAPI } from "../workers/sqlWorker";

export type DBContextType = {
  indexedDB: IDBPDatabase | undefined;
  dbLoaded: boolean;
  workerRef: React.RefObject<Remote<SqlWorkerAPI> | null> | undefined;
};

// Create a context object for managing the database connection
const DbContext = createContext<DBContextType>({
  dbLoaded: false, // check if db is loaded in web-worker.
  indexedDB: undefined, // Default value
  workerRef: undefined, // worker reference
});

// Custom hook to easily access the database context
// eslint-disable-next-line react-refresh/only-export-components
export const useGetDBContext = () => useContext(DbContext);

/**
 * DBProvider is a component that provides a database context to its children.
 * @param {Object} props - Props for the DBProvider component.
 * @param {React.ReactNode} props.children - The children components that need access to the database context.
 * @returns {JSX.Element} - Returns JSX for the DBProvider component.
 * @example
 * // Example usage:
 * <DBProvider>
 *   <App />
 * </DBProvider>
 */
export const DBProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { name } = useParams();
  const { indexDB: indexedDB } = useIndexedDBContext();
  const [dbLoaded, setDBLoaded] = useState(false);
  const workerRef = useSqlWorker();

  useEffect(() => {
    if (name && workerRef.current && indexedDB) {
      const getDBFile = async () => {
        const databaseFile = await indexedDB.get(storeFileName, name);
        if (databaseFile) {
          const res = await workerRef.current?.loadDatabase(databaseFile);
          if (res) {
            setDBLoaded(res.result === "success");
          }
        }
      };
      getDBFile();
    }
  }, [indexedDB, name, workerRef.current]);

  return (
    <DbContext.Provider value={{ indexedDB, dbLoaded, workerRef }}>
      {children}
    </DbContext.Provider>
  );
};
