import React from "react";
import { createContext, useContext } from "react";
import { useDefaultGetDB } from "../Hooks/useDefaultGetDB";
import { useIndexedDB } from "../Hooks/useIndexedDB";
import type { Database } from "sql.js";
import type { IDBPDatabase } from "idb";

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
  // Retrieve the database connection using a custom hook (useDefaultGetDB)
  const { db } = useDefaultGetDB();
  const { indexedDB } = useIndexedDB();
  return (
    <DbContext.Provider value={{ db, indexedDB }}>
      {children}
    </DbContext.Provider>
  );
};
