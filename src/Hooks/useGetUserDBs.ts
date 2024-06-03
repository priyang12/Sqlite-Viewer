import { useEffect, useState } from "react";
import { DBContextType } from "../Context/DBContext";

export type storedKeysType = IDBValidKey[] | [];

/**
 * useGetUserDBs is a custom hook that retrieves the keys of databases stored in the "DBFiles" store.
 * @returns {{ storedDBs: storedKeysType, setStoredDBs: React.Dispatch<React.SetStateAction<storedKeysType>> }} - Returns an object containing an array of database keys or undefined if not initialized yet.
 * @example
 * // Example usage:
 * const { storedDBs } = useGetUserDBs();
 * if (storedDBs) {
 *   // Access the array of database keys
 * }
 */
export const useGetUserDBs = (indexedDB: DBContextType["indexedDB"]) => {
  const [storedDBs, setStoredDBs] = useState<storedKeysType>([]);

  useEffect(() => {
    if (indexedDB) {
      (async () => {
        const dbs = await indexedDB.getAllKeys("DBFiles");
        if (dbs) setStoredDBs(dbs);
      })();
    }
    return () => setStoredDBs([]);
  }, [indexedDB]);

  return {
    storedDBs,
    setStoredDBs,
  };
};
