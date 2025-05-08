import { createContext, useContext } from "react";
import { useIndexedDB } from "../Hooks/useIndexedDB";
import type { IDBPDatabase } from "idb";

const IndexDBContext = createContext<{
  indexDB: IDBPDatabase<unknown> | undefined;
}>({
  indexDB: undefined,
});

export const useIndexedDBContext = () => useContext(IndexDBContext);

export default function ({ children }: { children: React.ReactNode }) {
  const { indexedDB } = useIndexedDB();

  return (
    <IndexDBContext.Provider
      value={{
        indexDB: indexedDB,
      }}
    >
      {children}
    </IndexDBContext.Provider>
  );
}
