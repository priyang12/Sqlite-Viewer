import { useEffect, useState } from "react";
import { useGetDBContext } from "../Context/DBContext";

/**
 * useGetUserDBs is a custom hook that retrieves the keys of databases stored in the "DBFiles" store.
 * @returns {{ storedDBs: IDBValidKey[] | undefined }} - Returns an object containing an array of database keys or undefined if not initialized yet.
 * @example
 * // Example usage:
 * const { storedDBs } = useGetUserDBs();
 * if (storedDBs) {
 *   // Access the array of database keys
 * }
 */
export const useGetUserDBs = () => {
  const [storedDBs, setStoredDBs] = useState<IDBValidKey[]>();
  const { indexedDB } = useGetDBContext();

  useEffect(() => {
    (async () => {
      const dbs = await indexedDB?.getAllKeys("DBFiles");
      if (dbs) setStoredDBs(dbs);
    })();
    () => setStoredDBs(undefined);
  }, [indexedDB]);

  return {
    storedDBs,
  };
};
