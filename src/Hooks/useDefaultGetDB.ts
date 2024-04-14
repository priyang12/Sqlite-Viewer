import { useState, useEffect } from "react";
import initSqlJs from "sql.js";
import sqlWasm from "sql.js/dist/sql-wasm.wasm?url";
import databaseFile from "../../database/seed.db?url";

export const useDefaultGetDB = () => {
  const [db, setDb] = useState<initSqlJs.Database>();
  useEffect(() => {
    const loadDatabase = async () => {
      try {
        // const arrayBuffer = await file.arrayBuffer();
        const arrayBuffer = await fetch(databaseFile).then((res) =>
          res.arrayBuffer()
        );

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
  }, []);
  return { db };
};
