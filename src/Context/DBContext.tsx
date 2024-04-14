import React from "react";
import { createContext, useContext } from "react";
import { useDefaultGetDB } from "../Hooks/useDefaultGetDB";
import type { Database } from "sql.js";

// Create a context object for managing the database connection
const DbContext = createContext<{ db: Database | undefined }>({
  db: undefined, // Default context value with an undefined database connection
});

// Custom hook to easily access the database context
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

  return <DbContext.Provider value={{ db }}>{children}</DbContext.Provider>;
};
