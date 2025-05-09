import React, { useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { storeFileName } from "../Hooks/useIndexedDB";
import { loadDatabase } from "../Hooks/useGetDB";
import type { Database } from "sql.js";
import type { IDBPDatabase } from "idb";
import { useIndexedDBContext } from "./IndexedDBContext";
import { useParams } from "react-router-dom";

export type DBContextType = {
  db: Database | undefined;
  indexedDB: IDBPDatabase | undefined;
};

// Create a context object for managing the database connection
const DbContext = createContext<DBContextType>({
  db: undefined, // Default context value with an undefined database connection
  indexedDB: undefined, // Default value
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
  const [db, setDb] = useState<Database>();

  useEffect(() => {
    if (name) {
      const getDBFile = async () => {
        const databaseFile = await indexedDB?.get(storeFileName, name);
        if (databaseFile) {
          const db = await loadDatabase(databaseFile);
          setDb(db);
        }
      };
      getDBFile();
    }
  }, [indexedDB, name]);

  return (
    <DbContext.Provider value={{ db, indexedDB }}>
      {children}
    </DbContext.Provider>
  );
};
