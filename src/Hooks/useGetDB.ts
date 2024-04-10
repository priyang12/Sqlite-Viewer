import { useState, useEffect } from "react";
import initSqlJs from "sql.js";
import sqlWasm from "sql.js/dist/sql-wasm.wasm?url";

const useGetDB = (file: File | null) => {
  const [db, setDb] = useState<initSqlJs.Database>();

  useEffect(() => {
    if (!file) return;
    const loadDatabase = async () => {
      try {
        const arrayBuffer = await file.arrayBuffer();
        const SQL = await initSqlJs({
          locateFile: () => sqlWasm,
        });
        const db = new SQL.Database(new Uint8Array(arrayBuffer));
        setDb(db);
      } catch (error) {
        console.log(error);
      }
    };
    loadDatabase();
    return () => {
      setDb(undefined);
    };
  }, [file]);
  return { db };
};

export default useGetDB;
