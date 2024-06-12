import React, { useCallback, useEffect, useState } from "react";
import { createContext, useContext } from "react";
import { storeFileName, useIndexedDB } from "../Hooks/useIndexedDB";
import { useGetDB } from "../Hooks/useGetDB";
import type { Database } from "sql.js";
import type { IDBPDatabase } from "idb";

export type DBContextType = {
  db: Database | undefined;
  indexedDB: IDBPDatabase | undefined;
  setDBFileName: (value: string) => void;
};

// Create a context object for managing the database connection
const DbContext = createContext<DBContextType>({
  db: undefined, // Default context value with an undefined database connection
  indexedDB: undefined, // Default value
  setDBFileName: () => {},
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
  const [indexFileName, setIndexFileName] = useState("");
  const [databaseFile, setDatabaseFile] = useState<File>();
  const { indexedDB } = useIndexedDB();
  const { db } = useGetDB(databaseFile);

  useEffect(() => {
    if (indexFileName) {
      const getDBFile = async () => {
        const database = await indexedDB?.get(storeFileName, indexFileName);
        setDatabaseFile(database);
      };
      getDBFile();
    }
  }, [indexedDB, indexFileName]);

  const setDBFileName = useCallback(
    (fileName: string) => setIndexFileName(fileName),
    [],
  );

  return (
    <DbContext.Provider value={{ db, indexedDB, setDBFileName }}>
      {children}
    </DbContext.Provider>
  );
};
