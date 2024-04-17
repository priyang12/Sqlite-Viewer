import React, { useCallback, useState } from "react";
import { createContext, useContext } from "react";
import { storedKeysType, useGetUserDBs } from "../Hooks/useGetUserDBs";
import { useGetDBContext } from "./DBContext";
import { insertDB, removeDb } from "../Utils/indexDBUtils";

export type storeContextType = {
  Loading: boolean;
  storedDBs: storedKeysType;
  insertUserDB: (file: File) => Promise<void>;
  removeUserDB: (fileName: string) => Promise<void>;
};

// Create a context object for managing the database connection
const StoreContext = createContext<storeContextType>({
  Loading: false,
  storedDBs: [],
  insertUserDB: async () => {}, // Placeholder function
  removeUserDB: async () => {}, // Placeholder function
});

// Custom hook to easily access the database context
// eslint-disable-next-line react-refresh/only-export-components
export const useStoreContext = () => useContext(StoreContext);

// type storeState = {
//   storedDBs: storedKeysType;
// };

// function storeReducer(
//   state: storeState,
//   action: { type: string; payload: any }
// ) {
//   switch (action.type) {
//     case "add": {
//       const array = new Array(state.storedDBs);
//       return {
//         ...state,
//       };
//     }
//     case "remove": {
//     }
//   }

//   throw Error("Unknown action: " + action.type);
// }

/**
 * StoreProvider is a component that provides a database context to its children.
 * @param {Object} props - Props for the DBProvider component.
 * @param {React.ReactNode} props.children - The children components that need access to the database context.
 * @returns {JSX.Element} - Returns JSX for the DBProvider component.
 * @example
 * // Example usage:
 * <StoreProvider>
 *   <App />
 * </StoreProvider>
 */
export const StoreProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const { indexedDB } = useGetDBContext();
  const [isLoading, setIsLoading] = useState(false);
  const { storedDBs, setStoredDBs } = useGetUserDBs(indexedDB);

  const insertUserDB = useCallback(
    async (file: File) => {
      try {
        setIsLoading(true);
        if (indexedDB) {
          const result = await insertDB(indexedDB, file);
          if (result) {
            setStoredDBs((current) => [...current, result]);
          }
        }
      } catch (error) {
        // set notification here.
      } finally {
        setIsLoading(false);
      }
    },
    [indexedDB, setStoredDBs]
  );

  const removeUserDB = useCallback(
    async (fileName: string) => {
      try {
        setIsLoading(true);
        if (indexedDB) {
          const result = await removeDb(indexedDB, fileName);
          if (result) {
            setStoredDBs((currentArr) =>
              currentArr.filter((item) => item.toString() !== fileName)
            );
            // set notification here.
            alert(`The DB ${fileName} has been removed`);
          }
        }
      } catch (error) {
        // set notification here.
      } finally {
        setIsLoading(false);
      }
    },
    [indexedDB, setStoredDBs]
  );

  return (
    <StoreContext.Provider
      value={{ Loading: isLoading, storedDBs, insertUserDB, removeUserDB }}
    >
      {children}
    </StoreContext.Provider>
  );
};
