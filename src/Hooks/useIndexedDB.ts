import { useState, useEffect } from "react";
import { IDBPDatabase, openDB } from "idb";

export const storeFileName = "DBFiles";

/**
 * useIndexedDB is a custom hook that manages an IndexedDB database for storing files.
 * @returns {IDBPDatabase | null} - Returns the IndexedDB database instance or null if not initialized yet.
 * @example
 * // Example usage:
 * const db = useIndexedDB();
 * if (db) {
 *   // Perform database operations
 * }
 */
export const useIndexedDB = () => {
  const [indexedDB, setIndexedDB] = useState<IDBPDatabase>();

  useEffect(() => {
    const initializeDB = async () => {
      // Check if the database already exists
      const existingDB = await openDB("FileStorage", 1, {
        upgrade(db) {
          // Create the "DB Files" store if it doesn't exist
          if (!db.objectStoreNames.contains(storeFileName)) {
            db.createObjectStore(storeFileName);
          }
        },
      });

      setIndexedDB(existingDB);
    };

    initializeDB();
    return () => {
      console.log("clean up in Hook");
      setIndexedDB(undefined);
    };
  }, []);

  return { indexedDB };
};
