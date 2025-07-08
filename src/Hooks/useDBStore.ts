import { useCallback, useEffect, useState } from "react";
import { insertDB, removeDb } from "../Utils/indexDBUtils";
import { useIndexedDBContext } from "../Context/IndexedDBContext";
import { useErrorBoundary } from "react-error-boundary";

export type storedKeysType = IDBValidKey[] | [];

export const useDBStore = () => {
  const { indexDB: indexedDB } = useIndexedDBContext();
  const { showBoundary } = useErrorBoundary();
  const [storedDBs, setStoredDBs] = useState<storedKeysType>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    async function getKeys() {
      if (indexedDB !== undefined) {
        const dbs = await indexedDB.getAllKeys("DBFiles");
        if (dbs) setStoredDBs(dbs);
      }
    }
    getKeys();
  }, [indexedDB]);

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
        showBoundary(error);
      } finally {
        setIsLoading(false);
      }
    },
    [indexedDB, setStoredDBs, showBoundary],
  );

  const removeUserDB = useCallback(
    async (fileName: string) => {
      try {
        setIsLoading(true);
        if (indexedDB) {
          const result = await removeDb(indexedDB, fileName);
          if (result) {
            setStoredDBs((currentArr) =>
              currentArr.filter((item) => item.toString() !== fileName),
            );
            // set notification here.
            alert(`The DB ${fileName} has been removed`);
          }
        }
      } catch (error) {
        showBoundary(error);
      } finally {
        setIsLoading(false);
      }
    },
    [indexedDB, setStoredDBs, showBoundary],
  );

  return { isLoading, storedDBs, insertUserDB, removeUserDB };
};
